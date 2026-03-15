import React from "react";
import { Github, GitPullRequest, GitFork, Star } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Open Source",
    description: "Contribute to CS-Arena and help us build the ultimate platform for developers.",
};

const REPO_URL = "https://github.com/Ali-Haggag7/CS-Arena";

const cards = [
    {
        icon: <GitFork className="size-7 text-primary" />,
        title: "Fork & Explore",
        description: "Grab a copy of our repository, explore the architecture, and drop a star to support the project!",
    },
    {
        icon: <GitPullRequest className="size-7 text-emerald-500" />,
        title: "Submit a PR",
        description: "Found a bug? Have a feature idea? Open a pull request. We actively review and merge contributions.",
    },
    {
        icon: <Star className="size-7 text-yellow-500" />,
        title: "Star the Repo",
        description: "Show your support by starring the repository. It helps more developers discover CS-Arena.",
    },
    {
        icon: <Github className="size-7 text-black dark:text-white/70" />,
        title: "Open an Issue",
        description: "Have a suggestion or found a bug? Open an issue and let's discuss it with the community.",
    },
];

const OpenSourcePage = () => {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-[#0d0d0f] font-work-sans pt-20 pb-24">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center size-14 bg-primary/10 border border-primary/20 rounded-2xl mb-6">
                        <Github className="size-7 text-primary" aria-hidden="true" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-black dark:text-white mb-4 tracking-tight">
                        Back to the <span className="text-primary">Community</span>
                    </h1>
                    <p className="text-[17px] text-black/50 dark:text-white/40 max-w-2xl mx-auto leading-relaxed">
                        CS-Arena is built by developers, for developers. We believe in the
                        power of open-source and community-driven engineering.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid md:grid-cols-2 gap-5 mb-12">
                    {cards.map(({ icon, title, description }) => (
                        <div
                            key={title}
                            className="glass-card p-6 rounded-2xl transition-all duration-300 group
                                    hover:border-primary/30 hover:shadow-sm dark:hover:border-primary/30"
                        >
                            <div className="size-12 bg-gray-100 dark:bg-white/5 rounded-xl flex items-center justify-center mb-4 
                                    group-hover:bg-primary/10 transition-colors duration-300">
                                {icon}
                            </div>
                            <h3 className="text-[16px] font-bold text-black dark:text-white mb-2">{title}</h3>
                            <p className="text-[14px] text-black/50 dark:text-white/40 leading-relaxed">{description}</p>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center p-10 rounded-2xl border border-primary/20 bg-primary/5 relative overflow-hidden">
                    <div
                        className="absolute inset-0 opacity-20 blur-[60px] pointer-events-none"
                        style={{ background: "radial-gradient(ellipse, #3b82f6 0%, transparent 70%)" }}
                        aria-hidden="true"
                    />
                    <div className="relative z-10">
                        <h2 className="text-[22px] font-bold text-black dark:text-white mb-3">Ready to Contribute?</h2>
                        <p className="text-[15px] text-black/50 dark:text-white/40 mb-8 max-w-xl mx-auto">
                            Head over to our GitHub repository, check out the open issues, and
                            let&apos;s build something amazing together.
                        </p>
                        <Link
                            href={REPO_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View CS-Arena on GitHub"
                            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-full hover:bg-primary-600 hover:shadow-glow transition-all duration-300 font-semibold text-[15px]"
                        >
                            <Github className="size-5" aria-hidden="true" />
                            View on GitHub
                        </Link>
                    </div>
                </div>

            </div>
        </main>
    );
};

export default OpenSourcePage;