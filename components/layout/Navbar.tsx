import Link from "next/link";
import Image from "next/image";
import { auth, signOut, signIn } from "@/auth";
import { BadgePlus, LogOut, Github } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";
import ThemeToggle from "@/components/shared/ThemeToggle";

const Navbar = async () => {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-black/5 dark:border-white/5 font-work-sans transition-all duration-300">
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        {/* Logo */}
        <Link
          href="/"
          className="transition-transform hover:scale-105 duration-300"
          aria-label="CS Arena Home"
        >
          <Image
            src="/logo.png"
            alt="CS Arena"
            width={144}
            height={30}
            priority
          />
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-4 text-black dark:text-white">

          {/* Theme Toggle */}
          <ThemeToggle />

          {session?.user ? (
            <>
              {/* Create Project */}
              <Link
                href="/project/create"
                className="flex items-center gap-2 text-14-bold bg-primary text-white px-5 py-2.5 rounded-full hover:bg-black/80 dark:hover:bg-white dark:hover:text-black hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                aria-label="Create new project"
              >
                <span className="max-sm:hidden">Create Project</span>
                <BadgePlus className="size-5" />
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
                  className="flex items-center gap-2 text-14-medium text-black/70 dark:text-white/70 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-300"
                  aria-label="Logout"
                >
                  <span className="max-sm:hidden">Logout</span>
                  <LogOut className="size-5 sm:hidden" />
                </button>
              </form>

              {/* Avatar */}
              <Link
                href={`/user/${session?.id}`}
                className="group"
                aria-label={`${session?.user?.name}'s profile`}
              >
                <Avatar className="size-10 ring-2 ring-transparent group-hover:ring-primary group-hover:ring-offset-2 dark:group-hover:ring-offset-black transition-all duration-300">
                  <AvatarImage
                    src={session?.user?.image ?? ""}
                    alt={session?.user?.name ?? "User avatar"}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {session?.user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </>
          ) : (
            /* Login */
            <form
              action={async () => {
                "use server";
                await signIn("github");
              }}
            >
              <button
                type="submit"
                className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-full text-16-bold hover:bg-primary dark:hover:bg-primary dark:hover:text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                aria-label="Login with GitHub"
              >
                <Github className="size-5" />
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