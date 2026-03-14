import React from "react";
import { Rocket, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Coming Soon | CS-Arena",
    description: "We are cooking something awesome. Stay tuned!",
};

const ComingSoonPage = () => {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-white font-work-sans px-6 text-center">

            {/* Animated Icon */}
            <div className="p-6 bg-primary/10 rounded-full mb-8 animate-bounce">
                <Rocket className="size-16 text-primary" />
            </div>

            {/* Title & Description */}
            <h1 className="text-4xl md:text-6xl font-extrabold text-black-300 mb-6 tracking-tight">
                Cooking Something <span className="text-primary">Awesome</span>
            </h1>
            <p className="text-20-medium text-black-200 max-w-2xl mb-10 leading-relaxed">
                This feature is currently under development. We are working hard to bring you the best experience possible. Stay tuned for updates!
            </p>

            {/* Back Button */}
            <Link
                href="/"
                className="flex items-center gap-2 bg-black-300 text-white px-8 py-4 rounded-full hover:bg-primary transition-all duration-300 text-16-bold shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
                <ArrowLeft className="size-5" />
                Back to Arena
            </Link>

        </main>
    );
};

export default ComingSoonPage;