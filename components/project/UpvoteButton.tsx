"use client";

import { useState, useEffect, startTransition, useOptimistic } from "react";
import { ThumbsUp } from "lucide-react";
import { toggleUpvoteProject } from "@/lib/actions";

/**
 * UpvoteButton Component
 * Features:
 * - LocalStorage tracking to prevent infinite spam clicking.
 * - Toggle functionality (Upvote / Remove Upvote).
 * - Optimistic UI updates for zero-latency feedback.
 */
const UpvoteButton = ({
    projectId,
    initialUpvotes,
}: {
    projectId: string;
    initialUpvotes: number;
}) => {
    // Track if the current user (browser) has already voted
    const [hasVoted, setHasVoted] = useState(false);

    // On mount, check if they voted for this specific project previously
    useEffect(() => {
        const voted = localStorage.getItem(`upvote_${projectId}`);
        if (voted === "true") setHasVoted(true);
    }, [projectId]);

    const [optimisticUpvotes, addOptimisticUpvote] = useOptimistic(
        initialUpvotes,
        (state, amount: number) => state + amount
    );

    const handleVote = async () => {
        // Determine the action: if already voted, we are removing the vote (-1)
        const isUpvoting = !hasVoted;

        // 1. Instantly update the Local State & Storage
        setHasVoted(isUpvoting);
        if (isUpvoting) {
            localStorage.setItem(`upvote_${projectId}`, "true");
        } else {
            localStorage.removeItem(`upvote_${projectId}`);
        }

        // 2. Instantly update the UI numbers
        startTransition(() => {
            addOptimisticUpvote(isUpvoting ? 1 : -1);
        });

        // 3. Send the action to the Server
        const result = await toggleUpvoteProject(projectId, isUpvoting);

        if (!result.success) {
            console.error("Failed to sync vote with the database.");
        }
    };

    return (
        <button
            onClick={handleVote}
            className={`flex gap-2 items-center transition-all duration-300 ${hasVoted ? "text-primary font-bold scale-105" : "text-black-200 hover:text-primary"
                }`}
        >
            <ThumbsUp
                className={`size-6 transition-all duration-300 ${hasVoted ? "fill-primary text-primary" : ""
                    }`}
            />
            <span className="text-20-medium">{optimisticUpvotes} Upvotes</span>
        </button>
    );
};

export default UpvoteButton;