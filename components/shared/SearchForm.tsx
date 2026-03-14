import Form from "next/form";
import SearchFormReset from "@/components/shared/SearchFormReset";
import { Search } from "lucide-react";

/**
 * Masterclass SearchForm Component
 * Utilizes Next.js 15 <Form> for seamless client-side navigation without full page reloads.
 */
const SearchForm = ({ query }: { query?: string }) => {
    return (
        <Form action="/" scroll={false} className="search-form">
            <input
                name="query"
                defaultValue={query}
                className="search-input"
                placeholder="Search CS Projects, Tech Stacks..."
                autoComplete="off"
            />

            <div className="flex gap-2">
                {query && <SearchFormReset />}

                <button
                    type="submit"
                    aria-label="Submit Search"
                    className="search-btn text-white transition-transform hover:scale-105 active:scale-95"
                >
                    <Search className="size-5" />
                </button>
            </div>
        </Form>
    );
};

export default SearchForm;