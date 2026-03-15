import Link from "next/link";
import { auth, signOut, signIn } from "@/auth";
import { Github } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";
import ThemeToggle from "@/components/shared/ThemeToggle";
import MobileMenu from "@/components/shared/MobileMenu";

const Navbar = async () => {
  const session = await auth();

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#0d0d0f]/90 backdrop-blur-xl border-b border-black/5 dark:border-white/[0.06] font-work-sans">
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
          <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <span className="text-primary font-black text-sm">CS</span>
          </div>
          <span className="font-black text-[18px] text-black dark:text-white tracking-tight">Arena</span>
        </Link>

        {/* Desktop Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <ThemeToggle />

          {session?.user ? (
            <>
              <Link
                href="/project/create"
                className="flex items-center gap-1.5 text-[13px] font-semibold bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-600 hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300"
              >
                Create Project
              </Link>

              <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
                <button
                  type="submit"
                  className="text-[13px] font-medium text-black/50 dark:text-white/40 hover:text-red-500 dark:hover:text-red-400 transition-colors px-2"
                >
                  Logout
                </button>
              </form>

              <Link href={`/user/${session?.id}`} className="group">
                <Avatar className="size-9 ring-1 ring-black/10 dark:ring-white/10 group-hover:ring-primary/50 transition-all duration-300">
                  <AvatarImage src={session?.user?.image ?? ""} alt={session?.user?.name ?? ""} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                    {session?.user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </>
          ) : (
            <form action={async () => { "use server"; await signIn("github"); }}>
              <button
                type="submit"
                className="flex items-center gap-2 bg-gray-900 dark:bg-white/10 border border-gray-800 dark:border-white/10 text-white px-4 py-2 rounded-full text-[13px] font-semibold hover:bg-primary hover:border-primary transition-all duration-300"
              >
                <Github className="size-4" />
                Login with GitHub
              </button>
            </form>
          )}
        </div>

        {/* Mobile: Theme + Hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          <ThemeToggle />
          <MobileMenu session={session} />
        </div>

      </nav>
    </header>
  );
};

export default Navbar;