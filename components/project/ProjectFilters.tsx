"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, Suspense } from "react";
import { useTranslations } from "next-intl";
import { CustomFilterSelect } from "@/components/shared/CustomFilterSelect";
import { GraduationCap, ArrowDownWideNarrow } from "lucide-react";

const FilterContent = ({ domains, universities }: { domains: any[], universities: any[] }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const t = useTranslations("filters");

    const currentDomain = searchParams.get("domain") || "all";
    const currentSort = searchParams.get("sort") || "newest";
    const currentUni = searchParams.get("university") || "";

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

    const sortOptions = [
        { _id: "newest", name: t("newest") },
        { _id: "popular", name: t("popular") },
        { _id: "views", name: t("views") },
    ];

    return (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div className="flex gap-2 overflow-x-auto snap-x scroll-smooth pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full lg:w-auto">
                <button
                    type="button"
                    onClick={() => handleFilterChange("domain", "all")}
                    className={`snap-start shrink-0 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all active:scale-95 ${currentDomain === "all"
                        ? "bg-primary text-white shadow-md shadow-primary/20"
                        : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/60 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-black dark:hover:text-white"
                        }`}
                >
                    {t("all") || "All Domains"}
                </button>
                {domains.map((domain) => (
                    <button
                        type="button"
                        key={domain._id}
                        onClick={() => handleFilterChange("domain", domain._id)}
                        className={`snap-start shrink-0 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all active:scale-95 ${currentDomain === domain._id
                            ? "bg-primary text-white shadow-md shadow-primary/20"
                            : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/60 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-black dark:hover:text-white"
                            }`}
                    >
                        {domain.name}
                    </button>
                ))}
            </div>

            <div className="h-px bg-slate-100 dark:bg-white/5 lg:hidden w-full" />

            <div className="grid grid-cols-2 sm:flex sm:flex-row items-center gap-2 sm:gap-3 w-full lg:w-auto">
                <CustomFilterSelect
                    name="university"
                    label={<GraduationCap className="size-4 shrink-0 text-slate-500 dark:text-white/50" />}
                    options={universities}
                    currentValue={currentUni}
                    onChange={(val) => handleFilterChange("university", val)}
                    allLabel={t("all_universities") || "All Universities"}
                />

                <CustomFilterSelect
                    name="sort"
                    label={<ArrowDownWideNarrow className="size-4 shrink-0 text-slate-500 dark:text-white/50" />}
                    options={sortOptions}
                    currentValue={currentSort}
                    onChange={(val) => handleFilterChange("sort", val)}
                    hideAllOption={true}
                />
            </div>
        </div>
    );
};

const ProjectFilters = ({ domains, universities }: { domains: any[], universities: any[] }) => {
    return (
        <div className="mb-6 bg-white dark:bg-[#111115] border border-slate-200 dark:border-white/10 p-3 sm:p-4 md:p-5 rounded-2xl shadow-sm dark:shadow-none relative z-40 transition-colors duration-300">
            <Suspense fallback={<div className="h-10 w-full animate-pulse bg-slate-100 dark:bg-white/5 rounded-xl" />}>
                <FilterContent domains={domains} universities={universities} />
            </Suspense>
        </div>
    );
};

export default ProjectFilters;