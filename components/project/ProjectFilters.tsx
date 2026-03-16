"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const ProjectFilters = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentTech = searchParams.get("tech") || "all";
    const currentSort = searchParams.get("sort") || "newest";

    const techCategories = [
        { label: "All", value: "all" },
        { label: "Next.js", value: "Next.js" },
        { label: "React", value: "React" },
        { label: "Node.js", value: "Node.js" },
        { label: "Python", value: "Python" },
        { label: "Java", value: "Java" },
    ];

    const handleFilterChange = useCallback(
        (key: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value === "all" || !value) {
                params.delete(key);
            } else {
                params.set(key, value);
            }
            params.delete("page");
            router.push(`?${params.toString()}`, { scroll: false });
        },
        [searchParams, router]
    );

    return (
        <div className="mb-6 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-3 sm:p-4 md:p-5 rounded-2xl shadow-sm dark:shadow-none backdrop-blur-sm relative z-10 transition-colors duration-300">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                {/* Tech Stack Filter */}
                <div className="flex gap-2 overflow-x-auto snap-x scroll-smooth pb-0.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {techCategories.map((tech) => (
                        <button
                            type="button"
                            key={tech.value}
                            onClick={() => handleFilterChange("tech", tech.value)}
                            className={`snap-start shrink-0 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all active:scale-95 ${currentTech === tech.value
                                ? "bg-primary text-white shadow-md shadow-primary/20"
                                : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/60 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-black dark:hover:text-white"
                                }`}
                        >
                            {tech.label}
                        </button>
                    ))}
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-100 dark:bg-white/5 md:hidden" />

                {/* Sort Row */}
                <div className="flex items-center gap-2.5">
                    <span className="text-xs sm:text-sm text-slate-500 dark:text-white/50 whitespace-nowrap shrink-0">
                        Sort by:
                    </span>
                    <select
                        title="Sort by"
                        value={currentSort}
                        onChange={(e) => handleFilterChange("sort", e.target.value)}
                        className="w-full md:w-48 bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/20 text-black dark:text-white text-xs sm:text-sm rounded-xl px-3 py-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer appearance-none"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
                    >
                        <option value="newest">Newest First</option>
                        <option value="popular">Most Upvoted</option>
                        <option value="views">Most Viewed</option>
                    </select>
                </div>

            </div>
        </div>
    );
};

export default ProjectFilters;