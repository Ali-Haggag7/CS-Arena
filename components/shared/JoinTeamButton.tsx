"use client";

import { useState } from "react";
import { Users, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { sendJoinTeamEmail } from "@/lib/actions";
import { useSession } from "next-auth/react";

const JoinTeamButton = ({
    projectName,
    ownerEmail,
}: {
    projectName: string;
    ownerEmail: string;
}) => {
    const [isSending, setIsSending] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState("");

    const { data: session } = useSession();

    const handleJoinTeam = async () => {
        if (!session?.user?.name) {
            setError("You must be logged in to join a team.");
            return;
        }

        setIsSending(true);
        setError("");

        const result = await sendJoinTeamEmail(
            ownerEmail,
            projectName,
            session.user.name
        );

        setIsSending(false);

        if (result.success) {
            setIsSent(true);
        } else {
            setError("Something went wrong. Please try again.");
        }
    };

    if (isSent) {
        return (
            <div className="flex items-center gap-2 text-14-medium bg-green-500 text-white px-5 py-2.5 rounded-full shadow-sm">
                <CheckCircle className="size-5" aria-hidden="true" />
                <span>Request Sent!</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-end gap-2">
            <button
                onClick={handleJoinTeam}
                disabled={isSending || !session}
                aria-label={`Request to join the team for ${projectName}`}
                aria-busy={isSending ? "true" : "false"}
                className="flex items-center gap-2 text-14-medium bg-black/80 dark:bg-white/10 hover:bg-primary text-white px-5 py-2.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {isSending ? (
                    <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                ) : (
                    <Users className="size-5" aria-hidden="true" />
                )}
                <span>{isSending ? "Sending..." : "Join Team"}</span>
            </button>

            {/* Error message */}
            {error && (
                <p className="flex items-center gap-1 text-12-medium text-red-500">
                    <AlertCircle className="size-3.5" aria-hidden="true" />
                    {error}
                </p>
            )}

            {/* Hint for logged out users */}
            {!session && (
                <p className="text-12-medium text-black/40 dark:text-white/40">
                    Login to request joining
                </p>
            )}
        </div>
    );
};

export default JoinTeamButton;