"use client";

import Form from "next/form";
import SearchFormReset from "@/components/shared/SearchFormReset";
import { Search, GraduationCap, Layers } from "lucide-react";
import { useTranslations } from "next-intl";
import { CustomFilterSelect } from "./CustomFilterSelect";
import { useRouter, useSearchParams } from "next/navigation";

const SearchForm = ({
    query,
    universities = [],
    domains = []
}: {
    query?: string;
    universities?: { _id: string; name: string }[];
    domains?: { _id: string; name: string }[];
}) => {
    const t = useTranslations("search_form");
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentUni = searchParams.get("university") ?? "";
    const currentDomain = searchParams.get("domain") ?? "";

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        if (key === "domain") {
            params.delete("tech");
        }

        router.push(`/?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="w-full flex flex-col gap-3">
            <Form
                action="/"
                scroll={false}
                className="search-form !bg-[#111115] !border-white/10 shadow-xl"
                role="search"
                aria-label={t("aria_form")}
            >
                <Search className="size-4 text-white/40 shrink-0" aria-hidden="true" />

                {currentUni && <input type="hidden" name="university" value={currentUni} />}
                {currentDomain && <input type="hidden" name="domain" value={currentDomain} />}

                <input
                    name="query"
                    defaultValue={query}
                    className="search-input !text-white placeholder:!text-white/40"
                    placeholder={t("placeholder")}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    aria-label={t("aria_input")}
                />

                <div className="flex gap-2 shrink-0">
                    {query && <SearchFormReset />}
                    <button
                        type="submit"
                        aria-label={t("aria_submit")}
                        className="search-btn text-white transition-transform hover:scale-105 active:scale-95"
                    >
                        <Search className="size-4" aria-hidden="true" />
                    </button>
                </div>
            </Form>

            {/* Advanced Filters */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2 sm:gap-3 w-full">
                <CustomFilterSelect
                    name="university"
                    label={<GraduationCap className="size-4 shrink-0 text-white/50" />}
                    options={universities}
                    currentValue={currentUni}
                    onChange={(val) => updateFilter("university", val)}
                />
                <CustomFilterSelect
                    name="domain"
                    label={<Layers className="size-4 shrink-0 text-white/50" />}
                    options={domains}
                    currentValue={currentDomain}
                    onChange={(val) => updateFilter("domain", val)}
                />
            </div>
        </div>
    );
};

export default SearchForm;