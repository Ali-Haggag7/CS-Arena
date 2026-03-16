import React from "react";
import { Github, GitPullRequest, GitFork, Star, Users, ArrowUpRight, AlertCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Open Source | CS-Arena",
    description: "Contribute to CS-Arena and help us build the ultimate platform for developers.",
};

const REPO_OWNER = "Ali-Haggag7";
const REPO_NAME = "CS-Arena";
const REPO_URL = `https://github.com/${REPO_OWNER}/${REPO_NAME}`;

// ─── Types ────────────────────────────────────────────────────────────────

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

// ─── Data Fetching ────────────────────────────────────────────────────────

async function getRepoData(): Promise<GitHubRepo | null> {
    try {
        const res = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`,
            {
                next: { revalidate: 3600 },
                headers: { Accept: "application/vnd.github+json" },
            }
        );
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

async function getContributors(): Promise<GitHubContributor[]> {
    try {
        const res = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contributors?per_page=10`,
            {
                next: { revalidate: 3600 },
                headers: { Accept: "application/vnd.github+json" },
            }
        );
        if (!res.ok) return [];
        return res.json();
    } catch {
        return [];
    }
}

// ─── Cards Data ───────────────────────────────────────────────────────────

const cards = [
    {
        icon: <GitFork className="size-6 text-primary" />,
        bgGlow: "group-hover:bg-blue-500/10",
        borderGlow: "hover:border-blue-500/30",
        title: "Fork & Explore",
        description: "Grab a copy of our repository, explore the architecture, and drop a star to support the project!",
    },
    {
        icon: <GitPullRequest className="size-6 text-emerald-500" />,
        bgGlow: "group-hover:bg-emerald-500/10",
        borderGlow: "hover:border-emerald-500/30",
        title: "Submit a PR",
        description: "Found a bug? Have a feature idea? Open a pull request. We actively review and merge contributions.",
    },
    {
        icon: <Star className="size-6 text-yellow-500" />,
        bgGlow: "group-hover:bg-yellow-500/10",
        borderGlow: "hover:border-yellow-500/30",
        title: "Star the Repo",
        description: "Show your support by starring the repository. It helps more developers discover CS-Arena.",
    },
    {
        icon: <AlertCircle className="size-6 text-slate-700 dark:text-white/70" />,
        bgGlow: "group-hover:bg-slate-500/10",
        borderGlow: "hover:border-slate-500/30",
        title: "Open an Issue",
        description: "Have a suggestion or found a bug? Open an issue and let's discuss it with the community.",
    },
];

// ─── Main Component ───────────────────────────────────────────────────────

