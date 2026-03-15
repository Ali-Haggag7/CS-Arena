"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const POPULAR_TECHS = [
    "Next.js", "React", "TypeScript", "Tailwind",
    "Node.js", "MongoDB", "Python", "Docker",
] as const;

const TechFilters = () => {
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
        <div
            className="flex flex-wrap justify-center gap-2 mt-8"
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
                        className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-300 border
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

export default TechFilters;