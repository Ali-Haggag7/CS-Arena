import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us | CS-Arena",
    description: "Learn more about CS-Arena, the ultimate platform for computer science students to showcase projects and find teams.",
};

/**
 * About Us Page
 * Features a clean, typography-focused design for optimal readability.
 */
const AboutPage = () => {
    return (
        <main className="min-h-screen bg-white font-work-sans pt-20 pb-24">
            <div className="max-w-3xl mx-auto px-6 lg:px-8">

                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-black-300 mb-6 tracking-tight">
                        About <span className="text-primary">CS-Arena</span>
                    </h1>
                    <p className="text-20-medium text-black-200 leading-relaxed">
                        Empowering the next generation of software engineers to build, collaborate, and get hired.
                    </p>
                </div>

                {/* Content Section */}
                <div className="space-y-12 text-16-medium text-black-200 leading-loose">

                    <section>
                        <h2 className="text-24-black text-black-300 mb-4 border-b-2 border-primary/20 pb-2 inline-block">
                            Our Mission
                        </h2>
                        <p>
                            CS-Arena was born out of a simple observation: Computer Science students build incredible graduation and side projects, but these masterpieces often end up hidden in private repositories or forgotten on local hard drives. Our mission is to provide a dedicated, professional stage where your code can shine and your architecture can be appreciated by the community and top tech recruiters.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-24-black text-black-300 mb-4 border-b-2 border-primary/20 pb-2 inline-block">
                            What We Do
                        </h2>
                        <ul className="list-disc pl-6 space-y-4 mt-4">
                            <li>
                                <strong className="text-black-300">Showcase Your Code:</strong> We give you the tools to present your tech stack, GitHub repository, and project architecture in a sleek, unified dashboard.
                            </li>
                            <li>
                                <strong className="text-black-300">Dominate the Arena:</strong> Through our upvote and leaderboard systems, the best projects organically rise to the top, giving you the recognition you deserve.
                            </li>
                            <li>
                                <strong className="text-black-300">Open Source Collaboration:</strong> Looking for a team? Our platform connects developers who want to contribute to meaningful projects, fostering a real-world engineering environment.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-24-black text-black-300 mb-4 border-b-2 border-primary/20 pb-2 inline-block">
                            Built for Developers, By Developers
                        </h2>
                        <p>
                            We understand the modern tech landscape. That's why CS-Arena integrates directly with live GitHub APIs, utilizes modern tech-stack filtering, and provides real-time engagement metrics. Whether you are a MERN stack wizard, a systems programmer, or an AI enthusiast, this is your arena.
                        </p>
                    </section>

                    {/* Call to Action */}
                    <div className="mt-16 p-8 bg-black-100/5 rounded-2xl border border-black-100/10 text-center">
                        <h3 className="text-24-black text-black-300 mb-4">Ready to enter the arena?</h3>
                        <p className="mb-6">Submit your project today and let the world see what you've built.</p>
                        <a
                            href="/project/create"
                            className="inline-block bg-primary text-white font-bold px-8 py-3 rounded-full hover:bg-black-300 transition-colors duration-300"
                        >
                            Submit Your Project
                        </a>
                    </div>

                </div>
            </div>
        </main>
    );
};

export default AboutPage;