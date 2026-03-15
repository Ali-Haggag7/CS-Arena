"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const POPULAR_TECHS = [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind",
    "Node.js",
    "MongoDB",
    "Python",
    "Docker",
] as const;

const TechFilters = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const currentTech = searchParams.get("tech") ?? "";

    const handleFilter = useCallback(
        (tech: string) => {
            const params = new URLSearchParams(searchParams.toString());

            if (currentTech.toLowerCase() === tech.toLowerCase()) {
                // Remove filter if already active
                params.delete("tech");
            } else {
                params.set("tech", tech);
            }

            router.push(`/?${params.toString()}`);
        },
        [currentTech, router, searchParams]
    );

    return (
        <div
            className="flex flex-wrap justify-center gap-3 mt-8"
            role="group"
            aria-label="Filter by technology"
        >
            {POPULAR_TECHS.map((tech) => {
                const isActive = currentTech.toLowerCase() === tech.toLowerCase();

                return (
                    <button
                        key={tech}
                        type="button"
                        onClick={() => handleFilter(tech)}
                        aria-pressed={isActive}
                        aria-label={`Filter by ${tech}`}
                        className={`px-5 py-2.5 rounded-full text-14-medium transition-all duration-300 border shadow-sm hover:shadow-md hover:-translate-y-0.5
                                ${isActive
                                ? "bg-primary text-white border-primary"
                                : "bg-white dark:bg-white/5 text-black/60 dark:text-white/60 border-black/10 dark:border-white/10 hover:border-primary/50 hover:text-primary"
                            }`}
                    >
                        {tech}
                    </button>
                );
            })}
        </div>
    );
};

export default TechFilters;