import React from "react";
import type { Metadata } from "next";
import PolicySections from "@/components/shared/PolicySections";

export const metadata: Metadata = {
    title: "Cookie Policy",
    description: "How CS-Arena uses cookies and local storage.",
};

const sections = [
    {
        title: "1. Essential Cookies",
        content:
            "CS-Arena uses essential cookies strictly for authentication purposes. When you log in via GitHub, a secure session cookie is created by NextAuth to keep you logged in as you navigate through the platform. This is required for the site to function properly.",
    },
    {
        title: "2. Local Storage",
        content:
            "To provide a seamless user experience, we use your browser's Local Storage to remember your interactions, such as which projects you have upvoted. This prevents spam and ensures the integrity of our leaderboard system without requiring aggressive tracking.",
    },
    {
        title: "3. No Third-Party Tracking",
        content:
            "We respect your privacy. CS-Arena does not use invasive third-party tracking cookies or advertising pixels. Your activity on our platform is not sold to advertisers.",
    },
];

const CookiesPage = () => (
    <main className="min-h-screen bg-white dark:bg-black font-work-sans pt-20 pb-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold text-black dark:text-white mb-6 tracking-tight">
                    Cookie <span className="text-primary">Policy</span>
                </h1>
                <p className="text-20-medium text-black/50 dark:text-white/50">
                    Transparency on how we store data in your browser.
                </p>
            </div>
            <PolicySections sections={sections} />
        </div>
    </main>
);

export default CookiesPage;