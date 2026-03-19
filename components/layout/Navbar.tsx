import Link from "next/link";
import { auth, signOut, signIn } from "@/auth";
import { Github, LayoutDashboard, User as UserIcon, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";
import ThemeToggle from "@/components/shared/ThemeToggle";
import MobileMenu from "@/components/shared/MobileMenu";
import LanguageToggle from "@/components/shared/LanguageToggle";
import { getLocale, getTranslations } from "next-intl/server";

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
            <form action={async () => { "use server"; await signIn("github"); }}>
              <button
                type="submit"
                className="flex items-center gap-2 bg-gray-900 dark:bg-white/10 border border-gray-800 dark:border-white/10 text-white px-4 py-2 rounded-full text-[13px] font-semibold hover:bg-primary hover:border-primary transition-all duration-300"
              >
                <Github className="size-4" />
                {t("login")}
              </button>
            </form>
          )}
        </div>

        <div className="flex sm:hidden items-center gap-3">
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