import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Code2, Trophy, Users } from "lucide-react";

export const metadata: Metadata = {
    title: "About",
    description: "Learn more about CS-Arena, the ultimate platform for computer science students.",
};

const AboutPage = () => {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-[#0d0d0f] font-work-sans pt-20 pb-24">
            <div className="max-w-3xl mx-auto px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center size-14 bg-primary/10 border border-primary/20 rounded-2xl mb-6">
                        <Code2 className="size-7 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-black dark:text-white mb-4 tracking-tight">
                        About <span className="text-primary">CS-Arena</span>
                    </h1>
                    <p className="text-[17px] text-black/50 dark:text-white/40 leading-relaxed">
                        Empowering the next generation of software engineers to build,
                        collaborate, and get hired.
                    </p>
                </div>

                {/* Sections */}
                <div className="space-y-6">

                    <div className="glass-card p-6 rounded-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-1 h-5 bg-primary rounded-full" />
                            <h2 className="text-[18px] font-bold text-black dark:text-white">Our Mission</h2>
                        </div>
                        <p className="text-[15px] text-black/60 dark:text-white/50 leading-relaxed">
                            CS-Arena was born out of a simple observation: Computer Science students build
                            incredible graduation and side projects, but these masterpieces often end up hidden
                            in private repositories or forgotten on local hard drives. Our mission is to provide
                            a dedicated, professional stage where your code can shine.
                        </p>
                    </div>

                    <div className="glass-card p-6 rounded-2xl">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-1 h-5 bg-primary rounded-full" />
                            <h2 className="text-[18px] font-bold text-black dark:text-white">What We Do</h2>
                        </div>
                        <div className="space-y-4">
                            {[
                                { icon: Code2, title: "Showcase Your Code", desc: "Present your tech stack, GitHub repo, and project architecture in a sleek unified dashboard." },
                                { icon: Trophy, title: "Dominate the Arena", desc: "Through our upvote and leaderboard systems, the best projects organically rise to the top." },
                                { icon: Users, title: "Open Source Collaboration", desc: "Connect with developers who want to contribute to meaningful projects." },
                            ].map(({ icon: Icon, title, desc }) => (
                                <div key={title} className="flex gap-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
                                    <div className="size-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                        <Icon className="size-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[14px] font-bold text-black dark:text-white mb-1">{title}</p>
                                        <p className="text-[13px] text-black/50 dark:text-white/40">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-6 rounded-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-1 h-5 bg-primary rounded-full" />
                            <h2 className="text-[18px] font-bold text-black dark:text-white">
                                Built for Developers, By Developers
                            </h2>
                        </div>
                        <p className="text-[15px] text-black/60 dark:text-white/50 leading-relaxed">
                            We understand the modern tech landscape. That&apos;s why CS-Arena integrates
                            directly with live GitHub APIs, utilizes modern tech-stack filtering, and provides
                            real-time engagement metrics. Whether you are a MERN stack wizard, a systems
                            programmer, or an AI enthusiast, this is your arena.
                        </p>
                    </div>

                    {/* CTA */}
                    <div className="p-8 rounded-2xl text-center border border-primary/20 bg-primary/5">
                        <h3 className="text-[20px] font-bold text-black dark:text-white mb-3">
                            Ready to enter the arena?
                        </h3>
                        <p className="text-[14px] text-black/50 dark:text-white/40 mb-6">
                            Submit your project today and let the world see what you&apos;ve built.
                        </p>
                        <Link
                            href="/project/create"
                            className="inline-block bg-primary text-white font-bold px-8 py-3 rounded-full hover:bg-primary-600 hover:shadow-glow transition-all duration-300"
                        >
                            Submit Your Project
                        </Link>
                    </div>

                </div>
            </div>
        </main>
    );
};

export default AboutPage;