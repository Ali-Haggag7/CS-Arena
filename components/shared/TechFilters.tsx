"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, Suspense } from "react";

const POPULAR_TECHS = [
    "Next.js", "React", "TypeScript", "Tailwind",
    "Node.js", "MongoDB", "Python", "Docker",
] as const;

const TechContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const currentTech = searchParams.get("tech") ?? "";

    const handleFilter = useCallback(
        (tech: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (currentTech.toLowerCase() === tech.toLowerCase()) {
                params.delete("tech");
            } else {
                params.set("tech", tech);
            }
            router.push(`/?${params.toString()}`);
        },
        [currentTech, router, searchParams]
    );

    return (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0 px-8 sm:px-0">
            {POPULAR_TECHS.map((tech) => {
                const isActive = currentTech.toLowerCase() === tech.toLowerCase();
                return (
                    <button
                        key={tech}
                        type="button"
                        onClick={() => handleFilter(tech)}
                        aria-pressed={isActive}
                        aria-label={`Filter by ${tech}`}
                        className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-300 border whitespace-nowrap shrink-0 snap-start
                                ${isActive
                                ? "bg-primary text-white border-primary shadow-glow"
                                : "bg-white/5 text-white/50 border-white/10 hover:border-primary/40 hover:text-primary hover:bg-primary/5"
                            }`}
                    >
                        {tech}
                    </button>
                );
            })}
        </div>
    );
};

const TechFilters = () => {
    return (
        <div
            role="group"
            aria-label="Filter by technology"
            className="w-full mt-6 relative"
        >
            <div className="absolute left-0 top-0 bottom-2 w-12 bg-gradient-to-r from-gray-900 dark:from-[#0d0d0f] to-transparent z-10 pointer-events-none sm:hidden" />
            <div className="absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l from-gray-900 dark:from-[#0d0d0f] to-transparent z-10 pointer-events-none sm:hidden" />

            <Suspense fallback={<div className="h-8 w-full animate-pulse bg-white/5 rounded-full" />}>
                <TechContent />
            </Suspense>
        </div>
    );
};

export default TechFilters;