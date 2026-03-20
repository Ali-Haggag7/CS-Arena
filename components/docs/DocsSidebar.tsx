"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Book, LayoutTemplate, Terminal, Search, ChevronRight, Zap, Shield, Sparkles, X } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
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

    const [openSections, setOpenSections] = useState<Record<number, boolean>>({});
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<{ slug: string; title: string; excerpt: string }[]>([]);
    const searchRef = useRef<HTMLDivElement>(null);
    const locale = useLocale();

    useEffect(() => {
        const initialState: Record<number, boolean> = {};
        docsConfig.sections.forEach((section, idx) => {
            if (section.items.some(item => item.slug === currentSlug)) {
                initialState[idx] = true;
            }
        });
        setOpenSections(prev => ({ ...prev, ...initialState }));
    }, [currentSlug]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setSearchQuery("");
                setSearchResults([]);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleSection = (idx: number) => {
        setOpenSections(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }
        const res = await fetch(`/api/docs-search?q=${encodeURIComponent(query)}&locale=${locale}`);
        const data = await res.json();
        setSearchResults(data);
    };

    return (
        <aside className="hidden md:flex w-64 lg:w-72 shrink-0 flex-col pt-8 pb-24 sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-white/10 font-work-sans border-e border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-[#0a0a0c]/50 backdrop-blur-xl">
            <div className="px-5">

                <div className="mb-8 space-y-4">
                    <div className="relative" ref={searchRef}>
                        <div className="w-full flex items-center gap-2 px-3 py-2.5 bg-white dark:bg-[#111115] border border-slate-200 dark:border-white/10 rounded-xl shadow-sm focus-within:border-primary/50 transition-colors">
                            <Search className="size-4 text-slate-400 shrink-0" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder={t("search_docs")}
                                className="flex-1 bg-transparent text-sm text-black dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 outline-none"
                            />
                            {searchQuery && (
                                <button type="button" aria-label="Clear search" onClick={() => { setSearchQuery(""); setSearchResults([]); }}>
                                    <X className="size-4 text-slate-400 hover:text-black dark:hover:text-white transition-colors" />
                                </button>
                            )}
                        </div>

                        {searchResults.map((result) => (
                            <Link
                                key={result.slug}
                                href={`/docs/${result.slug}`}
                                onClick={() => { setSearchQuery(""); setSearchResults([]); }}
                                className="flex flex-col px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border-b border-slate-100 dark:border-white/5 last:border-0"
                            >
                                <span className="text-sm font-bold text-black dark:text-white">{result.title}</span>
                                <span className="text-xs text-slate-400 dark:text-white/40 mt-1 line-clamp-2">{result.excerpt}</span>
                            </Link>
                        ))}

                        {searchQuery && searchResults.length === 0 && (
                            <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#111115] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl p-4 text-center">
                                <p className="text-sm text-slate-400 dark:text-white/40">{t("no_results")}</p>
                            </div>
                        )}
                    </div>

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
                                    type="button"
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