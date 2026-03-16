import React from "react";
import type { Metadata } from "next";
import { Shield, Lock, Eye, Database, Server } from "lucide-react";

export const metadata: Metadata = {
    title: "Privacy Policy | CS-Arena",
    description: "Learn how we collect, use, and protect your data at CS-Arena.",
};

const PrivacyPage = () => {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-[#0d0d0f] font-work-sans pb-24 relative selection:bg-primary/30 transition-colors duration-300">

            {/* ─── Background Effects ─── */}
            <div className="absolute inset-0 grid-bg opacity-40 dark:opacity-40 pointer-events-none" aria-hidden="true" />
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-30 dark:opacity-15 blur-[120px] pointer-events-none"
                style={{ background: "radial-gradient(ellipse, #3b82f6 0%, transparent 70%)" }}
                aria-hidden="true"
            />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 relative z-10">

                {/* ─── Header ─── */}
                <div className="text-center mb-12 md:mb-16">
                    <div className="inline-flex items-center justify-center size-14 md:size-16 bg-primary/10 border border-primary/20 rounded-2xl mb-6 shadow-sm backdrop-blur-sm">
                        <Shield className="size-7 md:size-8 text-primary" aria-hidden="true" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-black dark:text-white mb-6 tracking-tight">
                        Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Policy</span>
                    </h1>
                    <div className="inline-flex items-center gap-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-2 rounded-full text-sm font-medium text-slate-500 dark:text-white/60 shadow-sm dark:shadow-none">
                        <Lock className="size-4" />
                        <span>Effective Date: March 2026</span>
                    </div>
                </div>

                {/* ─── Document Container ─── */}
                <div className="bg-white dark:bg-[#111115] border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 sm:p-10 md:p-16 shadow-sm dark:shadow-2xl">

                    <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-white/70">

                        <p className="text-lg mb-10">
                            At CS-Arena, we believe in open-source engineering and transparent data practices. This Privacy Policy explains how we collect, use, and safeguard your information when you interact with our platform. We only ask for personal information when we truly need it to provide a service to you.
                        </p>

                        {/* Section 1 */}
                        <div className="mb-12">
                            <h2 className="flex items-center gap-3 text-2xl text-black dark:text-white mb-6 border-b border-slate-100 dark:border-white/5 pb-4">
                                <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-500">
                                    <Eye className="size-5" />
                                </div>
                                1. Information We Collect
                            </h2>
                            <p>
                                To provide a seamless developer experience, we collect minimal data required for authentication and project showcasing:
                            </p>
                            <ul className="list-disc pl-6 space-y-3 mt-4 text-slate-600 dark:text-white/70">
                                <li><strong>Authentication Data:</strong> When you log in using GitHub OAuth via NextAuth.js, we securely receive your public profile information (Name, Username, Email address, and Avatar). We <strong>do not</strong> have access to your GitHub passwords.</li>
                                <li><strong>Project Submissions:</strong> Information you voluntarily provide when submitting to the arena, such as repository URLs, tech stacks, video demos, and project descriptions.</li>
                                <li><strong>Interaction Data:</strong> We store basic interaction metrics (like upvotes and views) to maintain the integrity of our Global Leaderboard.</li>
                            </ul>
                        </div>

                        {/* Section 2 */}
                        <div className="mb-12">
                            <h2 className="flex items-center gap-3 text-2xl text-black dark:text-white mb-6 border-b border-slate-100 dark:border-white/5 pb-4">
                                <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-emerald-500">
                                    <Database className="size-5" />
                                </div>
                                2. How We Use Your Data
                            </h2>
                            <p>
                                Your data is exclusively used to power the CS-Arena platform and enhance community collaboration. We use it to:
                            </p>
                            <ul className="list-disc pl-6 space-y-3 mt-4 text-slate-600 dark:text-white/70">
                                <li>Create and manage your public developer profile.</li>
                                <li>Fetch and display live statistics (Stars, Forks, Issues) directly from public GitHub APIs to your project cards.</li>
                                <li>Prevent spam and manipulation of the upvoting system.</li>
                                <li>Connect you with potential open-source contributors or recruiters.</li>
                            </ul>
                            <p className="mt-4 font-medium text-black dark:text-white">
                                We do not sell, rent, or share your personal data with third-party marketers or advertisers.
                            </p>
                        </div>

                        {/* Section 3 */}
                        <div className="mb-12">
                            <h2 className="flex items-center gap-3 text-2xl text-black dark:text-white mb-6 border-b border-slate-100 dark:border-white/5 pb-4">
                                <div className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-lg text-purple-500">
                                    <Server className="size-5" />
                                </div>
                                3. Data Storage & Security
                            </h2>
                            <p>
                                We build on top of modern, secure infrastructure. Your project details and profile information are stored securely in <strong>Sanity&apos;s Content Lake</strong>. Authentication sessions are handled via cryptographically secure, HTTP-only cookies managed by <strong>NextAuth.js</strong>.
                            </p>
                            <p className="mt-4">
                                While we implement industry-standard security measures, no method of transmission over the Internet or electronic storage is 100% secure. We continuously monitor our systems to ensure your data remains protected.
                            </p>
                        </div>

                        {/* Section 4 */}
                        <div className="mb-8">
                            <h2 className="flex items-center gap-3 text-2xl text-black dark:text-white mb-6 border-b border-slate-100 dark:border-white/5 pb-4">
                                <div className="p-2 bg-amber-50 dark:bg-amber-500/10 rounded-lg text-amber-500">
                                    <Shield className="size-5" />
                                </div>
                                4. Your Rights & Controls
                            </h2>
                            <p>
                                You have full ownership of your data. At any time, you can:
                            </p>
                            <ul className="list-disc pl-6 space-y-3 mt-4 text-slate-600 dark:text-white/70">
                                <li>Edit or update your project submissions.</li>
                                <li>Unlink your GitHub account from the platform.</li>
                                <li>Request the complete deletion of your profile and associated projects from our database by contacting the maintainers.</li>
                            </ul>
                        </div>

                    </div>

                </div>
            </div>
        </main>
    );
};

export default PrivacyPage;