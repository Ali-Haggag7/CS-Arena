"use client";

import { useState } from "react";
import { Users, CheckCircle, Loader2 } from "lucide-react";
import { sendJoinTeamEmail } from "@/lib/actions";

/**
 * JoinTeamButton Component
 * Triggers a server action to send an email notification to the project owner.
 * Includes loading states and success feedback for optimal UX.
 */
const JoinTeamButton = ({
    projectName,
    ownerEmail
}: {
    projectName: string,
    ownerEmail: string
}) => {
    const [isSending, setIsSending] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleJoinTeam = async () => {
        setIsSending(true);

        // Simulating a sender name. In a real app, fetch this from the authenticated user's session.
        const result = await sendJoinTeamEmail(ownerEmail, projectName, "A Passionate Developer");

        setIsSending(false);

        if (result.success) {
            setIsSent(true);
        } else {
            alert("Something went wrong. Please try again.");
        }
    };

    if (isSent) {
        return (
            <div className="flex items-center gap-2 text-14-medium bg-green-500 text-white px-5 py-2.5 rounded-full shadow-sm transition-all">
                <CheckCircle className="size-5" />
                <span>Request Sent!</span>
            </div>
        );
    }

    return (
        <button
            onClick={handleJoinTeam}
            disabled={isSending}
            className="flex items-center gap-2 text-14-medium bg-black-300 hover:bg-primary text-white px-5 py-2.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {isSending ? (
                <Loader2 className="size-5 animate-spin" />
            ) : (
                <Users className="size-5" />
            )}
            <span>{isSending ? "Sending..." : "Join Team"}</span>
        </button>
    );
};

export default JoinTeamButton;