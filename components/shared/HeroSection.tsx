"use client";

import { motion } from "framer-motion";
import SearchForm from "@/components/shared/SearchForm";
import TechFilters from "@/components/shared/TechFilters";
import { useEffect, useState } from "react";

const TYPEWRITER_WORDS = ["Code", "Projects", "Ideas", "Skills"];

const HeroSection = ({ query }: { query?: string }) => {
    const [wordIndex, setWordIndex] = useState(0);
    const [displayed, setDisplayed] = useState("");
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const current = TYPEWRITER_WORDS[wordIndex];
        let timeout: NodeJS.Timeout;

        if (!deleting && displayed.length < current.length) {
            timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
        } else if (!deleting && displayed.length === current.length) {
            timeout = setTimeout(() => setDeleting(true), 1800);
        } else if (deleting && displayed.length > 0) {
            timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length - 1)), 45);
        } else if (deleting && displayed.length === 0) {
            setDeleting(false);
            setWordIndex((prev) => (prev + 1) % TYPEWRITER_WORDS.length);
        }

        return () => clearTimeout(timeout);
    }, [displayed, deleting, wordIndex]);

    return (
        <section className="relative overflow-hidden min-h-[580px] flex flex-col items-center justify-center py-16 px-6 bg-gray-900 dark:bg-[#0d0d0f]">

            {/* Grid background */}
            <div className="absolute inset-0 grid-bg opacity-100" aria-hidden="true" />

            {/* Blue glow */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-20 blur-[100px] pointer-events-none"
                style={{ background: "radial-gradient(ellipse, #3b82f6 0%, transparent 70%)" }}
                aria-hidden="true"
            />

            {/* Badge */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 mb-6"
            >
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                    <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                    CS Arena — Open for submissions
                </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
                className="relative z-10 font-work-sans font-extrabold text-white text-center text-4xl sm:text-5xl md:text-6xl leading-tight max-w-4xl"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                Showcase Your{" "}
                <span className="text-primary relative">
                    {displayed}
                    <span className="animate-pulse text-primary/70">|</span>
                </span>
                <br />
                <span className="text-white/80">Dominate The Arena</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
                className="relative z-10 text-[17px] font-medium text-white/50 max-w-xl text-center mt-2 leading-relaxed"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            >
                Submit your CS graduation projects, find open-source contributors,
                and get headhunted by top tech recruiters.
            </motion.p>

            {/* Search */}
            <motion.div
                className="w-full relative z-10 max-w-2xl"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
            >
                <SearchForm query={query} />
            </motion.div>

            {/* Filters */}
            <motion.div
                className="w-full relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.35 }}
            >
                <TechFilters />
            </motion.div>
        </section>
    );
};

export default HeroSection;