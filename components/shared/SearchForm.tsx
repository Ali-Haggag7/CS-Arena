import Form from "next/form";
import SearchFormReset from "@/components/shared/SearchFormReset";
import { Search } from "lucide-react";

const SearchForm = ({ query }: { query?: string }) => {
    return (
        <Form
            action="/"
            scroll={false}
            className="search-form"
            role="search"
            aria-label="Search projects"
        >
            <input
                name="query"
                defaultValue={query}
                className="search-input"
                placeholder="Search projects, tech stacks..."
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                aria-label="Search query"
            />

            <div className="flex gap-2">
                {query && <SearchFormReset />}
                <button
                    type="submit"
                    aria-label="Submit search"
                    className="search-btn text-white transition-transform hover:scale-105 active:scale-95"
                >
                    <Search className="size-5" aria-hidden="true" />
                </button>
            </div>
        </Form>
    );
};

export default SearchForm;