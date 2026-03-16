import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Code2, Trophy, Users, Zap, Layers, Rocket, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
    title: "About Us | CS-Arena",
    description: "Learn more about CS-Arena, the ultimate platform for computer science students.",
};

const AboutPage = () => {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-[#0d0d0f] font-work-sans pb-24 relative selection:bg-primary/30 transition-colors duration-300">

            {/* Background Effects */}
            <div className="absolute inset-0 grid-bg opacity-40 dark:opacity-40 pointer-events-none" aria-hidden="true" />
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-30 dark:opacity-15 blur-[120px] pointer-events-none"
                style={{ background: "radial-gradient(ellipse, #3b82f6 0%, transparent 70%)" }}
                aria-hidden="true"
            />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 relative z-10">

                {/* ─── Hero Section ─── */}
                <div className="flex flex-col items-center text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 backdrop-blur-sm shadow-sm">
                        <Rocket className="size-4" />
                        <span>Our Story</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-black dark:text-white tracking-tight leading-tight mb-6">
                        About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">CS-Arena</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 dark:text-white/50 max-w-2xl mx-auto leading-relaxed">
                        Empowering the next generation of software engineers to build, collaborate, and get hired. We turn hidden local projects into global portfolios.
                    </p>
                </div>

                {/* ─── The Mission ─── */}
                <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-sm dark:shadow-none mb-12 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 pointer-events-none">
                        <Trophy className="size-40 text-primary" />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-4">Our Mission</h2>
                        <p className="text-base md:text-lg text-slate-600 dark:text-white/60 leading-relaxed max-w-3xl">
                            CS-Arena was born out of a simple observation: Computer Science students build incredible graduation and side projects, but these masterpieces often end up hidden in private repositories or forgotten on local hard drives. Our mission is to provide a dedicated, professional stage where your code can shine, connecting brilliant minds with real-world opportunities.
                        </p>
                    </div>
                </div>

                {/* ─── What We Do (Grid) ─── */}
                <div className="mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-8 text-center">What We Do</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: Code2, title: "Showcase Your Code", desc: "Present your tech stack, GitHub repo, and architecture in a sleek unified dashboard." },
                            { icon: Trophy, title: "Dominate the Arena", desc: "Through our upvote systems, the best community projects organically rise to the top." },
                            { icon: Users, title: "Open Collaboration", desc: "Connect with developers who want to contribute to meaningful open-source projects." },
                        ].map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 md:p-8 rounded-3xl shadow-sm dark:shadow-none hover:-translate-y-1 hover:border-primary/30 transition-all duration-300">
                                <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                                    <Icon className="size-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-black dark:text-white mb-3">{title}</h3>
                                <p className="text-sm text-slate-500 dark:text-white/40 leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ─── The Tech Behind The Arena (The Flex Section) ─── */}
                <div className="bg-gradient-to-br from-slate-900 to-black rounded-3xl p-8 md:p-12 mb-16 border border-slate-800 shadow-xl relative overflow-hidden">
                    {/* Decorative glows */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-primary to-emerald-500" />
                    <div className="absolute -bottom-24 -right-24 size-64 bg-primary/20 blur-[80px] rounded-full" />

                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 text-primary font-bold mb-4">
                                <Zap className="size-5" />
                                <span className="uppercase tracking-wider text-sm">Engineering</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                Built for Developers, <br /> By Developers
                            </h2>
                            <p className="text-slate-400 leading-relaxed text-base">
                                We understand the modern tech landscape. CS-Arena is a highly optimized Full-Stack application powered by <strong className="text-white">Next.js 15 (App Router)</strong>, leveraging <strong className="text-white">React 19</strong> features. We utilize <strong className="text-white">Sanity CMS</strong> for robust content management and integrate directly with live GitHub APIs. Whether you are a MERN stack wizard or a systems programmer, this is your arena.
                            </p>
                        </div>

                        <div className="shrink-0 grid grid-cols-2 gap-3 w-full md:w-auto">
                            {['Next.js 15', 'React 19', 'Tailwind CSS', 'Sanity CMS', 'NextAuth', 'TypeScript'].map((tech) => (
                                <div key={tech} className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl flex items-center gap-2 backdrop-blur-sm">
                                    <Layers className="size-4 text-slate-400" />
                                    <span className="text-slate-200 text-sm font-medium">{tech}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ─── CTA Section ─── */}
                <div className="text-center p-8 md:p-12 rounded-[2rem] border border-primary/20 bg-primary/5 relative overflow-hidden shadow-lg shadow-primary/5">
                    <div
                        className="absolute inset-0 opacity-30 dark:opacity-20 blur-[80px] pointer-events-none"
                        style={{ background: "radial-gradient(ellipse at center, #3b82f6 0%, transparent 70%)" }}
                        aria-hidden="true"
                    />

                    <div className="relative z-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-4">Ready to enter the arena?</h2>
                        <p className="text-base text-slate-600 dark:text-white/50 mb-8 max-w-xl mx-auto leading-relaxed">
                            Don't let your hard work collect virtual dust. Submit your project today and let the world see what you've built.
                        </p>
                        <Link
                            href="/project/create"
                            className="group inline-flex items-center gap-2 bg-black dark:bg-primary text-white dark:text-white px-8 py-4 rounded-full hover:bg-slate-800 dark:hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-300 font-semibold text-base hover:scale-105"
                        >
                            <span>Submit Your Project</span>
                            <ArrowRight className="size-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

            </div>
        </main>
    );
};

export default AboutPage;