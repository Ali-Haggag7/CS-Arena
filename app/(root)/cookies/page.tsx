import React from "react";
import type { Metadata } from "next";
import { Cookie, Key, Database, EyeOff, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
    title: "Cookie Policy | CS-Arena",
    description: "Transparency on how CS-Arena uses cookies and local storage.",
};

const CookiesPage = () => {
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
                        <Cookie className="size-7 md:size-8 text-primary" aria-hidden="true" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-black dark:text-white mb-6 tracking-tight">
                        Cookie <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Policy</span>
                    </h1>
                    <div className="inline-flex items-center gap-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-2 rounded-full text-sm font-medium text-slate-500 dark:text-white/60 shadow-sm dark:shadow-none">
                        <ShieldCheck className="size-4" />
                        <span>Effective Date: March 2026</span>
                    </div>
                </div>

                {/* ─── Document Container ─── */}
                <div className="bg-white dark:bg-[#111115] border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 sm:p-10 md:p-16 shadow-sm dark:shadow-2xl">

                    <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-white/70">

                        <p className="text-lg mb-10">
                            At CS-Arena, we believe in complete transparency about what we store in your browser. Unlike many modern platforms, we keep our storage footprint incredibly light. This page explains our use of cookies and local storage.
                        </p>

                        {/* Section 1 */}
                        <div className="mb-12">
                            <h2 className="flex items-center gap-3 text-2xl text-black dark:text-white mb-6 border-b border-slate-100 dark:border-white/5 pb-4">
                                <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-500">
                                    <Key className="size-5" />
                                </div>
                                1. Essential Authentication Cookies
                            </h2>
                            <p>
                                CS-Arena uses essential cookies strictly for security and authentication purposes. We do not use cookies for tracking or advertising.
                            </p>
                            <ul className="list-disc pl-6 space-y-3 mt-4 text-slate-600 dark:text-white/70">
                                <li><strong>NextAuth Session:</strong> When you log in via GitHub, a secure, HTTP-only session cookie is created by NextAuth.js. This cookie is strictly necessary to keep you logged in as you navigate the platform and securely submit projects.</li>
                                <li><strong>CSRF Token:</strong> A token used to prevent Cross-Site Request Forgery attacks, ensuring your interactions with our server are secure.</li>
                            </ul>
                        </div>

                        {/* Section 2 */}
                        <div className="mb-12">
                            <h2 className="flex items-center gap-3 text-2xl text-black dark:text-white mb-6 border-b border-slate-100 dark:border-white/5 pb-4">
                                <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-emerald-500">
                                    <Database className="size-5" />
                                </div>
                                2. Browser Local Storage
                            </h2>
                            <p>
                                To provide a blazing-fast user experience and prevent server overload, we utilize your browser&apos;s Local Storage for non-sensitive UI state management:
                            </p>
                            <ul className="list-disc pl-6 space-y-3 mt-4 text-slate-600 dark:text-white/70">
                                <li><strong>Upvote Persistence:</strong> We store keys like <code>upvote_[project_id]</code> and <code>interacted_[project_id]</code> locally. This helps us optimistically update the UI when you like a project, ensuring a seamless experience while preventing accidental spam on our Leaderboard APIs.</li>
                                <li><strong>Theme Preferences:</strong> If applicable, we may store your preference for Light or Dark mode to prevent screen flickering during page navigation.</li>
                            </ul>
                        </div>

                        {/* Section 3 */}
                        <div className="mb-8">
                            <h2 className="flex items-center gap-3 text-2xl text-black dark:text-white mb-6 border-b border-slate-100 dark:border-white/5 pb-4">
                                <div className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-lg text-purple-500">
                                    <EyeOff className="size-5" />
                                </div>
                                3. Absolutely No Third-Party Tracking
                            </h2>
                            <p>
                                We respect your privacy as a developer. Therefore, CS-Arena <strong>does not</strong> use:
                            </p>
                            <ul className="list-disc pl-6 space-y-3 mt-4 text-slate-600 dark:text-white/70">
                                <li>Google Analytics or intrusive user-flow tracking scripts.</li>
                                <li>Facebook/Meta Pixels or any social media advertising trackers.</li>
                                <li>Cross-site tracking cookies.</li>
                            </ul>
                            <p className="mt-4 font-medium text-black dark:text-white">
                                Your activity on our platform is yours alone, and it is never sold to advertisers.
                            </p>
                        </div>

                    </div>

                </div>
            </div>
        </main>
    );
};

export default CookiesPage;