import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cookie Policy | CS-Arena",
    description: "How CS-Arena uses cookies and local storage.",
};

const CookiesPage = () => {
    return (
        <main className="min-h-screen bg-white font-work-sans pt-20 pb-24">
            <div className="max-w-3xl mx-auto px-6 lg:px-8">

                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-black-300 mb-6 tracking-tight">
                        Cookie <span className="text-primary">Policy</span>
                    </h1>
                    <p className="text-20-medium text-black-200">
                        Transparency on how we store data in your browser.
                    </p>
                </div>

                <div className="space-y-12 text-16-medium text-black-200 leading-loose">

                    <section>
                        <h2 className="text-24-black text-black-300 mb-4 border-b-2 border-primary/20 pb-2 inline-block">
                            1. Essential Cookies
                        </h2>
                        <p>
                            CS-Arena uses essential cookies strictly for authentication purposes. When you log in via GitHub, a secure session cookie is created by NextAuth to keep you logged in as you navigate through the platform. This is required for the site to function properly.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-24-black text-black-300 mb-4 border-b-2 border-primary/20 pb-2 inline-block">
                            2. Local Storage (Engagement)
                        </h2>
                        <p>
                            To provide a seamless user experience, we use your browser's Local Storage to remember your interactions, such as which projects you have upvoted. This prevents spam and ensures the integrity of our leaderboard system without requiring aggressive tracking.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-24-black text-black-300 mb-4 border-b-2 border-primary/20 pb-2 inline-block">
                            3. No Third-Party Tracking
                        </h2>
                        <p>
                            We respect your privacy. CS-Arena does not use invasive third-party tracking cookies or advertising pixels. Your activity on our platform is not sold to advertisers.
                        </p>
                    </section>

                </div>
            </div>
        </main>
    );
};

export default CookiesPage;