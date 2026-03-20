"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TECH_ECOSYSTEM: Record<string, string[]> = {
    "web": ["Next.js", "React", "Vue.js", "Angular", "TypeScript", "Tailwind CSS", "Node.js", "Django", "PostgreSQL"],
    "ai": ["Python", "TensorFlow", "PyTorch", "OpenAI", "LangChain", "Hugging Face", "Computer Vision", "NLP", "Scikit-learn"],
    "cyber": ["Kali Linux", "Wireshark", "Metasploit", "Burp Suite", "Nmap", "Cryptography", "Penetration Testing", "OWASP"],
    "data": ["Python", "Pandas", "NumPy", "Apache Spark", "Hadoop", "PowerBI", "SQL", "Machine Learning"],
    "mobile": ["Flutter", "React Native", "Swift", "Kotlin", "Android", "iOS", "Firebase"],
    "default": ["Next.js", "React", "TypeScript", "Tailwind", "Node.js", "MongoDB", "Python", "Docker", "AWS"]
};

const TechContent = ({ domains }: { domains: { _id: string; name: string }[] }) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const currentTech = searchParams.get("tech") ?? "";
    const currentDomainId = searchParams.get("domain") ?? "";

    let activeCategoryKey = "default";
    if (currentDomainId) {
        const domainName = domains.find(d => d._id === currentDomainId)?.name.toLowerCase() || "";

        if (domainName.includes("web")) activeCategoryKey = "web";
        else if (domainName.includes("ai") || domainName.includes("artificial")) activeCategoryKey = "ai";
        else if (domainName.includes("cyber") || domainName.includes("security")) activeCategoryKey = "cyber";
        else if (domainName.includes("data")) activeCategoryKey = "data";
        else if (domainName.includes("mobile") || domainName.includes("app")) activeCategoryKey = "mobile";
    }

    const activeTechs = TECH_ECOSYSTEM[activeCategoryKey] || TECH_ECOSYSTEM["default"];

    const handleFilter = useCallback(
        (tech: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (currentTech.toLowerCase() === tech.toLowerCase()) {
                params.delete("tech");
            } else {
                params.set("tech", tech);
            }
            router.push(`/?${params.toString()}`, { scroll: false });
        },
        [currentTech, router, searchParams]
    );

    return (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0 px-8 sm:px-0 min-h-[40px]">
            <AnimatePresence mode="popLayout">
                {activeTechs.map((tech) => {
                    const isActive = currentTech.toLowerCase() === tech.toLowerCase();
                    return (
                        <motion.button
                            layout
                            initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
                            transition={{ duration: 0.3, type: "spring", bounce: 0.4 }}
                            key={`${activeCategoryKey}-${tech}`}
                            type="button"
                            onClick={() => handleFilter(tech)}
                            aria-pressed={isActive}
                            className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all duration-300 border whitespace-nowrap shrink-0 snap-start
                                    ${isActive
                                    ? "bg-primary text-white border-primary shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-105 z-10"
                                    : "bg-white/5 text-slate-500 dark:text-white/50 border-slate-200 dark:border-white/10 hover:border-primary/40 hover:text-primary hover:bg-primary/5"
                                }`}
                        >
                            {tech}
                        </motion.button>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};

const TechFilters = ({ domains = [] }: { domains?: { _id: string; name: string }[] }) => {
    return (
        <div role="group" className="w-full mt-6 relative">
            <div className="absolute left-0 top-0 bottom-2 w-12 bg-gradient-to-r from-gray-950 dark:from-[#0d0d0f] to-transparent z-10 pointer-events-none sm:hidden" />
            <div className="absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l from-gray-950 dark:from-[#0d0d0f] to-transparent z-10 pointer-events-none sm:hidden" />

            <Suspense fallback={<div className="h-8 w-full animate-pulse bg-white/5 rounded-full" />}>
                <TechContent domains={domains} />
            </Suspense>
        </div>
    );
};

export default TechFilters;