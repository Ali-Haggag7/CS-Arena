import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Code2, Trophy, Users, Zap, Layers, Rocket, ArrowRight, Target, Shield, Globe2, Activity } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("about");
    return {
        title: t("title"),
        description: t("description"),
    };
}

const AboutPage = async () => {
    const t = await getTranslations("about");

    const stats = [
        { num: "3+", label: t("stat_devs"), icon: Users },
        { num: "4+", label: t("stat_unis"), icon: Globe2 },
        { num: "7+", label: t("stat_projects"), icon: Code2 },
        { num: "2+", label: t("stat_hired"), icon: Target },
    ];

    const features = [
        { icon: Trophy, title: t("feature1_title"), desc: t("feature1_desc"), color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
        { icon: Activity, title: t("feature2_title"), desc: t("feature2_desc"), color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
        { icon: Shield, title: t("feature3_title"), desc: t("feature3_desc"), color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    ];

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0a0a0c] font-work-sans pb-24 relative selection:bg-primary/30 transition-colors duration-300 overflow-hidden">

            <div className="absolute inset-0 pointer-events-none flex justify-center opacity-40 dark:opacity-20" aria-hidden="true">
                <div className="w-px h-full bg-gradient-to-b from-transparent via-slate-300 dark:via-white/20 to-transparent mx-[15vw]" />
                <div className="w-px h-full bg-gradient-to-b from-transparent via-slate-300 dark:via-white/20 to-transparent mx-[15vw]" />
                <div className="w-px h-full bg-gradient-to-b from-transparent via-slate-300 dark:via-white/20 to-transparent mx-[15vw]" />
            </div>

            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full opacity-30 dark:opacity-15 blur-[120px] pointer-events-none"
                style={{ background: "radial-gradient(ellipse, #3b82f6 0%, transparent 70%)" }}
                aria-hidden="true"
            />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 relative z-10">

                <div className="flex flex-col items-center text-center mb-24 relative">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-8 backdrop-blur-sm shadow-sm hover:scale-105 transition-transform cursor-default">
                        <Rocket className="size-4 animate-bounce" />
                        <span>{t("hero_badge")}</span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-black dark:text-white tracking-tighter leading-[1.1] mb-8">
                        {t("hero_title1")} <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-cyan-400">
                            {t("hero_title2")}
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 dark:text-white/50 max-w-3xl mx-auto leading-relaxed font-medium">
                        {t("hero_subtitle")}
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-24">
                    {stats.map(({ num, label, icon: Icon }, idx) => (
                        <div key={idx} className="bg-white dark:bg-[#161618] border border-slate-200 dark:border-white/10 rounded-3xl p-6 md:p-8 text-center shadow-sm dark:shadow-none hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 opacity-5 dark:opacity-10 group-hover:scale-150 transition-transform duration-700 pointer-events-none">
                                <Icon className="size-24" />
                            </div>
                            <h3 className="text-4xl md:text-5xl font-black text-black dark:text-white mb-2 relative z-10 tracking-tight">{num}</h3>
                            <p className="text-sm md:text-base font-bold text-slate-500 dark:text-white/40 uppercase tracking-wider relative z-10">{label}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white dark:bg-[#111115] border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 md:p-16 shadow-xl dark:shadow-2xl mb-24 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full pointer-events-none opacity-50" />
                    <div className="relative z-10 max-w-4xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-primary/10 rounded-xl">
                                <Target className="size-6 text-primary" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white">{t("mission_title")}</h2>
                        </div>
                        <p className="text-lg md:text-xl text-slate-600 dark:text-white/60 leading-relaxed font-medium">
                            {t("mission_desc")}
                        </p>
                    </div>
                </div>

                <div className="mb-24 relative">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-black text-black dark:text-white">{t("pillars_title")}</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                        {features.map(({ icon: Icon, title, desc, color, bg, border }) => (
                            <div key={title} className={`bg-white dark:bg-[#161618] border ${border} p-8 rounded-[2rem] shadow-sm dark:shadow-none hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group`}>
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-current to-transparent opacity-10 rounded-bl-full pointer-events-none ${color}`} />
                                <div className={`size-14 ${bg} ${border} border rounded-2xl flex items-center justify-center mb-8 relative z-10 group-hover:scale-110 transition-transform`}>
                                    <Icon className={`size-7 ${color}`} />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-black dark:text-white mb-4 relative z-10">{title}</h3>
                                <p className="text-base text-slate-500 dark:text-white/50 leading-relaxed relative z-10 font-medium">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-slate-900 via-black to-slate-900 rounded-[2.5rem] p-8 md:p-16 mb-24 border border-slate-800 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-primary to-cyan-400" />
                    <div className="absolute -bottom-32 -right-32 size-96 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />

                    <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
                        <div className="flex-1 text-center lg:text-start">
                            <div className="inline-flex items-center gap-2 text-cyan-400 font-bold mb-6 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20">
                                <Zap className="size-4" />
                                <span className="uppercase tracking-widest text-xs">{t("tech_badge")}</span>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
                                {t.rich("tech_title", {
                                    bold: (chunks) => <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">{chunks}</span>
                                })}
                            </h2>

                            <p className="text-slate-400 leading-relaxed text-lg font-medium">
                                {t.rich("tech_desc", {
                                    bold: (chunks) => <strong className="text-slate-200">{chunks}</strong>
                                })}
                            </p>
                        </div>

                        <div className="shrink-0 w-full lg:w-auto grid grid-cols-2 gap-4">
                            {['Next.js 15', 'React 19', 'Tailwind CSS', 'Sanity CMS', 'NextAuth', 'TypeScript'].map((tech) => (
                                <div key={tech} className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-3 backdrop-blur-md hover:bg-white/10 transition-colors cursor-default">
                                    <Layers className="size-5 text-cyan-400" />
                                    <span className="text-white text-base font-bold">{tech}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="text-center p-10 md:p-20 rounded-[3rem] border border-primary/20 bg-primary/5 relative overflow-hidden shadow-2xl shadow-primary/10 mb-10">
                    <div
                        className="absolute inset-0 opacity-40 dark:opacity-30 blur-[100px] pointer-events-none"
                        style={{ background: "radial-gradient(ellipse at center, #3b82f6 0%, transparent 70%)" }}
                        aria-hidden="true"
                    />

                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-black text-black dark:text-white mb-6 tracking-tight">{t("cta_title")}</h2>
                        <p className="text-lg md:text-xl text-slate-600 dark:text-white/50 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                            {t("cta_desc")}
                        </p>
                        <Link
                            href="/project/create"
                            className="group inline-flex items-center gap-3 bg-black dark:bg-primary text-white px-10 py-5 rounded-full hover:bg-slate-800 dark:hover:bg-blue-600 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300 font-bold text-lg hover:-translate-y-1"
                        >
                            <span>{t("cta_button")}</span>
                            <ArrowRight className="size-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 rtl:rotate-180 rtl:group-hover:-translate-x-1.5 transition-transform" />
                        </Link>
                    </div>
                </div>

            </div>
        </main>
    );
};

export default AboutPage;