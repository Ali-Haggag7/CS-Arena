import React from "react";
import { Github, GitPullRequest, GitFork, Star, Users, ArrowUpRight, AlertCircle, Terminal, Layers, Code2, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("open_source");
    return {
        title: t("title"),
        description: t("hero_subtitle"),
    };
}

const REPO_OWNER = "Ali-Haggag7";
const REPO_NAME = "CS-Arena";
const REPO_URL = `https://github.com/${REPO_OWNER}/${REPO_NAME}`;

interface GitHubRepo {
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
}

interface GitHubContributor {
    login: string;
    avatar_url: string;
    html_url: string;
    contributions: number;
}

async function getRepoData(): Promise<GitHubRepo | null> {
    try {
        const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`, {
            next: { revalidate: 3600 },
            headers: { Accept: "application/vnd.github+json" },
        });
        if (!res.ok) return null;
        return res.json();
    } catch { return null; }
}

async function getContributors(): Promise<GitHubContributor[]> {
    try {
        const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contributors?per_page=12`, {
            next: { revalidate: 3600 },
            headers: { Accept: "application/vnd.github+json" },
        });
        if (!res.ok) return [];
        return res.json();
    } catch { return []; }
}

const OpenSourcePage = async () => {
    const [repo, contributors] = await Promise.all([getRepoData(), getContributors()]);
    const t = await getTranslations("open_source");
    const locale = await getLocale();
    const isRtl = locale === "ar";

    const repoStats = [
        { label: t("stat_stars"), value: repo?.stargazers_count ?? 0, icon: Star, color: "text-yellow-500" },
        { label: t("stat_forks"), value: repo?.forks_count ?? 0, icon: GitFork, color: "text-blue-500" },
        { label: t("stat_contributors"), value: contributors.length, icon: Users, color: "text-emerald-500" },
        { label: t("stat_issues"), value: repo?.open_issues_count ?? 0, icon: AlertCircle, color: "text-orange-500" },
    ];

    const contribCards = [
        { icon: GitFork, title: t("card1_title"), desc: t("card1_desc"), color: "text-blue-500", bg: "bg-blue-500/10" },
        { icon: GitPullRequest, title: t("card2_title"), desc: t("card2_desc"), color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { icon: Code2, title: t("card3_title"), desc: t("card3_desc"), color: "text-orange-500", bg: "bg-orange-500/10" },
        { icon: Star, title: t("card4_title"), desc: t("card4_desc"), color: "text-yellow-500", bg: "bg-yellow-500/10" },
    ];

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0a0a0c] font-work-sans pb-24 relative selection:bg-primary/30 transition-colors duration-300 overflow-hidden">

            {/* Complex Background Geometry */}
            <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20" aria-hidden="true">
                <div className="absolute top-0 left-0 w-full h-full grid-bg" />
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[120%] h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent rotate-12" />
                <div className="absolute top-2/4 left-1/2 -translate-x-1/2 w-[120%] h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent -rotate-12" />
            </div>

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full opacity-30 dark:opacity-10 blur-[120px] pointer-events-none"
                style={{ background: "radial-gradient(ellipse, #3b82f6 0%, transparent 70%)" }} aria-hidden="true" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 relative z-10">

                {/* Hero Section */}
                <div className="text-center mb-24">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-bold mb-8 backdrop-blur-sm shadow-sm">
                        <Github className="size-4" />
                        <span>{t("hero_badge")}</span>
                    </div>

                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-black dark:text-white tracking-tighter leading-none mb-8">
                        {t("hero_title1")} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-emerald-500 to-teal-400">
                            {t("hero_title2")}
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-500 dark:text-white/40 max-w-3xl mx-auto leading-relaxed font-medium mb-12">
                        {t("hero_subtitle")}
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        {repoStats.map((stat, idx) => (
                            <div key={idx} className="flex items-center gap-3 bg-white dark:bg-[#161618] border border-slate-200 dark:border-white/10 px-6 py-3 rounded-2xl shadow-sm dark:shadow-none hover:border-blue-500/30 transition-all duration-300">
                                <stat.icon className={`size-5 ${stat.color}`} />
                                <div className="text-start">
                                    <p className="text-xl font-black text-black dark:text-white leading-none">{stat.value}</p>
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-1">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Path to Contribution - Out of the box engineering vibe */}
                <div className="mb-32 relative">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="p-3 bg-primary/10 rounded-2xl"><Terminal className="size-6 text-primary" /></div>
                        <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white tracking-tight">{t("path_title")}</h2>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 relative">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-white/5 hidden md:block -z-10" />
                        {contribCards.map((card, idx) => (
                            <div key={idx} className="bg-white dark:bg-[#111115] border border-slate-200 dark:border-white/10 p-8 rounded-[2rem] shadow-sm hover:-translate-y-2 transition-all duration-300 group">
                                <div className={`size-14 ${card.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <card.icon className={`size-7 ${card.color}`} />
                                </div>
                                <h3 className="text-xl font-bold text-black dark:text-white mb-3">{card.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-white/40 leading-relaxed font-medium">{card.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Hall of Contributors - Dynamic GitHub Data */}
                <div className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-black dark:text-white mb-4 tracking-tight">{t("hall_title")}</h2>
                        <p className="text-lg text-slate-500 dark:text-white/40 font-medium">{t("hall_subtitle")}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {contributors.map((user) => (
                            <Link
                                key={user.login}
                                href={user.html_url}
                                target="_blank"
                                className="group flex flex-col items-center p-6 bg-white dark:bg-[#111115] border border-slate-200 dark:border-white/10 rounded-3xl hover:border-emerald-500/30 transition-all duration-300"
                            >
                                <div className="relative mb-4">
                                    <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-0 group-hover:opacity-20 transition-opacity" />
                                    <Image
                                        src={user.avatar_url}
                                        alt={user.login}
                                        width={80} height={80}
                                        className="size-20 rounded-full grayscale group-hover:grayscale-0 transition-all duration-500 ring-4 ring-slate-100 dark:ring-white/5 group-hover:ring-emerald-500/30"
                                    />
                                </div>
                                <p className="font-bold text-black dark:text-white text-sm">@{user.login}</p>
                                <div className="mt-2 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                                    <Sparkles className="size-3 text-emerald-500" />
                                    <span className="text-[10px] font-black text-slate-500">{user.contributions} Commits</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Final CTA */}
                <div className="text-center p-10 md:p-20 rounded-[3rem] border border-blue-500/20 bg-blue-500/5 relative overflow-hidden shadow-2xl shadow-blue-500/10">
                    <div className="absolute inset-0 opacity-40 dark:opacity-30 blur-[100px] pointer-events-none"
                        style={{ background: "radial-gradient(ellipse at center, #3b82f6 0%, transparent 70%)" }} aria-hidden="true" />

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="size-20 bg-white dark:bg-[#0a0a0c] rounded-[2rem] flex items-center justify-center mb-8 shadow-xl border border-slate-200 dark:border-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                            <Github className="size-10 text-black dark:text-white" />
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-black dark:text-white mb-6 tracking-tight">{t("cta_ready")}</h2>
                        <p className="text-lg md:text-xl text-slate-600 dark:text-white/50 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                            {t("cta_desc")}
                        </p>
                        <Link
                            href={REPO_URL}
                            target="_blank"
                            className="group inline-flex items-center gap-3 bg-black dark:bg-primary text-white px-10 py-5 rounded-full hover:bg-slate-800 dark:hover:bg-blue-600 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300 font-bold text-lg hover:-translate-y-1"
                        >
                            <Github className="size-6" />
                            <span>{t("cta_button")}</span>
                            <ArrowUpRight className={`size-5 opacity-70 group-hover:opacity-100 transition-transform ${isRtl ? "group-hover:-translate-x-1.5" : "group-hover:translate-x-1.5"} group-hover:-translate-y-1.5`} />
                        </Link>
                    </div>
                </div>

            </div>
        </main>
    );
};

export default OpenSourcePage;