"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="size-9 rounded-full flex items-center justify-center
        bg-gray-100 dark:bg-white/5
        border border-gray-200 dark:border-white/10
        hover:border-primary/40 hover:bg-primary/5 dark:hover:bg-white/10
        transition-all duration-300"
            aria-label="Toggle theme"
        >
            {theme === "dark" ? (
                <Sun className="size-4 text-white/70" />
            ) : (
                <Moon className="size-4 text-black/60" />
            )}
        </button>
    );
};

export default ThemeToggle;