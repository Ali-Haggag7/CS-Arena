"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Book, LayoutTemplate, Terminal, Search, ChevronRight, Zap, Shield, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { docsConfig } from "@/config/docs";

const iconMap = {
    book: <Book className="size-4" />,
    layout: <LayoutTemplate className="size-4" />,
    terminal: <Terminal className="size-4" />,
    zap: <Zap className="size-4" />,
    shield: <Shield className="size-4" />,
    sparkles: <Sparkles className="size-4" />,
};

export default function DocsSidebar({ currentSlug }: { currentSlug: string }) {
    const t = useTranslations("docs_page");
    const tSections = useTranslations("docs_sidebar.sections");
    const tItems = useTranslations("docs_sidebar.items");

    // State to handle collapsible sections
    const [openSections, setOpenSections] = useState<Record<number, boolean>>({});

    // Auto-open the section that contains the current slug
    useEffect(() => {
        const initialState: Record<number, boolean> = {};
        docsConfig.sections.forEach((section, idx) => {
            if (section.items.some(item => item.slug === currentSlug)) {
                initialState[idx] = true;
            }
        });
        setOpenSections(prev => ({ ...prev, ...initialState }));
    }, [currentSlug]);

    const toggleSection = (idx: number) => {
        setOpenSections(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    return (
        <aside className="hidden md:flex w-64 lg:w-72 shrink-0 flex-col pt-8 pb-24 sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-white/10 font-work-sans border-e border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-[#0a0a0c]/50 backdrop-blur-xl">
            <div className="px-5">

                {/* Search & Version Controls */}
                <div className="mb-8 space-y-4">
                    <button className="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-white dark:bg-[#111115] border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-500 dark:text-white/40 hover:border-primary/50 hover:text-slate-700 dark:hover:text-white/70 transition-colors shadow-sm group">
                        <span className="flex items-center gap-2">
                            <Search className="size-4 group-hover:text-primary transition-colors" />
                            {t("search_docs")}
                        </span>
                        <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-[10px] font-medium text-slate-500 dark:text-white/40 border border-slate-200 dark:border-white/10">
                            {t("search_cmd")}
                        </kbd>
                    </button>

                    <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-black text-slate-400 dark:text-white/30 uppercase tracking-widest">
                            {t("version")}
                        </span>
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                            v2.0 (Latest)
                        </span>
                    </div>
                </div>

                <nav className="space-y-6">
                    {docsConfig.sections.map((section, idx) => {
                        const isOpen = openSections[idx];
                        return (
                            <div key={idx} className="space-y-2">
                                <button
                                    onClick={() => toggleSection(idx)}
                                    className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <span className="p-1.5 rounded-md bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60 group-hover:text-primary group-hover:border-primary/30 transition-all shadow-sm">
                                            {iconMap[section.icon as keyof typeof iconMap] || iconMap.book}
                                        </span>
                                        <span className="text-sm font-bold text-slate-800 dark:text-white/80 tracking-wide">
                                            {tSections(section.titleKey)}
                                        </span>
                                    </div>
                                    <ChevronRight className={`size-4 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-90" : "rtl:-rotate-180"}`} />
                                </button>

                                <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                                    <ul className="overflow-hidden space-y-0.5 border-s-2 border-slate-100 dark:border-white/5 ms-[1.1rem] ps-3">
                                        {section.items.map((item, itemIdx) => {
                                            const isActive = currentSlug === item.slug;
                                            return (
                                                <li key={itemIdx}>
                                                    <Link
                                                        href={`/docs/${item.slug}`}
                                                        prefetch={true}
                                                        className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group ${isActive
                                                            ? "bg-primary/10 dark:bg-primary/10 text-primary shadow-sm"
                                                            : "text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/5"
                                                            }`}
                                                    >
                                                        {isActive && (
                                                            <span className="absolute -start-[14px] top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                                                        )}
                                                        {tItems(item.titleKey)}

                                                        {isActive && <div className="absolute right-2 size-1.5 rounded-full bg-primary animate-pulse" />}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}