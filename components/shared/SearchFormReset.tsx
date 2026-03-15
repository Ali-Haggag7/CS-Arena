"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useCallback } from "react";

const SearchFormReset = () => {
    const router = useRouter();

    const reset = useCallback(() => {
        const form = document.querySelector(".search-form") as HTMLFormElement;
        if (form) form.reset();
        router.push("/");
    }, [router]);

    return (
        <button
            type="button"
            onClick={reset}
            aria-label="Clear search"
            className="size-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors duration-200"
        >
            <X className="size-3.5 text-white/60" aria-hidden="true" />
        </button>
    );
};

export default SearchFormReset;