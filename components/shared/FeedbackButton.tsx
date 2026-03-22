"use client";

import * as Sentry from "@sentry/nextjs";
import { MessageSquareText } from "lucide-react";
import "../../sentry.client.config";

export default function FeedbackButton() {
    const handleClick = async () => {
        const feedback = Sentry.getFeedback();

        if (!feedback) {
            console.error("Sentry Feedback not initialized.");
            return;
        }

        const form = await feedback.createForm();
        form.appendToDom();
        form.open();
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className="flex items-center justify-center p-2 rounded-full text-slate-600 dark:text-white/70 hover:text-primary dark:hover:text-primary hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-300"
            title="Report a bug or suggestion"
        >
            <MessageSquareText className="size-5" />
        </button>
    );
}