"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import SearchForm from "@/components/shared/SearchForm";
import TechFilters from "@/components/shared/TechFilters";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const TYPEWRITER_WORDS_EN = ["Code", "Projects", "Ideas", "Skills"];
const TYPEWRITER_WORDS_AR = ["كودك", "مشاريعك", "أفكارك", "مهاراتك"];

const HeroSection = ({
    query,
    locale,
    universities,
    domains
}: {
    query?: string;
    locale: string;
    universities: any[];
    domains: any[];
}) => {
    const t = useTranslations("hero");
    const words = locale === "ar" ? TYPEWRITER_WORDS_AR : TYPEWRITER_WORDS_EN;

    const [wordIndex, setWordIndex] = useState(0);
    const [displayed, setDisplayed] = useState("");
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const current = words[wordIndex];
        let timeout: NodeJS.Timeout;

        if (!deleting && displayed.length < current.length) {
            timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
        } else if (!deleting && displayed.length === current.length) {
            timeout = setTimeout(() => setDeleting(true), 1800);
        } else if (deleting && displayed.length > 0) {
            timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length - 1)), 45);
        } else if (deleting && displayed.length === 0) {
            setDeleting(false);
            setWordIndex((prev) => (prev + 1) % words.length);
        }

        return () => clearTimeout(timeout);
    }, [displayed, deleting, wordIndex, words]);

    return (
        <LazyMotion features={domAnimation}>
            <section className="relative z-20 min-h-[100svh] sm:min-h-[580px] flex flex-col items-center justify-center py-12 sm:py-16 px-4 sm:px-6 bg-gray-950 dark:bg-[#0d0d0f]">

                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute inset-0 grid-bg" aria-hidden="true" />
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[200px] sm:w-[600px] sm:h-[300px] rounded-full opacity-15 sm:opacity-20 blur-[80px] sm:blur-[100px]"
                        style={{ background: "radial-gradient(ellipse, #3b82f6 0%, transparent 70%)" }}
                        aria-hidden="true"
                    />
                </div>

                <m.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="relative z-10 mb-5 sm:mb-6"
                >
                    <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full text-[12px] sm:text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                        <span className="size-1.5 rounded-full bg-primary animate-pulse shrink-0" />
                        {t("badge")}
                    </span>
                </m.div>

                <m.h1
                    className="relative z-10 font-work-sans font-extrabold text-white text-center text-[32px] leading-[40px] xs:text-[40px] xs:leading-[50px] sm:text-[58px] sm:leading-[68px] max-w-4xl my-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    {t("title1")}{" "}
                    <span className="text-primary">
                        {displayed}
                        <span className="animate-pulse text-primary/70">|</span>
                    </span>
                    <br />
                    <span className="text-white/80">{t("title2")}</span>
                </m.h1>

                <m.p
                    className="relative z-10 text-[14px] sm:text-[17px] font-medium text-white/50 max-w-sm sm:max-w-xl text-center mt-2 leading-relaxed px-2"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
                >
                    {t("subtitle")}
                </m.p>

                <m.div
                    className="w-full relative z-30 max-w-2xl mt-2 flex flex-col items-center"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
                >
                    <SearchForm query={query} universities={universities} domains={domains} />
                </m.div>

                <m.div
                    className="w-full relative z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.35 }}
                >
                    <TechFilters domains={domains} />
                </m.div>

            </section>
        </LazyMotion>
    );
};

export default HeroSection;