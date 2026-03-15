"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Ensure the component is mounted before accessing the theme to avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300"
            aria-label="Toggle theme"
        >
            {theme === "dark" ? (
                <Sun className="size-5 text-white/80 hover:text-white transition-colors" />
            ) : (
                <Moon className="size-5 text-black/70 hover:text-black transition-colors" />
            )}
        </button>
    );
};

export default ThemeToggle;