const OpenSourcePage = async () => {
    const [repo, contributors] = await Promise.all([getRepoData(), getContributors()]);

    const repoStats = [
        {
            label: "Stars",
            value: repo ? repo.stargazers_count.toLocaleString() : "—",
            icon: <Star className="size-4 text-yellow-500 fill-yellow-500" />,
        },
        {
            label: "Forks",
            value: repo ? repo.forks_count.toLocaleString() : "—",
            icon: <GitFork className="size-4 text-primary" />,
        },
        {
            label: "Contributors",
            value: contributors.length ? `${contributors.length}+` : "—",
            icon: <Users className="size-4 text-emerald-500" />,
        },
        {
            label: "Issues",
            value: repo ? repo.open_issues_count.toLocaleString() : "—",
            icon: <AlertCircle className="size-4 text-orange-500" />,
        },
    ];

    const displayedContributors = contributors.slice(0, 6);
    const extraCount = Math.max(0, contributors.length - 6);

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-[#0d0d0f] font-work-sans pb-24 relative selection:bg-primary/30 transition-colors duration-300">

            {/* Background Effects */}
            <div className="absolute inset-0 grid-bg opacity-40 dark:opacity-40 pointer-events-none" aria-hidden="true" />
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-30 dark:opacity-15 blur-[120px] pointer-events-none"
                style={{ background: "radial-gradient(ellipse, #3b82f6 0%, transparent 70%)" }}
                aria-hidden="true"
            />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-32 relative z-10">

                {/* ─── Hero Section ─── */}
                <div className="text-center mb-12 sm:mb-16 md:mb-20">
                    <div className="inline-flex items-center justify-center size-12 sm:size-14 md:size-16 bg-primary/10 border border-primary/20 rounded-2xl mb-4 sm:mb-6 shadow-sm">
                        <Github className="size-6 sm:size-7 md:size-8 text-primary" aria-hidden="true" />
                    </div>

                    <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-black dark:text-white mb-4 sm:mb-6 tracking-tight leading-tight">
                        Back to the{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                            Community
                        </span>
                    </h1>

                    <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-white/50 max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8 px-2">
                        CS-Arena is built by developers, for developers. We believe in the power of open-source and community-driven engineering. Join us in shaping the future.
                    </p>

                    {/* Repo Stats Row */}
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-6">
                        {repoStats.map((stat, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm dark:shadow-none backdrop-blur-sm"
                            >
                                {stat.icon}
                                <span className="font-bold text-black dark:text-white text-xs sm:text-sm">{stat.value}</span>
                                <span className="text-slate-500 dark:text-white/40 text-xs sm:text-sm">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ─── Contribution Cards ─── */}
                <div className="grid sm:grid-cols-2 gap-4 md:gap-6 mb-12 sm:mb-16 md:mb-20">
                    {cards.map(({ icon, title, description, bgGlow, borderGlow }) => (
                        <div
                            key={title}
                            className={`bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-5 sm:p-6 md:p-8 rounded-3xl transition-all duration-300 group shadow-sm dark:shadow-none hover:-translate-y-1 ${borderGlow}`}
                        >
                            <div className={`size-11 sm:size-12 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-4 sm:mb-5 transition-colors duration-300 ${bgGlow}`}>
                                {icon}
                            </div>
                            <h3 className="text-base sm:text-lg font-bold text-black dark:text-white mb-2">{title}</h3>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-white/40 leading-relaxed">{description}</p>
                        </div>
                    ))}
                </div>

                {/* ─── CTA Section ─── */}
                <div className="text-center p-6 sm:p-8 md:p-12 rounded-[2rem] border border-primary/20 bg-primary/5 relative overflow-hidden shadow-lg shadow-primary/5">
                    <div
                        className="absolute inset-0 opacity-30 dark:opacity-20 blur-[80px] pointer-events-none"
                        style={{ background: "radial-gradient(ellipse at center, #3b82f6 0%, transparent 70%)" }}
                        aria-hidden="true"
                    />

                    <div className="relative z-10 flex flex-col items-center">

                        {/* Real Contributors Avatars */}
                        <div className="flex items-center justify-center -space-x-3 mb-4 sm:mb-6">
                            {displayedContributors.map((contributor) => (
                                <Link
                                    key={contributor.login}
                                    href={contributor.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={`@${contributor.login} — ${contributor.contributions} commits`}
                                    className="relative size-9 sm:size-11 md:size-12 rounded-full ring-4 ring-white dark:ring-[#0d0d0f] overflow-hidden bg-slate-200 hover:z-10 hover:scale-110 transition-transform duration-200"
                                >
                                    <Image
                                        src={contributor.avatar_url}
                                        alt={contributor.login}
                                        fill
                                        className="object-cover"
                                    />
                                </Link>
                            ))}
                            {extraCount > 0 && (
                                <div className="relative size-9 sm:size-11 md:size-12 rounded-full ring-4 ring-white dark:ring-[#0d0d0f] bg-slate-100 dark:bg-white/10 flex items-center justify-center z-10">
                                    <span className="text-xs font-bold text-black dark:text-white">+{extraCount}</span>
                                </div>
                            )}
                        </div>

                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black dark:text-white mb-3 sm:mb-4">
                            Ready to Contribute?
                        </h2>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-white/50 mb-6 sm:mb-8 max-w-xl mx-auto leading-relaxed px-2">
                            Head over to our GitHub repository, check out the open issues, read our contributing guidelines, and let&apos;s build something amazing together.
                        </p>

                        <Link
                            href={REPO_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View CS-Arena on GitHub"
                            className="group inline-flex items-center gap-2 bg-black dark:bg-primary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-slate-800 dark:hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-300 font-semibold text-sm sm:text-base hover:scale-105"
                        >
                            <Github className="size-4 sm:size-5" aria-hidden="true" />
                            <span>View Repository</span>
                            <ArrowUpRight className="size-3.5 sm:size-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                    </div>
                </div>

            </div>
        </main>
    );
};

export default OpenSourcePage;