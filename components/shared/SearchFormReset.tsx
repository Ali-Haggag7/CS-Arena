"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useCallback } from "react";

const SearchFormReset = () => {
    const reset = useCallback(() => {
        const form = document.querySelector(".search-form") as HTMLFormElement;
        if (form) form.reset();
    }, []);

    return (
        <Link
            href="/"
            onClick={reset}
            aria-label="Clear search"
            className="search-btn text-white transition-transform hover:scale-105 active:scale-95 flex justify-center items-center"
        >
            <X className="size-5" aria-hidden="true" />
        </Link>
    );
};

export default SearchFormReset;