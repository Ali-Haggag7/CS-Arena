"use client";

import { useRouter, useSearchParams } from "next/navigation";

/**
 * TechFilters Component
 * Provides quick-click filtering for popular technologies.
 * Syncs seamlessly with the URL search parameters.
 */
const popularTechs = [
    "Next.js",
    "React",
    "Tailwind",
    "MongoDB",
    "TypeScript",
    "Node.js",
    "Python"
];

const TechFilters = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const currentQuery = searchParams.get("query") || "";

    const handleFilter = (tech: string) => {
        // If the clicked tech is already active, remove the filter. Otherwise, apply it.
        if (currentQuery.toLowerCase() === tech.toLowerCase()) {
            router.push("/");
        } else {
            router.push(`/?query=${tech}`);
        }
    };

    return (
        <div className="flex flex-wrap justify-center gap-3 mt-8">
            {popularTechs.map((tech) => {
                const isActive = currentQuery.toLowerCase() === tech.toLowerCase();

                return (
                    <button
                        key={tech}
                        type="button"
                        onClick={() => handleFilter(tech)}
                        className={`px-5 py-2.5 rounded-full text-14-medium transition-all duration-300 border shadow-sm hover:shadow-md hover:-translate-y-0.5
                        ${isActive
                                ? "bg-primary text-white border-primary"
                                : "bg-white text-black-200 border-black-100/20 hover:border-primary/50 hover:text-primary"
                            }
                        `}
                    >
                        {tech}
                    </button>
                );
            })}
        </div>
    );
};

export default TechFilters;