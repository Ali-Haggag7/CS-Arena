"use client";

import { useState, useEffect, startTransition, useOptimistic } from "react";
import { ThumbsUp } from "lucide-react";
import { toggleUpvoteProject } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

const UpvoteButton = ({
    projectId,
    initialUpvotes,
}: {
    projectId: string;
    initialUpvotes: number;
}) => {
    const [hasVoted, setHasVoted] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const voted = localStorage.getItem(`upvote_${projectId}`);
        if (voted === "true") setHasVoted(true);
    }, [projectId]);

    const [optimisticUpvotes, addOptimisticUpvote] = useOptimistic(
        initialUpvotes,
        (state, amount: number) => state + amount
    );

    const handleVote = async () => {
        if (isPending) return;

        const isUpvoting = !hasVoted;

        // Optimistic update
        setHasVoted(isUpvoting);
        if (isUpvoting) {
            localStorage.setItem(`upvote_${projectId}`, "true");
        } else {
            localStorage.removeItem(`upvote_${projectId}`);
        }

        startTransition(() => {
            addOptimisticUpvote(isUpvoting ? 1 : -1);
        });

        // Server sync
        setIsPending(true);
        try {
            const result = await toggleUpvoteProject(projectId, isUpvoting);

            if (!result.success) {
                // Rollback on failure
                setHasVoted(!isUpvoting);
                if (!isUpvoting) {
                    localStorage.setItem(`upvote_${projectId}`, "true");
                } else {
                    localStorage.removeItem(`upvote_${projectId}`);
                }
                startTransition(() => {
                    addOptimisticUpvote(isUpvoting ? -1 : 1);
                });
                toast({
                    title: "Something went wrong",
                    description: "Your vote could not be saved. Please try again.",
                    variant: "destructive",
                });
            }
        } finally {
            setIsPending(false);
        }
    };

    return (
        <button
            onClick={handleVote}
            disabled={isPending}
            aria-label={hasVoted ? "Remove upvote" : "Upvote this project"}
            aria-pressed={hasVoted}
            className={`flex gap-2 items-center transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed
        ${hasVoted
                    ? "text-primary font-bold scale-105"
                    : "text-black/40 dark:text-white/40 hover:text-primary dark:hover:text-primary"
                }`}
        >
            <ThumbsUp
                className={`size-6 transition-all duration-300 ${hasVoted ? "fill-primary text-primary" : ""
                    }`}
            />
            <span className="text-20-medium">
                {optimisticUpvotes} {optimisticUpvotes === 1 ? "Upvote" : "Upvotes"}
            </span>
        </button>
    );
};

export default UpvoteButton;