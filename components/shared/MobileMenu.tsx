"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
    Menu, X, BadgePlus, LogOut, Github,
    LayoutGrid, Trophy, Users, Code2, BookOpen, LayoutDashboard, User as UserIcon
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";
import { signIn, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import ThemeToggle from "@/components/shared/ThemeToggle";
import LanguageToggle from "@/components/shared/LanguageToggle";

const MobileMenu = ({ session, currentLocale }: { session: any, currentLocale: string }) => {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const t = useTranslations("nav");

    const NAV_LINKS = [
        { href: "/projects", label: t("link_explore"), icon: LayoutGrid },
        { href: "/leaderboard", label: t("link_leaderboard"), icon: Trophy },
        { href: "/developers", label: t("link_developers"), icon: Users },
        { href: "/open-source", label: t("link_opensource"), icon: Code2 },
        { href: "/about", label: t("link_about"), icon: BookOpen },
    ];

    useEffect(() => {
        setMounted(true);
    }, []);

    const close = () => setOpen(false);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    const drawer = (
        <>
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                style={{ zIndex: 9998 }}
                onClick={close}
                aria-hidden="true"
            />

            <div
                className={`fixed top-0 rtl:left-0 ltr:right-0 h-screen w-[280px] bg-white dark:bg-[#111114] ltr:border-l rtl:border-r border-gray-200 dark:border-white/[0.06] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out font-work-sans ${open ? "translate-x-0" : "ltr:translate-x-full rtl:-translate-x-full"}`}
                style={{ zIndex: 9999 }}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.06] shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="size-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <span className="text-primary font-black text-xs">CS</span>
                        </div>
                        <span className="font-black text-[16px] text-black dark:text-white">Arena</span>
                    </div>
                    <button
                        type="button"
                        aria-label="Close"
                        onClick={close}
                        className="size-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                        <X className="size-4 text-black/50 dark:text-white/50" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pb-32 scrollbar-hide">
                    {session?.user && (
                        <div className="px-5 py-5 border-b border-gray-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.02]">
                            <div className="flex items-center gap-3 mb-4">
                                <Avatar className="size-11 ring-2 ring-primary/20 shadow-sm">
                                    <AvatarImage src={session?.user?.image ?? ""} alt={session?.user?.name ?? ""} />
                                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                        {session?.user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <p className="text-[15px] font-bold text-black dark:text-white truncate">
                                        {session?.user?.name}
                                    </p>
                                    <p className="text-[12px] font-medium text-black/40 dark:text-white/40 truncate">
                                        {session?.user?.email}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <Link
                                    href="/dashboard"
                                    onClick={close}
                                    className="flex flex-col items-center justify-center gap-1.5 bg-primary/10 text-primary py-2.5 rounded-xl hover:bg-primary/20 transition-colors"
                                >
                                    <LayoutDashboard className="size-4" />
                                    <span className="text-[11px] font-bold uppercase tracking-wider">{t("dashboard")}</span>
                                </Link>
                                <Link
                                    href={`/user/${session?.id}`}
                                    onClick={close}
                                    className="flex flex-col items-center justify-center gap-1.5 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white/70 py-2.5 rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                                >
                                    <UserIcon className="size-4" />
                                    <span className="text-[11px] font-bold uppercase tracking-wider">{t("profile")}</span>
                                </Link>
                            </div>
                        </div>
                    )}

                    <div className="px-3 py-4 space-y-1">
                        {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                onClick={close}
                                className="flex items-center gap-3 px-3 py-3 rounded-xl text-[14px] font-semibold text-slate-600 dark:text-white/60 hover:text-primary dark:hover:text-primary hover:bg-primary/5 transition-all duration-200"
                            >
                                <Icon className="size-4.5 text-slate-400 dark:text-white/40 shrink-0" />
                                {label}
                            </Link>
                        ))}
                    </div>

                    <div className="px-5 py-4 border-t border-gray-100 dark:border-white/[0.06] mt-2">
                        <p className="text-[11px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest mb-3">{t("preferences")}</p>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 flex justify-center py-2 bg-slate-100 dark:bg-white/5 rounded-xl">
                                <ThemeToggle />
                            </div>
                            <div className="flex-1 flex justify-center py-2 bg-slate-100 dark:bg-white/5 rounded-xl">
                                <LanguageToggle currentLocale={currentLocale} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 px-4 py-5 border-t border-gray-100 dark:border-white/[0.06] bg-white dark:bg-[#111114]">
                    {session?.user ? (
                        <button
                            type="button"
                            onClick={async () => {
                                close();
                                await signOut({ callbackUrl: "/" });
                            }}
                            className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 py-3 rounded-xl text-[14px] font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition-all duration-300"
                        >
                            <LogOut className="size-4" />
                            {t("logout")}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={async () => {
                                close();
                                await signIn("github");
                            }}
                            className="w-full flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black py-3 rounded-xl text-[14px] font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 shadow-md"
                        >
                            <Github className="size-4" />
                            {t("login")}
                        </button>
                    )}
                </div>
            </div>
        </>
    );

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="size-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-primary/40 transition-all duration-300"
                aria-label="Toggle menu"
                aria-expanded={open}
            >
                {open ? <X className="size-4 text-black dark:text-white" /> : <Menu className="size-4 text-black dark:text-white" />}
            </button>
            {mounted && createPortal(drawer, document.body)}
        </>
    );
};

export default MobileMenu;