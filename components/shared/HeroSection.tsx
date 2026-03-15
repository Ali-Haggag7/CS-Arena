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
            timeout = setTimeout(() => {
                setDisplayed(current.slice(0, displayed.length + 1));
            }, 80);
        } else if (!deleting && displayed.length === current.length) {
            timeout = setTimeout(() => setDeleting(true), 1800);
        } else if (deleting && displayed.length > 0) {
            timeout = setTimeout(() => {
                setDisplayed(current.slice(0, displayed.length - 1));
            }, 45);
        } else if (deleting && displayed.length === 0) {
            setDeleting(false);
            setWordIndex((prev) => (prev + 1) % TYPEWRITER_WORDS.length);
        }

        return () => clearTimeout(timeout);
    }, [displayed, deleting, wordIndex]);

    return (
        <section className="pink_container relative overflow-hidden">
            {/* Subtle grid background — CSS only, zero JS cost */}
            <div
                className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
                style={{
                    backgroundImage:
                        "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
                aria-hidden="true"
            />

            {/* Heading */}
            <motion.h1
                className="heading relative z-10"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                Showcase Your{" "}
                <span className="text-primary inline-block min-w-[120px]">
                    {displayed}
                    <span className="animate-pulse">|</span>
                </span>
                <br />
                Dominate The Arena
            </motion.h1>

            {/* Subheading */}
            <motion.p
                className="sub-heading !max-w-3xl relative z-10"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            >
                Submit your CS graduation projects, find open-source contributors,
                and get headhunted by top tech recruiters.
            </motion.p>

            {/* Search */}
            <motion.div
                className="w-full relative z-10"
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