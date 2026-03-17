"use client";

import Link from "next/link";
import { docsConfig } from "@/config/docs";
import { Book, LayoutTemplate, Terminal } from "lucide-react";

const iconMap = {
    book: <Book className="size-3.5" />,
    layout: <LayoutTemplate className="size-3.5" />,
    terminal: <Terminal className="size-3.5" />,
};

export default function DocsSidebar({ currentSlug }: { currentSlug: string }) {
    return (
        <aside className="hidden md:flex w-64 lg:w-72 shrink-0 flex-col pt-16 sm:pt-20 pb-24 sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto scrollbar-hide">
            <div className="px-4 py-6">

                {/* Docs label */}
                <div className="flex items-center gap-2 mb-6 px-2">
                    <span className="text-xs font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest">
                        Documentation
                    </span>
                </div>

                <nav className="space-y-6">
                    {docsConfig.sections.map((section, idx) => (
                        <div key={idx}>
                            {/* Section header */}
                            <div className="flex items-center gap-2 mb-2 px-2">
                                <span className="text-indigo-500 dark:text-indigo-400">
                                    {iconMap[section.icon as keyof typeof iconMap]}
                                </span>
                                <span className="text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider">
                                    {section.title}
                                </span>
                            </div>

                            {/* Section items */}
                            <ul className="space-y-0.5">
                                {section.items.map((item, itemIdx) => {
                                    const isActive = currentSlug === item.slug;
                                    return (
                                        <li key={itemIdx}>
                                            <Link
                                                href={`/docs/${item.slug}`}
                                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${isActive
                                                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold"
                                                    : "text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                                                    }`}
                                            >
                                                {isActive && (
                                                    <span className="size-1.5 rounded-full bg-indigo-500 shrink-0" />
                                                )}
                                                {item.title}
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