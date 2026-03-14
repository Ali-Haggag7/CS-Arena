"use client";

import Link from "next/link";
import { X } from "lucide-react";

/**
 * SearchFormReset Component
 * Gracefully clears the search input and navigates back to the default view.
 * Fixes accessibility issues by avoiding nested interactive elements (No <a> inside <button>).
 */
const SearchFormReset = () => {
    const reset = () => {
        const form = document.querySelector('.search-form') as HTMLFormElement;
        if (form) form.reset();
    };

    return (
        <Link
            href="/"
            onClick={reset}
            aria-label="Reset Search"
            className="search-btn text-white transition-transform hover:scale-105 active:scale-95 flex justify-center items-center"
        >
            <X className="size-5" />
        </Link>
    );
};

export default SearchFormReset;