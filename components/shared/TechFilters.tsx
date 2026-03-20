"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, Suspense, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TECH_ECOSYSTEM, getDomainKey } from "@/constants/ecosystem";

const TechContent = ({ domains }: { domains: { _id: string; name: string }[] }) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [isPending, startTransition] = useTransition();

    const currentDomainId = searchParams.get("domain") ?? "";
    const currentSubDomain = searchParams.get("subdomain") ?? "";
    const currentTech = searchParams.get("tech") ?? "";

    const domainName = domains.find(d => d._id === currentDomainId)?.name || "";
    const domainKey = currentDomainId ? getDomainKey(domainName) : "default";

    const subdomainsObj = TECH_ECOSYSTEM[domainKey]?.subdomains || {};
    const subdomainsList = Object.entries(subdomainsObj).map(([key, val]: [string, any]) => ({
        id: key,
        title: val.title,
        techs: val.techs.filter((t: string) => t !== "Other") as string[]
    }));

    const activeSubObj = subdomainsList.find(s => s.id === currentSubDomain);
    const displayedTechs = activeSubObj
        ? activeSubObj.techs
        : Array.from(new Set(subdomainsList.flatMap(s => s.techs)));

    const handleSubDomainClick = useCallback((subId: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (currentSubDomain === subId) {
            params.delete("subdomain");
        } else {
            params.set("subdomain", subId);
        }
        params.delete("tech");

        startTransition(() => {
            router.push(`/?${params.toString()}`, { scroll: false });
        });
    }, [currentSubDomain, router, searchParams]);

    const handleTechClick = useCallback((tech: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (currentTech.toLowerCase() === tech.toLowerCase()) {
            params.delete("tech");
        } else {
            params.set("tech", tech);
        }

        startTransition(() => {
            router.push(`/?${params.toString()}`, { scroll: false });
        });
    }, [currentTech, router, searchParams]);

    return (
        <div className="flex flex-col gap-5 mt-6 w-full">
            {currentDomainId && subdomainsList.length > 0 && domainKey !== "default" && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x sm:flex-wrap sm:justify-center px-4 sm:px-0">
                    <AnimatePresence mode="popLayout">
                        {subdomainsList.map((sub) => {
                            const isActive = currentSubDomain === sub.id;
                            return (
                                <motion.button
                                    layout
                                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    key={sub.id}
                                    onClick={() => handleSubDomainClick(sub.id)}
                                    className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 border whitespace-nowrap shrink-0 snap-start
                                            ${isActive
                                            ? "bg-primary/20 text-primary border-primary/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                                            : "bg-white/5 text-white/60 border-white/10 hover:border-primary/40 hover:text-white hover:bg-white/10"
                                        } ${isPending ? "opacity-70 pointer-events-none" : ""}`}
                                >
                                    {sub.title}
                                </motion.button>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x sm:flex-wrap sm:justify-center px-4 sm:px-0 min-h-[40px]">
                <AnimatePresence mode="popLayout">
                    {displayedTechs.map((tech) => {
                        const isActive = currentTech.toLowerCase() === tech.toLowerCase();
                        return (
                            <motion.button
                                layout
                                initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
                                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
                                transition={{ duration: 0.3, type: "spring", bounce: 0.4 }}
                                key={`${currentDomainId}-${currentSubDomain}-${tech}`}
                                onClick={() => handleTechClick(tech)}
                                className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all duration-300 border whitespace-nowrap shrink-0 snap-start
                                        ${isActive
                                        ? "bg-primary text-white border-primary shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-105 z-10"
                                        : "bg-white/5 text-white/40 border-white/10 hover:border-primary/40 hover:text-white hover:bg-white/10"
                                    } ${isPending ? "opacity-70 pointer-events-none" : ""}`}
                            >
                                {tech}
                            </motion.button>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};

const TechFilters = ({ domains = [] }: { domains?: { _id: string; name: string }[] }) => {
    return (
        <div role="group" className="w-full relative">
            <div className="absolute left-0 top-0 bottom-2 w-12 bg-gradient-to-r from-gray-950 dark:from-[#0d0d0f] to-transparent z-10 pointer-events-none sm:hidden" />
            <div className="absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l from-gray-950 dark:from-[#0d0d0f] to-transparent z-10 pointer-events-none sm:hidden" />

            <Suspense fallback={<div className="h-20 w-full animate-pulse bg-white/5 rounded-2xl mt-6" />}>
                <TechContent domains={domains} />
            </Suspense>
        </div>
    );
};

export default TechFilters;