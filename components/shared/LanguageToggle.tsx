"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const LanguageToggle = ({ currentLocale }: { currentLocale: string }) => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const toggleLanguage = () => {
        const newLocale = currentLocale === "en" ? "ar" : "en";

        // Set cookie
        document.cookie = `locale=${newLocale};path=/;max-age=31536000`;

        startTransition(() => {
            router.refresh();
        });
    };

    return (
        <button
            type="button"
            onClick={toggleLanguage}
            disabled={isPending}
            className="size-9 rounded-full flex items-center justify-center
        bg-gray-100 dark:bg-white/5
        border border-gray-200 dark:border-white/10
        hover:border-primary/40 hover:bg-primary/5 dark:hover:bg-white/10
        transition-all duration-300 text-[12px] font-bold
        text-black/60 dark:text-white/60 disabled:opacity-50"
            aria-label="Toggle language"
        >
            {isPending ? (
                <Loader2 className="size-4 animate-spin text-primary" />
            ) : currentLocale === "en" ? (
                "ع"
            ) : (
                "EN"
            )}
        </button>
    );
};

export default LanguageToggle;