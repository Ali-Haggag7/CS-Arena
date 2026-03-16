import React from "react";
import Link from "next/link";
import { Book, Terminal, Code2, LayoutTemplate, ChevronRight, Hash, ArrowRight, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Documentation | CS-Arena",
    description: "Learn how to use, integrate, and build with CS-Arena.",
};

// ─── Mock Sidebar Navigation ────────────────────────────────────────────────

const sidebarSections = [
    {
        title: "Getting Started",
        icon: <Book className="size-4" />,
        items: [
            { name: "Introduction", active: true },
            { name: "Quick Start", active: false },
            { name: "Installation", active: false },
        ]
    },
    {
        title: "Core Concepts",
        icon: <LayoutTemplate className="size-4" />,
        items: [
            { name: "Project Structure", active: false },
            { name: "Authentication", active: false },
            { name: "Database Schema", active: false },
        ]
    },
    {
        title: "API Reference",
        icon: <Terminal className="size-4" />,
        items: [
            { name: "REST Endpoints", active: false },
            { name: "Webhooks", active: false },
            { name: "Error Codes", active: false },
        ]
    },
];

// ─── Main Component ───────────────────────────────────────────────────────

const DocsPage = () => {
    return (
        <main className="min-h-screen bg-white dark:bg-[#0a0a0c] font-work-sans pt-20 transition-colors duration-300">

            {/* Top Border Gradient for a technical feel */}
            <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8 lg:gap-12 relative">

                {/* ─── Sidebar (Hidden on small screens for simplicity) ─── */}
                <aside className="hidden md:block w-64 shrink-0 py-10 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto scrollbar-hide border-r border-slate-100 dark:border-white/5 pr-6">
                    <nav className="space-y-8">
                        {sidebarSections.map((section, idx) => (
                            <div key={idx}>
                                <div className="flex items-center gap-2 text-slate-800 dark:text-white font-bold mb-3 px-2">
                                    <span className="text-indigo-500">{section.icon}</span>
                                    <h3>{section.title}</h3>
                                </div>
                                <ul className="space-y-1 border-l border-slate-100 dark:border-white/10 ml-4 pl-3">
                                    {section.items.map((item, itemIdx) => (
                                        <li key={itemIdx}>
                                            <Link
                                                href="#"
                                                className={`block px-3 py-1.5 rounded-lg text-sm transition-colors ${item.active
                                                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold"
                                                    : "text-slate-500 dark:text-white/50 hover:text-black dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                                                    }`}
                                            >
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </aside>

                {/* ─── Main Documentation Content ─── */}
                <article className="flex-1 py-10 pb-24 min-w-0">

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-indigo-500 font-medium mb-6">
                        <span>Docs</span>
                        <ChevronRight className="size-3.5" />
                        <span>Getting Started</span>
                        <ChevronRight className="size-3.5" />
                        <span className="text-slate-500 dark:text-white/50">Introduction</span>
                    </div>

                    <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-indigo-500 hover:prose-a:text-indigo-600 prose-code:text-indigo-600 dark:prose-code:text-indigo-400 prose-code:bg-indigo-50 dark:prose-code:bg-indigo-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none">

                        <h1 className="text-4xl md:text-5xl tracking-tight mb-4 flex items-center gap-3">
                            Introduction
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 dark:text-white/60 lead">
                            Welcome to the CS-Arena documentation. This guide will help you understand the core architecture, how to set up the project locally, and how to contribute to our open-source ecosystem.
                        </p>

                        <hr className="my-8 border-slate-200 dark:border-white/10" />

                        <h2 className="flex items-center gap-2 group cursor-pointer">
                            <Hash className="size-5 text-slate-300 dark:text-white/20 group-hover:text-indigo-500 transition-colors" />
                            What is CS-Arena?
                        </h2>
                        <p>
                            CS-Arena is a specialized platform designed for computer science students and developers to showcase their graduation projects, discover startup ideas, and find collaborators. Built with modern web technologies, it ensures a seamless and blazing-fast user experience.
                        </p>

                        <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl p-4 my-6">
                            <strong className="text-indigo-700 dark:text-indigo-400 flex items-center gap-2 mb-1">
                                <Code2 className="size-4" /> Tech Stack Note
                            </strong>
                            <p className="m-0 text-indigo-600 dark:text-indigo-300 text-sm">
                                This project relies heavily on <code>Next.js 15</code> (App Router), <code>React 19</code>, <code>Tailwind CSS</code>, and <code>Sanity CMS</code>. Ensure you have basic familiarity with these tools before contributing.
                            </p>
                        </div>

                        <h2 className="flex items-center gap-2 group cursor-pointer">
                            <Hash className="size-5 text-slate-300 dark:text-white/20 group-hover:text-indigo-500 transition-colors" />
                            Quick Setup
                        </h2>
                        <p>
                            To get the project running on your local machine, you need to clone the repository and install the necessary dependencies using <code>npm</code> or <code>pnpm</code>.
                        </p>

                        {/* Custom Mock Code Block */}
                        <div className="my-6 rounded-xl overflow-hidden border border-slate-200 dark:border-[#2a2a2e] bg-[#0d0d0f] shadow-sm">
                            <div className="flex items-center justify-between px-4 py-2 bg-[#161618] border-b border-[#2a2a2e]">
                                <span className="text-xs font-mono text-slate-400">terminal</span>
                                <div className="flex gap-1.5">
                                    <div className="size-2.5 rounded-full bg-slate-600" />
                                    <div className="size-2.5 rounded-full bg-slate-600" />
                                    <div className="size-2.5 rounded-full bg-slate-600" />
                                </div>
                            </div>
                            <pre className="p-4 m-0 text-sm font-mono text-slate-300 overflow-x-auto">
                                <code className="bg-transparent text-inherit p-0">
                                    <span className="text-indigo-400">git</span> clone https://github.com/Ali-Haggag7/CS-Arena.git{"\n"}
                                    <span className="text-indigo-400">cd</span> CS-Arena{"\n"}
                                    <span className="text-indigo-400">npm</span> install{"\n"}
                                    <span className="text-indigo-400">npm</span> run dev
                                </code>
                            </pre>
                        </div>

                        <p>
                            After running the commands above, open <Link href="http://localhost:3000" target="_blank" rel="noreferrer">http://localhost:3000</Link> in your browser to see the result.
                        </p>

                    </div>

                    {/* ─── Pagination / Next Steps ─── */}
                    <div className="mt-16 pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <Link
                            href="#"
                            className="w-full sm:w-auto flex flex-col items-start p-4 rounded-xl border border-slate-200 dark:border-white/10 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                        >
                            <span className="text-xs font-semibold text-slate-400 dark:text-white/40 uppercase tracking-wider mb-1 flex items-center gap-1">
                                <ArrowLeft className="size-3 transition-transform group-hover:-translate-x-1" /> Previous
                            </span>
                            <span className="text-black dark:text-white font-medium">Installation</span>
                        </Link>

                        <Link
                            href="#"
                            className="w-full sm:w-auto flex flex-col items-end p-4 rounded-xl border border-slate-200 dark:border-white/10 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group text-right"
                        >
                            <span className="text-xs font-semibold text-slate-400 dark:text-white/40 uppercase tracking-wider mb-1 flex items-center gap-1">
                                Next <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                            </span>
                            <span className="text-indigo-600 dark:text-indigo-400 font-medium">Quick Start</span>
                        </Link>
                    </div>

                </article>
            </div>
        </main>
    );
};

export default DocsPage;