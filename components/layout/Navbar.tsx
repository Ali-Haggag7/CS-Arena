import Link from "next/link";
import Image from "next/image";
import { auth, signOut, signIn } from "@/auth";
import { BadgePlus, LogOut, Github } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";
import ThemeToggle from "@/components/shared/ThemeToggle";

const Navbar = async () => {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0d0d0f]/80 backdrop-blur-xl border-b border-black/5 dark:border-white/[0.06] font-work-sans transition-all duration-300">
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3.5">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80 duration-300"
          aria-label="CS Arena Home"
        >
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <span className="text-primary font-black text-sm">CS</span>
            </div>
            <span className="font-black text-[18px] text-black dark:text-white tracking-tight">
              Arena
            </span>
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">

          <ThemeToggle />

          {session?.user ? (
            <>
              {/* Create Project */}
              <Link
                href="/project/create"
                className="flex items-center gap-2 text-[13px] font-semibold bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-600 hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300"
                aria-label="Create new project"
              >
                <span className="max-sm:hidden">Create Project</span>
                <BadgePlus className="size-4" />
              </Link>

              {/* Logout */}
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="flex items-center gap-2 text-[13px] font-medium text-black/50 dark:text-white/40 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-300 px-2"
                  aria-label="Logout"
                >
                  <span className="max-sm:hidden">Logout</span>
                  <LogOut className="size-4 sm:hidden" />
                </button>
              </form>

              {/* Avatar */}
              <Link
                href={`/user/${session?.id}`}
                className="group"
                aria-label={`${session?.user?.name}'s profile`}
              >
                <Avatar className="size-9 ring-1 ring-white/10 group-hover:ring-primary/50 group-hover:ring-offset-1 dark:group-hover:ring-offset-[#0d0d0f] transition-all duration-300">
                  <AvatarImage
                    src={session?.user?.image ?? ""}
                    alt={session?.user?.name ?? "User avatar"}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                    {session?.user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("github");
              }}
            >
              <button
                type="submit"
                className="flex items-center gap-2 glass border border-white/10 text-white px-5 py-2 rounded-full text-[13px] font-semibold hover:border-primary/40 hover:bg-primary/10 transition-all duration-300"
                aria-label="Login with GitHub"
              >
                <Github className="size-4" />
                <span>Login with GitHub</span>
              </button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;