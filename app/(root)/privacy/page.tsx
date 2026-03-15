import React from "react";
import type { Metadata } from "next";
import PolicySections from "@/components/shared/PolicySections";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "Learn how we collect, use, and protect your data at CS-Arena.",
};

const sections = [
    {
        title: "1. Information We Collect",
        content:
            "When you log in using GitHub, we collect basic public information such as your name, username, email address, and profile picture. We also collect the data you voluntarily provide when submitting a project, including GitHub repository links, tech stacks, and project descriptions.",
    },
    {
        title: "2. How We Use Your Data",
        content:
            "Your data is primarily used to create your developer profile and showcase your projects on the CS-Arena platform. We use GitHub APIs to fetch live statistics solely to display them on your project cards. We do not sell or share your personal data with third-party marketers.",
    },
    {
        title: "3. Data Security",
        content:
            "We implement industry-standard security measures to protect your data. Your project details and profile information are stored securely using Sanity's robust content lake, and authentication is handled securely via NextAuth and GitHub OAuth.",
    },
];

const PrivacyPage = () => (
    <main className="min-h-screen bg-white dark:bg-black font-work-sans pt-20 pb-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold text-black dark:text-white mb-6 tracking-tight">
                    Privacy <span className="text-primary">Policy</span>
                </h1>
                <p className="text-20-medium text-black/50 dark:text-white/50">
                    Last updated: March 2026
                </p>
            </div>
            <PolicySections sections={sections} />
        </div>
    </main>
);

export default PrivacyPage;