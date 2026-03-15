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
        icon: <GitFork className="size-10 text-primary mb-4" aria-hidden="true" />,
        title: "Fork & Explore",
        description:
            "Grab a copy of our repository, explore the architecture, and don't forget to drop a star to support the project!",
    },
    {
        icon: <GitPullRequest className="size-10 text-green-500 mb-4" aria-hidden="true" />,
        title: "Submit a PR",
        description:
            "Found a bug? Have a feature idea? Open a pull request. We actively review and merge community contributions.",
    },
    {
        icon: <Star className="size-10 text-yellow-500 mb-4" aria-hidden="true" />,
        title: "Star the Repo",
        description:
            "Show your support by starring the repository. It helps more developers discover CS-Arena.",
    },
    {
        icon: <Github className="size-10 text-black dark:text-white mb-4" aria-hidden="true" />,
        title: "Open an Issue",
        description:
            "Have a suggestion or found a bug? Open an issue and let's discuss it with the community.",
    },
];

const OpenSourcePage = () => {
    return (
        <main className="min-h-screen bg-white dark:bg-black font-work-sans pt-20 pb-24">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-4 bg-black/5 dark:bg-white/10 rounded-full mb-6">
                        <Github className="size-12 text-black dark:text-white" aria-hidden="true" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-black dark:text-white mb-6 tracking-tight">
                        Back to the <span className="text-primary">Community</span>
                    </h1>
                    <p className="text-20-medium text-black/50 dark:text-white/50 max-w-2xl mx-auto leading-relaxed">
                        CS-Arena is built by developers, for developers. We believe in the
                        power of open-source and community-driven engineering.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {cards.map(({ icon, title, description }) => (
                        <div
                            key={title}
                            className="p-8 bg-black/5 dark:bg-white/5 rounded-3xl border border-black/5 dark:border-white/10 hover:border-primary/30 transition-colors duration-300"
                        >
                            {icon}
                            <h3 className="text-24-black text-black dark:text-white mb-3">
                                {title}
                            </h3>
                            <p className="text-16-medium text-black/50 dark:text-white/50 leading-relaxed">
                                {description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center p-10 bg-[#24292e] dark:bg-white/5 rounded-3xl shadow-xl border border-white/10">
                    <h2 className="text-30-bold text-white mb-4">Ready to Contribute?</h2>
                    <p className="text-16-medium text-gray-300 mb-8 max-w-xl mx-auto">
                        Head over to our GitHub repository, check out the open issues, and
                        let&apos;s build something amazing together.
                    </p>
                    <Link
                        href={REPO_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="View CS-Arena on GitHub"
                        className="inline-flex items-center gap-2 bg-white text-[#24292e] px-8 py-4 rounded-full hover:bg-primary hover:text-white transition-all duration-300 text-16-bold"
                    >
                        <Github className="size-5" aria-hidden="true" />
                        View on GitHub
                    </Link>
                </div>

            </div>
        </main>
    );
};

export default OpenSourcePage;