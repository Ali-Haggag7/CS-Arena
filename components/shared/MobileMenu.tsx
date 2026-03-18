"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
    Menu, X, BadgePlus, LogOut, Github,
    LayoutGrid, Trophy, Users, Code2, BookOpen
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";
import { signIn, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

const MobileMenu = ({ session }: { session: any }) => {
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

    // Lock body scroll when open
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
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                style={{ zIndex: 9998 }}
                onClick={close}
                aria-hidden="true"
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 rtl:left-0 ltr:right-0 h-screen w-[280px] bg-white dark:bg-[#111114] ltr:border-l rtl:border-r border-gray-200 dark:border-white/[0.06] shadow-2xl overflow-y-auto transition-transform duration-300 ease-in-out font-work-sans ${open ? "translate-x-0" : "ltr:translate-x-full rtl:-translate-x-full"
                    }`}
                style={{ zIndex: 9999 }}
            >
                {/* Drawer Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.06]">
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

                {/* User Section */}
                {session?.user && (
                    <div className="px-5 py-4 border-b border-gray-100 dark:border-white/[0.06]">
                        <Link
                            href={`/user/${session?.id}`}
                            onClick={close}
                            className="flex items-center gap-3 group"
                        >
                            <Avatar className="size-10 ring-1 ring-black/10 dark:ring-white/10 group-hover:ring-primary/40 transition-all">
                                <AvatarImage src={session?.user?.image ?? ""} alt={session?.user?.name ?? ""} />
                                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                    {session?.user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                                <p className="text-[14px] font-semibold text-black dark:text-white truncate">
                                    {session?.user?.name}
                                </p>
                                <p className="text-[12px] text-black/40 dark:text-white/30 truncate">
                                    {session?.user?.email}
                                </p>
                            </div>
                        </Link>
                    </div>
                )}

                {/* Nav Links */}
                <div className="px-3 py-4 space-y-1">
                    {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={close}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium text-black/70 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-200"
                        >
                            <Icon className="size-4 text-black/40 dark:text-white/30 shrink-0" />
                            {label}
                        </Link>
                    ))}
                </div>

                {/* Bottom Actions */}
                <div className="absolute bottom-0 left-0 right-0 px-4 py-5 border-t border-gray-100 dark:border-white/[0.06] space-y-2">
                    {session?.user ? (
                        <>
                            <Link
                                href="/project/create"
                                onClick={close}
                                className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-xl text-[14px] font-semibold hover:bg-primary-600 transition-all duration-300"
                            >
                                <BadgePlus className="size-4" />
                                {t("create")}
                            </Link>
                            <button
                                type="button"
                                onClick={async () => {
                                    close();
                                    await signOut({ callbackUrl: "/" });
                                }}
                                className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-red-500 py-2.5 rounded-xl text-[14px] font-semibold hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-300"
                            >
                                <LogOut className="size-4" />
                                {t("logout")}
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={async () => {
                                close();
                                await signIn("github");
                            }}
                            className="w-full flex items-center justify-center gap-2 bg-gray-900 dark:bg-white/10 text-white py-2.5 rounded-xl text-[14px] font-semibold hover:bg-primary transition-all duration-300"
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
            {/* Hamburger Button */}
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="size-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-primary/40 transition-all duration-300"
                aria-label="Toggle menu"
                aria-expanded={open}
            >
                {open
                    ? <X className="size-4 text-black dark:text-white" />
                    : <Menu className="size-4 text-black dark:text-white" />
                }
            </button>

            {/* Portal — renders at body level */}
            {mounted && createPortal(drawer, document.body)}
        </>
    );
};

export default MobileMenu;