import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | CS-Arena",
    description: "Learn how we collect, use, and protect your data at CS-Arena.",
};

const PrivacyPage = () => {
    return (
        <main className="min-h-screen bg-white font-work-sans pt-20 pb-24">
            <div className="max-w-3xl mx-auto px-6 lg:px-8">

                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-black-300 mb-6 tracking-tight">
                        Privacy <span className="text-primary">Policy</span>
                    </h1>
                    <p className="text-20-medium text-black-200">
                        Last updated: March 2026
                    </p>
                </div>

                <div className="space-y-12 text-16-medium text-black-200 leading-loose">

                    <section>
                        <h2 className="text-24-black text-black-300 mb-4 border-b-2 border-primary/20 pb-2 inline-block">
                            1. Information We Collect
                        </h2>
                        <p>
                            When you log in using GitHub, we collect basic public information such as your name, username, email address, and profile picture. We also collect the data you voluntarily provide when submitting a project, including GitHub repository links, tech stacks, and project descriptions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-24-black text-black-300 mb-4 border-b-2 border-primary/20 pb-2 inline-block">
                            2. How We Use Your Data
                        </h2>
                        <p>
                            Your data is primarily used to create your developer profile and showcase your projects on the CS-Arena platform. We use GitHub APIs to fetch live statistics (Stars, Forks, Issues) solely to display them on your project cards. We do not sell or share your personal data with third-party marketers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-24-black text-black-300 mb-4 border-b-2 border-primary/20 pb-2 inline-block">
                            3. Data Security
                        </h2>
                        <p>
                            We implement industry-standard security measures to protect your data. Your project details and profile information are stored securely using Sanity's robust content lake, and authentication is handled securely via NextAuth and GitHub OAuth.
                        </p>
                    </section>

                </div>
            </div>
        </main>
    );
};

export default PrivacyPage;