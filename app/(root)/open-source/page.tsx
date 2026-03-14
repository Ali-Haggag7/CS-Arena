import React from "react";
import { Github, GitPullRequest, GitFork } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Open Source | CS-Arena",
    description: "Contribute to CS-Arena and help us build the ultimate platform for developers.",
};

const OpenSourcePage = () => {
    return (
        <main className="min-h-screen bg-white font-work-sans pt-20 pb-24">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-4 bg-[#24292e]/10 rounded-full mb-6">
                        <Github className="size-12 text-[#24292e]" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-black-300 mb-6 tracking-tight">
                        Back to the <span className="text-primary">Community</span>
                    </h1>
                    <p className="text-20-medium text-black-200 max-w-2xl mx-auto leading-relaxed">
                        CS-Arena is built by developers, for developers. We believe in the power of open-source and community-driven engineering.
                    </p>
                </div>

                {/* Content Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">

                    {/* Fork & Star */}
                    <div className="p-8 bg-black-100/5 rounded-3xl border border-black-100/10 hover:border-primary/30 transition-colors">
                        <GitFork className="size-10 text-primary mb-4" />
                        <h3 className="text-24-black text-black-300 mb-3">Fork & Star</h3>
                        <p className="text-16-medium text-black-200 leading-relaxed">
                            Grab a copy of our repository, explore the architecture, and don't forget to drop a star to support the project!
                        </p>
                    </div>

                    {/* Pull Requests */}
                    <div className="p-8 bg-black-100/5 rounded-3xl border border-black-100/10 hover:border-primary/30 transition-colors">
                        <GitPullRequest className="size-10 text-green-500 mb-4" />
                        <h3 className="text-24-black text-black-300 mb-3">Submit a PR</h3>
                        <p className="text-16-medium text-black-200 leading-relaxed">
                            Found a bug? Have a feature idea? Open a pull request. We actively review and merge community contributions.
                        </p>
                    </div>

                </div>

                {/* CTA (Call to Action) */}
                <div className="text-center p-10 bg-[#24292e] rounded-3xl !text-white shadow-xl">
                    <h2 className="text-30-bold !text-white mb-4">Ready to Contribute?</h2>
                    <p className="text-16-medium !text-gray-300 mb-8 max-w-xl mx-auto">
                        Head over to our official GitHub repository, check out the issues, and let's build something amazing together.
                    </p>
                    <a
                        href="https://github.com/ali-haggag/flurry"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white text-[#24292e] px-8 py-4 rounded-full hover:bg-primary hover:text-white transition-all duration-300 text-16-bold"
                    >
                        <Github className="size-5" />
                        Go to GitHub Repo
                    </a>
                </div>

            </div>
        </main>
    );
};

export default OpenSourcePage;