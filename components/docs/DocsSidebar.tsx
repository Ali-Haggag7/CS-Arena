"use client";

import Link from "next/link";
import { Book, LayoutTemplate, Terminal } from "lucide-react";
import { useTranslations } from "next-intl";
import { docsConfig } from "@/config/docs";

const iconMap = {
    book: <Book className="size-4" />,
    layout: <LayoutTemplate className="size-4" />,
    terminal: <Terminal className="size-4" />,
};

export default function DocsSidebar({ currentSlug }: { currentSlug: string }) {
    const t = useTranslations("docs_sidebar");
    const tSections = useTranslations("docs_sidebar.sections");
    const tItems = useTranslations("docs_sidebar.items");

    return (
        <aside className="hidden md:flex w-64 lg:w-72 shrink-0 flex-col pt-16 sm:pt-20 pb-24 sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto scrollbar-hide font-work-sans">
            <div className="px-4 py-6">

                {/* Docs label */}
                <div className="flex items-center gap-2 mb-8 px-2">
                    <span className="text-xs font-black text-slate-400 dark:text-white/30 uppercase tracking-widest">
                        {t("label")}
                    </span>
                </div>

                <nav className="space-y-8">
                    {docsConfig.sections.map((section, idx) => (
                        <div key={idx}>
                            {/* Section header */}
                            <div className="flex items-center gap-2.5 mb-3 px-2">
                                <span className="p-1.5 rounded-md bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary">
                                    {iconMap[section.icon as keyof typeof iconMap]}
                                </span>
                                <span className="text-sm font-bold text-slate-800 dark:text-white/80 tracking-wide">
                                    {tSections(section.titleKey)}
                                </span>
                            </div>

                            {/* Section items with logical borders (border-s instead of border-l for RTL support) */}
                            <ul className="space-y-1 border-s border-slate-200 dark:border-white/10 ms-4 ps-3">
                                {section.items.map((item, itemIdx) => {
                                    const isActive = currentSlug === item.slug;
                                    return (
                                        <li key={itemIdx}>
                                            <Link
                                                href={`/docs/${item.slug}`}
                                                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${isActive
                                                    ? "bg-primary/10 dark:bg-primary/10 text-primary"
                                                    : "text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                                                    }`}
                                            >
                                                {/* Active Indicator Line on the edge */}
                                                {isActive && (
                                                    <span className="absolute -start-[13px] top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-full" />
                                                )}
                                                {tItems(item.titleKey)}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>
            </div>
        </aside>
    );
}