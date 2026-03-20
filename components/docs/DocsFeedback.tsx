"use client";

import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useTranslations } from "next-intl";

export default function DocsFeedback({ title }: { title: string }) {
    const t = useTranslations("docs_page");

    return (
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 dark:bg-[#111115] border border-slate-200 dark:border-white/10 px-6 py-4 rounded-2xl w-full md:w-auto shadow-sm">
            <span className="text-sm font-bold text-slate-700 dark:text-white/70">{t("feedback_title")}</span>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => window.open(`https://github.com/Ali-Haggag7/CS-Arena/issues/new?title=👍 Helpful: ${title}&body=I found this page helpful!`, '_blank')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs font-bold hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/30 transition-all"
                >
                    <ThumbsUp className="size-3.5" /> {t("feedback_yes")}
                </button>
                <button
                    type="button"
                    onClick={() => window.open(`https://github.com/Ali-Haggag7/CS-Arena/issues/new?title=👎 Not Helpful: ${title}&body=This page was not helpful because: (please describe)&labels=documentation`, '_blank')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs font-bold hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30 transition-all"
                >
                    <ThumbsDown className="size-3.5" /> {t("feedback_no")}
                </button>
            </div>
        </div>
    );
}