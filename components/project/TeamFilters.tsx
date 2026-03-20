"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, Suspense, useTransition } from "react";
import { useTranslations } from "next-intl";
import { CustomFilterSelect } from "@/components/shared/CustomFilterSelect";
import { GraduationCap, ArrowDownWideNarrow, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TECH_ECOSYSTEM, getDomainKey } from "@/constants/ecosystem";

const FilterContent = ({ domains, universities }: { domains: any[], universities: any[] }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const t = useTranslations("filters");

    const [isPending, startTransition] = useTransition();

    const currentDomain = searchParams.get("domain") || "all";
    const currentSubDomain = searchParams.get("subdomain") || "";
    const currentTech = searchParams.get("tech") || "";
    const currentSort = searchParams.get("sort") || "newest";
    const currentUni = searchParams.get("university") || "";
    const currentCollab = searchParams.get("collaborationType") || "";

    const domainName = currentDomain !== "all"
        ? domains.find(d => d._id === currentDomain)?.name || ""
        : "";
    const domainKey = currentDomain !== "all" ? getDomainKey(domainName) : "default";

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

    const handleFilterChange = useCallback(
        (key: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());

            if (value === "all" || !value) {
                params.delete(key);
            } else {
                params.set(key, value);
            }

            if (key === "domain") {
                params.delete("subdomain");
                params.delete("tech");
            }
            if (key === "subdomain") {
                params.delete("tech");
            }

            params.delete("page");

            startTransition(() => {
                router.push(`?${params.toString()}`, { scroll: false });
            });
        },
        [searchParams, router]
    );

    const sortOptions = [
        { _id: "newest", name: t("newest") || "Newest" },
        { _id: "popular", name: t("popular") || "Popular" },
        { _id: "views", name: t("views") || "Views" },
    ];

    const collabOptions = [
        { _id: "Online", name: t("collab_online") || "Online" },
        { _id: "Offline (Same University/City)", name: t("collab_offline") || "Offline (Same City)" },
        { _id: "Hybrid", name: t("collab_hybrid") || "Hybrid" },
    ];

    return (
        <div className={`flex flex-col gap-4 ${isPending ? "opacity-70 pointer-events-none" : "transition-opacity duration-300"}`}>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex gap-2 overflow-x-auto snap-x scroll-smooth pb-1 scrollbar-hide w-full lg:w-auto">
                    <button
                        type="button"
                        onClick={() => handleFilterChange("domain", "all")}
                        className={`snap-start shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 active:scale-95 border ${currentDomain === "all"
                            ? "bg-emerald-500 text-white border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                            : "bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-white/50 border-slate-200 dark:border-white/10 hover:border-emerald-500/40 hover:text-emerald-500"
                            }`}
                    >
                        {t("all") || "All Domains"}
                    </button>
                    {domains.map((domain) => (
                        <button
                            type="button"
                            key={domain._id}
                            onClick={() => handleFilterChange("domain", domain._id)}
                            className={`snap-start shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 active:scale-95 border ${currentDomain === domain._id
                                ? "bg-emerald-500 text-white border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                                : "bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-white/50 border-slate-200 dark:border-white/10 hover:border-emerald-500/40 hover:text-emerald-500"
                                }`}
                        >
                            {domain.name}
                        </button>
                    ))}
                </div>

                <div className="h-px bg-slate-100 dark:bg-white/5 lg:hidden w-full" />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 w-full lg:w-auto">
                    <CustomFilterSelect
                        name="university"
                        label={<GraduationCap className="size-4 shrink-0 text-emerald-500" />}
                        options={universities}
                        currentValue={currentUni}
                        onChange={(val) => handleFilterChange("university", val)}
                        allLabel={t("all_universities") || "All Universities"}
                    />

                    <CustomFilterSelect
                        name="collaborationType"
                        label={<MapPin className="size-4 shrink-0 text-emerald-500" />}
                        options={collabOptions}
                        currentValue={currentCollab}
                        onChange={(val) => handleFilterChange("collaborationType", val)}
                        allLabel={t("all_collab") || "Any Workspace"}
                    />

                    <CustomFilterSelect
                        name="sort"
                        label={<ArrowDownWideNarrow className="size-4 shrink-0 text-emerald-500" />}
                        options={sortOptions}
                        currentValue={currentSort}
                        onChange={(val) => handleFilterChange("sort", val)}
                        hideAllOption={true}
                    />
                </div>
            </div>

            <AnimatePresence>
                {currentDomain !== "all" && subdomainsList.length > 0 && domainKey !== "default" && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide snap-x w-full border-t border-slate-100 dark:border-white/5 pt-4 mt-2"
                    >
                        {subdomainsList.map((sub) => {
                            const isActive = currentSubDomain === sub.id;
                            return (
                                <motion.button
                                    layout
                                    key={sub.id}
                                    onClick={() => handleFilterChange("subdomain", isActive ? "" : sub.id)}
                                    className={`px-4 py-1.5 rounded-xl text-[13px] font-bold transition-all duration-300 border whitespace-nowrap shrink-0 snap-start
                                        ${isActive
                                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30 shadow-sm"
                                            : "bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-white/50 border-slate-200 dark:border-white/10 hover:border-emerald-500/40 hover:text-emerald-500"
                                        }`}
                                >
                                    {sub.title}
                                </motion.button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {currentDomain !== "all" && displayedTechs.length > 0 && domainKey !== "default" && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide snap-x w-full mt-1"
                    >
                        {displayedTechs.map((tech) => {
                            const isActive = currentTech.toLowerCase() === tech.toLowerCase();
                            return (
                                <motion.button
                                    layout
                                    key={`${currentDomain}-${currentSubDomain}-${tech}`}
                                    onClick={() => handleFilterChange("tech", isActive ? "" : tech)}
                                    className={`px-3 py-1 rounded-full text-[12px] font-bold transition-all duration-300 border whitespace-nowrap shrink-0 snap-start
                                        ${isActive
                                            ? "bg-emerald-500 text-white border-emerald-500 shadow-md scale-105"
                                            : "bg-transparent text-slate-400 dark:text-white/40 border-slate-200 dark:border-white/10 hover:border-emerald-500/40 hover:text-emerald-500"
                                        }`}
                                >
                                    {tech}
                                </motion.button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

const TeamFilters = ({ domains, universities }: { domains: any[], universities: any[] }) => {
    return (
        <div className="mb-6 bg-white dark:bg-[#111115] border border-slate-200 dark:border-white/10 p-3 sm:p-4 rounded-2xl shadow-sm dark:shadow-none relative z-40 transition-colors duration-300">
            <Suspense fallback={<div className="h-12 w-full animate-pulse bg-slate-100 dark:bg-white/5 rounded-xl" />}>
                <FilterContent domains={domains} universities={universities} />
            </Suspense>
        </div>
    );
};

export default TeamFilters;