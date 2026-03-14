import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | CS-Arena",
    description: "The rules and guidelines for using the CS-Arena platform.",
};

const TermsPage = () => {
    return (
        <main className="min-h-screen bg-white font-work-sans pt-20 pb-24">
            <div className="max-w-3xl mx-auto px-6 lg:px-8">

                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-black-300 mb-6 tracking-tight">
                        Terms of <span className="text-primary">Service</span>
                    </h1>
                    <p className="text-20-medium text-black-200">
                        Please read these terms carefully before entering the arena.
                    </p>
                </div>

                <div className="space-y-12 text-16-medium text-black-200 leading-loose">

                    <section>
                        <h2 className="text-24-black text-black-300 mb-4 border-b-2 border-primary/20 pb-2 inline-block">
                            1. Acceptance of Terms
                        </h2>
                        <p>
                            By accessing and using CS-Arena, you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, you are prohibited from using the platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-24-black text-black-300 mb-4 border-b-2 border-primary/20 pb-2 inline-block">
                            2. User Conduct & Submissions
                        </h2>
                        <p>
                            You are solely responsible for the code, projects, and links you submit. You agree not to submit malicious code, malware, or any content that violates intellectual property rights. CS-Arena reserves the right to remove any project that violates these guidelines without prior notice.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-24-black text-black-300 mb-4 border-b-2 border-primary/20 pb-2 inline-block">
                            3. Platform Rights
                        </h2>
                        <p>
                            While you retain full ownership of your code and projects, by submitting them to CS-Arena, you grant us a license to display your project details, pitch, and GitHub statistics on our platform for promotional and community-building purposes.
                        </p>
                    </section>

                </div>
            </div>
        </main>
    );
};

export default TermsPage;