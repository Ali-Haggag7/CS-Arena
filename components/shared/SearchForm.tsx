"use client";

import Form from "next/form";
import SearchFormReset from "@/components/shared/SearchFormReset";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

const SearchForm = ({ query }: { query?: string }) => {
    const t = useTranslations("search_form");

    return (
        <Form
            action="/"
            scroll={false}
            className="search-form"
            role="search"
            aria-label={t("aria_form")}
        >
            <Search className="size-4 text-black/30 dark:text-white/30 shrink-0" aria-hidden="true" />

            <input
                name="query"
                defaultValue={query}
                className="search-input"
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
    );
};

export default SearchForm;