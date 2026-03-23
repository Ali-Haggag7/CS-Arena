import dynamic from "next/dynamic";
import Link from "next/link";
import { auth, signOut, signIn } from "@/auth";
import { Github, LayoutDashboard, User as UserIcon, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";
import ThemeToggle from "@/components/shared/ThemeToggle";
import MobileMenu from "@/components/shared/MobileMenu";
import LanguageToggle from "@/components/shared/LanguageToggle";
import { getLocale, getTranslations } from "next-intl/server";

const FeedbackButton = dynamic(() => import("@/components/shared/FeedbackButton"));

const Navbar = async () => {
  const session = await auth();
  const locale = await getLocale();
  const t = await getTranslations("nav");

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#0d0d0f]/90 backdrop-blur-xl border-b border-black/5 dark:border-white/[0.06] font-work-sans transition-colors duration-300">
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
          <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <span className="text-primary font-black text-sm">CS</span>
          </div>
          <span className="font-black text-[18px] text-black dark:text-white tracking-tight">Arena</span>
        </Link>

        <div className="hidden sm:flex items-center gap-3">
          <FeedbackButton />
          <LanguageToggle currentLocale={locale} />
          <ThemeToggle />

          {session?.user ? (
            <>
              <Link
                href="/project/create"
                className="flex items-center gap-1.5 text-[13px] font-semibold bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-600 hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300"
              >
                {t("create")}
              </Link>

              <div className="relative group">
                <button type="button" className="flex items-center outline-none pt-1 pb-1 pr-1 pl-1">
                  <Avatar className="size-9 ring-1 ring-black/10 dark:ring-white/10 group-hover:ring-primary/50 transition-all duration-300 cursor-pointer">
                    <AvatarImage src={session?.user?.image ?? ""} alt={session?.user?.name ?? ""} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                      {session?.user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>

                <div className="absolute top-full mt-1 ltr:right-0 rtl:left-0 w-56 bg-white dark:bg-[#161618] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                    <p className="text-sm font-bold text-black dark:text-white truncate">
                      {session?.user?.name}
                    </p>
                    <p className="text-xs font-medium text-slate-500 dark:text-white/40 truncate mt-0.5">
                      {session?.user?.email}
                    </p>
                  </div>

                  <div className="p-2 flex flex-col gap-1">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-600 dark:text-white/70 hover:text-primary dark:hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
                    >
                      <LayoutDashboard className="size-4" />
                      {t("dashboard")}
                    </Link>
                    <Link
                      href={`/user/${session?.id}`}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-600 dark:text-white/70 hover:text-primary dark:hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
                    >
                      <UserIcon className="size-4" />
                      {t("profile")}
                    </Link>
                  </div>

                  <div className="p-2 border-t border-slate-100 dark:border-white/5">
                    <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
                      <button
                        type="submit"
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                      >
                        <LogOut className="size-4" />
                        {t("logout")}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <form action={async () => { "use server"; await signIn("github"); }}>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-gray-900 dark:bg-white/10 border border-gray-800 dark:border-white/10 text-white px-4 py-2 rounded-full text-[13px] font-semibold hover:bg-primary transition-all duration-300"
                  title="Login with GitHub"
                >
                  <Github className="size-4" />
                </button>
              </form>

              <form action={async () => { "use server"; await signIn("google"); }}>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white px-4 py-2 rounded-full text-[13px] font-semibold hover:border-primary transition-all duration-300 shadow-sm"
                  title="Login with Google"
                >
                  <svg className="size-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Google</span>
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="flex sm:hidden items-center gap-2">
          <FeedbackButton />
          {session?.user && (
            <Link
              href="/project/create"
              className="flex items-center gap-1.5 text-[11px] font-semibold bg-primary text-white px-3 py-1.5 rounded-full hover:bg-primary-600 transition-all duration-300"
            >
              {t("create")}
            </Link>
          )}
          <MobileMenu session={session} currentLocale={locale} />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;