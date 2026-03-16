import React from "react";
import type { Metadata } from "next";
import { FileText, Scale, FileCode2, Copyright, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
    title: "Terms of Service | CS-Arena",
    description: "The rules, guidelines, and agreements for using the CS-Arena platform.",
};

const TermsPage = () => {
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
                        <Scale className="size-7 md:size-8 text-primary" aria-hidden="true" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-black dark:text-white mb-6 tracking-tight">
                        Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Service</span>
                    </h1>
                    <div className="inline-flex items-center gap-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-2 rounded-full text-sm font-medium text-slate-500 dark:text-white/60 shadow-sm dark:shadow-none">
                        <FileText className="size-4" />
                        <span>Effective Date: March 2026</span>
                    </div>
                </div>

                {/* ─── Document Container ─── */}
                <div className="bg-white dark:bg-[#111115] border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 sm:p-10 md:p-16 shadow-sm dark:shadow-2xl">

                    <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-white/70">

                        <p className="text-lg mb-10">
                            Welcome to CS-Arena. By accessing or using our platform, you agree to be bound by these Terms of Service. Please read them carefully before submitting your projects or interacting with the community. If you do not agree with any part of these terms, you are prohibited from using the platform.
                        </p>

                        {/* Section 1 */}
                        <div className="mb-12">
                            <h2 className="flex items-center gap-3 text-2xl text-black dark:text-white mb-6 border-b border-slate-100 dark:border-white/5 pb-4">
                                <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-500">
                                    <Scale className="size-5" />
                                </div>
                                1. Acceptance of Terms
                            </h2>
                            <p>
                                By connecting your GitHub account and using CS-Arena, you confirm that you have read, understood, and agreed to these Terms of Service. These terms apply to all visitors, users, and others who access the service.
                            </p>
                        </div>

                        {/* Section 2 */}
                        <div className="mb-12">
                            <h2 className="flex items-center gap-3 text-2xl text-black dark:text-white mb-6 border-b border-slate-100 dark:border-white/5 pb-4">
                                <div className="p-2 bg-red-50 dark:bg-red-500/10 rounded-lg text-red-500">
                                    <FileCode2 className="size-5" />
                                </div>
                                2. User Conduct & Submissions
                            </h2>
                            <p>
                                CS-Arena is a professional stage for your code. You are solely responsible for the projects, links, and content you submit. By using the platform, you agree to the following code of conduct:
                            </p>
                            <ul className="list-disc pl-6 space-y-3 mt-4 text-slate-600 dark:text-white/70">
                                <li><strong>No Malicious Content:</strong> You will not submit repositories containing malware, viruses, or any code designed to harm or exploit other users.</li>
                                <li><strong>Respect Intellectual Property:</strong> You must own the rights to the code you submit or have explicit permission to share it. Do not pass off others&apos; work as your own.</li>
                                <li><strong>Accurate Representation:</strong> Project descriptions, tech stacks, and team member details must be accurate and truthful.</li>
                            </ul>
                            <p className="mt-4 font-medium text-black dark:text-white">
                                CS-Arena reserves the right to remove any project or ban any user that violates these guidelines without prior notice.
                            </p>
                        </div>

                        {/* Section 3 */}
                        <div className="mb-12">
                            <h2 className="flex items-center gap-3 text-2xl text-black dark:text-white mb-6 border-b border-slate-100 dark:border-white/5 pb-4">
                                <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-emerald-500">
                                    <Copyright className="size-5" />
                                </div>
                                3. Platform Rights & Ownership
                            </h2>
                            <p>
                                <strong>You retain full ownership of your code and projects.</strong> CS-Arena does not claim any intellectual property rights over the repositories you link.
                            </p>
                            <p className="mt-4">
                                However, by submitting your project to CS-Arena, you grant us a worldwide, royalty-free, and non-exclusive license to display your project details, pitch, thumbnail images, and GitHub statistics on our platform for promotional and community-building purposes.
                            </p>
                        </div>

                        {/* Section 4 */}
                        <div className="mb-8">
                            <h2 className="flex items-center gap-3 text-2xl text-black dark:text-white mb-6 border-b border-slate-100 dark:border-white/5 pb-4">
                                <div className="p-2 bg-amber-50 dark:bg-amber-500/10 rounded-lg text-amber-500">
                                    <AlertTriangle className="size-5" />
                                </div>
                                4. Disclaimer of Warranties
                            </h2>
                            <p>
                                CS-Arena is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. While we strive to provide a seamless experience, we make no warranties, expressed or implied, regarding the platform&apos;s uptime, accuracy of GitHub statistics, or the success of finding contributors through our service.
                            </p>
                        </div>

                    </div>

                </div>
            </div>
        </main>
    );
};

export default TermsPage;