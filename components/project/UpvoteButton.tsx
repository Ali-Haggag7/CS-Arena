"use client";

import { useState, useEffect, useTransition } from "react";
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
    const [mounted, setMounted] = useState(false);

    // Use useTransition to prevent UI blocking while the server request is pending
    const [isPending, startTransition] = useTransition();

    const [optimisticCount, setOptimisticCount] = useState(initialUpvotes);
    const { toast } = useToast();

    useEffect(() => {
        const voted = localStorage.getItem(`upvote_${projectId}`) === "true";
        const hasInteracted = localStorage.getItem(`interacted_${projectId}`) === "true";

        setHasVoted(voted);

        // Smart reconciliation between client state and stale server cache
        if (voted && initialUpvotes === 0) {
            // Server hasn't registered our upvote yet
            setOptimisticCount(1);
        } else if (!voted && hasInteracted && initialUpvotes > 0) {
            // Client explicitly removed vote, but server cache still includes it
            // Subtract 1 to correct the stale server count (safeguard against negative numbers)
            setOptimisticCount(Math.max(0, initialUpvotes - 1));
        } else {
            // Server and client are in sync, or it's a fresh interaction
            setOptimisticCount(initialUpvotes);
        }

        setMounted(true);
    }, [projectId, initialUpvotes]);

    const handleVote = () => {
        if (isPending) return;

        const isUpvoting = !hasVoted;
        const previousCount = optimisticCount;

        // 1. Optimistic update: Update the UI immediately
        setHasVoted(isUpvoting);
        setOptimisticCount((prev) => prev + (isUpvoting ? 1 : -1));

        // 2. Persist state to prevent hydration mismatches and handle caching issues
        localStorage.setItem(`interacted_${projectId}`, "true");
        if (isUpvoting) {
            localStorage.setItem(`upvote_${projectId}`, "true");
        } else {
            localStorage.removeItem(`upvote_${projectId}`);
        }

        // 3. Send the request to the server in the background
        startTransition(async () => {
            try {
                const result = await toggleUpvoteProject(projectId, isUpvoting);

                if (!result || !result.success) {
                    throw new Error("Server action failed");
                }
            } catch (error) {
                // Rollback on failure
                setHasVoted(!isUpvoting);
                setOptimisticCount(previousCount);

                if (!isUpvoting) {
                    localStorage.setItem(`upvote_${projectId}`, "true");
                } else {
                    localStorage.removeItem(`upvote_${projectId}`);
                }

                toast({
                    title: "Action failed",
                    description: "Your vote could not be saved. Please try again.",
                    variant: "destructive",
                });
            }
        });
    };

    return (
        <button
            type="button"
            onClick={handleVote}
            disabled={!mounted || isPending}
            aria-label={hasVoted ? "Remove upvote" : "Upvote this project"}
            aria-pressed={hasVoted}
            className={`flex gap-2 items-center transition-all duration-300
                    ${!mounted ? "opacity-50 pointer-events-none" : "opacity-100 disabled:opacity-60 disabled:cursor-not-allowed"}
                    ${hasVoted && mounted
                    ? "text-primary font-bold scale-105"
                    : "text-black/40 dark:text-white/40 hover:text-primary"
                }`}
        >
            <ThumbsUp
                className={`size-5 transition-all duration-300 ${hasVoted && mounted ? "fill-primary text-primary" : ""
                    }`}
            />
            <span className="text-[18px] font-semibold">
                {optimisticCount} {optimisticCount === 1 ? "Upvote" : "Upvotes"}
            </span>
        </button>
    );
};

export default UpvoteButton;