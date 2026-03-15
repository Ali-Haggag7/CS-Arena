import React from "react";
import type { Metadata } from "next";
import PolicySections from "@/components/shared/PolicySections";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
    title: "Terms of Service",
    description: "The rules and guidelines for using the CS-Arena platform.",
};

const sections = [
    {
        title: "1. Acceptance of Terms",
        content: "By accessing and using CS-Arena, you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, you are prohibited from using the platform.",
    },
    {
        title: "2. User Conduct & Submissions",
        content: "You are solely responsible for the code, projects, and links you submit. You agree not to submit malicious code, malware, or any content that violates intellectual property rights. CS-Arena reserves the right to remove any project that violates these guidelines without prior notice.",
    },
    {
        title: "3. Platform Rights",
        content: "While you retain full ownership of your code and projects, by submitting them to CS-Arena, you grant us a license to display your project details, pitch, and GitHub statistics on our platform for promotional and community-building purposes.",
    },
];

const TermsPage = () => (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0d0d0f] font-work-sans pt-20 pb-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center size-14 bg-primary/10 border border-primary/20 rounded-2xl mb-6">
                    <FileText className="size-7 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-black dark:text-white mb-4 tracking-tight">
                    Terms of <span className="text-primary">Service</span>
                </h1>
                <p className="text-[17px] text-black/50 dark:text-white/40">
                    Please read these terms carefully before entering the arena.
                </p>
            </div>
            <PolicySections sections={sections} />
        </div>
    </main>
);

export default TermsPage;