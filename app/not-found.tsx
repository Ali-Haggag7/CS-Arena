import Link from "next/link";
import { SearchX, Home } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
    const t = await getTranslations("not_found");

    return (
        <main className="min-h-[85vh] flex flex-col items-center justify-center p-6 relative overflow-hidden font-work-sans">

            <div className="absolute inset-0 grid-bg opacity-30 dark:opacity-40 pointer-events-none" />
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full opacity-20 blur-[100px] pointer-events-none"
                style={{ background: "radial-gradient(ellipse, #3b82f6 0%, transparent 70%)" }}
            />

            <div className="relative z-10 flex flex-col items-center text-center max-w-lg bg-white/50 dark:bg-[#111115]/80 backdrop-blur-md p-10 sm:p-14 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-xl">

                <div className="size-24 bg-primary/10 rounded-3xl flex items-center justify-center mb-6 border border-primary/20 shadow-[0_0_30px_rgba(59,130,246,0.15)] relative group hover:scale-105 transition-transform duration-500">
                    <SearchX className="size-12 text-primary drop-shadow-md" />
                </div>

                <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 mb-2 tracking-tighter">
                    {t("title")}
                </h1>

                <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
                    {t("subtitle")}
                </h2>

                <p className="text-slate-500 dark:text-white/50 mb-10 leading-relaxed text-[15px]">
                    {t("description")}
                </p>

                <Link
                    href="/"
                    className="flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black px-8 py-3.5 rounded-full font-bold hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 w-full sm:w-auto"
                >
                    <Home className="size-4" />
                    {t("back_home")}
                </Link>
            </div>
        </main>
    );
}