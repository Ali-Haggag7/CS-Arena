import React from "react";
import { Rocket, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Coming Soon",
    description: "We are cooking something awesome. Stay tuned!",
};

const ComingSoonPage = () => (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0d0d0f] font-work-sans px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-50" aria-hidden="true" />
        <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] rounded-full opacity-10 blur-[80px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse, #3b82f6 0%, transparent 70%)" }}
            aria-hidden="true"
        />
        <div className="relative z-10 flex flex-col items-center">
            <div className="size-20 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mb-8 animate-bounce">
                <Rocket className="size-10 text-primary" aria-hidden="true" />
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-black dark:text-white mb-6 tracking-tight">
                Cooking Something <span className="text-primary">Awesome</span>
            </h1>
            <p className="text-[17px] text-black/50 dark:text-white/40 max-w-xl mb-10 leading-relaxed">
                This feature is currently under development. We are working hard to bring
                you the best experience possible. Stay tuned!
            </p>
            <Link
                href="/"
                className="flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-full hover:bg-primary-600 hover:shadow-glow transition-all duration-300 font-semibold text-[15px]"
            >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Back to Arena
            </Link>
        </div>
    </main>
);

export default ComingSoonPage;