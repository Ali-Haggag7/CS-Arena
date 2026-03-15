import React from "react";
import { Rocket, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Coming Soon",
    description: "We are cooking something awesome. Stay tuned!",
};

const ComingSoonPage = () => (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black font-work-sans px-6 text-center">
        <div className="p-6 bg-primary/10 rounded-full mb-8 animate-bounce">
            <Rocket className="size-16 text-primary" aria-hidden="true" />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-black dark:text-white mb-6 tracking-tight">
            Cooking Something <span className="text-primary">Awesome</span>
        </h1>
        <p className="text-20-medium text-black/50 dark:text-white/50 max-w-2xl mb-10 leading-relaxed">
            This feature is currently under development. We are working hard to bring
            you the best experience possible. Stay tuned!
        </p>
        <Link
            href="/"
            className="flex items-center gap-2 bg-black dark:bg-white dark:text-black text-white px-8 py-4 rounded-full hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-all duration-300 text-16-bold shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
            <ArrowLeft className="size-5" aria-hidden="true" />
            Back to Arena
        </Link>
    </main>
);

export default ComingSoonPage;