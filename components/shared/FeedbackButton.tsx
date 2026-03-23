"use client";

import * as Sentry from "@sentry/nextjs";
import { MessageSquareText, X, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslations, useLocale } from "next-intl";
import "../../sentry.client.config";

export default function FeedbackButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mounted, setMounted] = useState(false);
    const locale = useLocale();
    const isRtl = locale === "ar";

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;
        setIsSubmitting(true);

        try {
            const client = Sentry.getClient();
            if (client) {
                await Sentry.captureFeedback({
                    name,
                    email,
                    message,
                });
            }
            setSubmitted(true);
            setTimeout(() => {
                setIsOpen(false);
                setSubmitted(false);
                setName("");
                setEmail("");
                setMessage("");
            }, 2000);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="flex items-center justify-center p-2 rounded-full text-slate-600 dark:text-white/70 hover:text-primary dark:hover:text-primary hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-300"
                title={isRtl ? "تبليغ عن مشكلة" : "Report a Bug"}
            >
                <MessageSquareText className="size-5" />
            </button>

            {isOpen && mounted && createPortal(
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999]"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Modal */}
                    <div
                        dir={isRtl ? "rtl" : "ltr"}
                        onClick={(e) => e.stopPropagation()}
                        className="relative z-[100000] w-full max-w-md bg-white dark:bg-[#111115] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-6 space-y-5 animate-in fade-in slide-in-from-bottom-4 max-h-[90vh] my-auto"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-black dark:text-white">
                                {isRtl ? "تبليغ عن مشكلة" : "Report a Bug"}
                            </h3>
                            <button
                                type="button"
                                aria-label="Close"
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        {submitted ? (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-3">✅</div>
                                <p className="font-semibold text-black dark:text-white">
                                    {isRtl ? "شكراً! وصلنا تقريرك" : "Thanks! We received your report"}
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 dark:text-white/50 uppercase tracking-widest block mb-1.5">
                                            {isRtl ? "الاسم" : "Name"}
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            placeholder={isRtl ? "اسمك" : "Your name"}
                                            className="w-full px-3 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-[#0d0d0f] border border-slate-200 dark:border-white/10 text-black dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 dark:text-white/50 uppercase tracking-widest block mb-1.5">
                                            {isRtl ? "الإيميل" : "Email"}
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder={isRtl ? "بريدك@مثال.com" : "your@email.com"}
                                            className="w-full px-3 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-[#0d0d0f] border border-slate-200 dark:border-white/10 text-black dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-500 dark:text-white/50 uppercase tracking-widest block mb-1.5">
                                        {isRtl ? "وصف المشكلة" : "Description"} <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={message}
                                        onChange={e => setMessage(e.target.value)}
                                        placeholder={isRtl ? "ايه المشكلة؟ وايه اللي كنت متوقعه؟" : "What's the bug? What did you expect?"}
                                        className="w-full px-3 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-[#0d0d0f] border border-slate-200 dark:border-white/10 text-black dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                                    />
                                </div>

                                <div className="flex gap-3 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/50 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                                    >
                                        {isRtl ? "إلغاء" : "Cancel"}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !message.trim()}
                                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                    >
                                        <Send className="size-4" />
                                        {isRtl ? "إرسال" : "Send"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}