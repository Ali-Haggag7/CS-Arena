import Link from "next/link";
import Image from "next/image";
import { auth, signOut, signIn } from "@/auth";
import { BadgePlus, LogOut, Github } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";

/**
 * Masterclass Navbar
 * Features a sticky glassmorphism header, smooth transitions, and proper authentication state handling.
 */
const Navbar = async () => {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black-100/5 font-work-sans transition-all duration-300">
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        {/* Logo Section */}
        <Link href="/" className="transition-transform hover:scale-105 duration-300">
          <Image src="/logo.png" alt="CS-Arena Logo" width={144} height={30} priority />
        </Link>

        {/* Actions Section */}
        <div className="flex items-center gap-6 text-black-300">
          {session && session?.user ? (
            <>
              {/* Create Project Button (Primary Action) */}
              <Link
                href="/project/create"
                className="flex items-center gap-2 text-14-bold bg-primary text-white px-5 py-2.5 rounded-full hover:bg-black-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <span className="max-sm:hidden">Create Project</span>
                <BadgePlus className="size-5" />
              </Link>

              {/* Logout Button */}
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="flex items-center gap-2 text-14-medium text-black-200 hover:text-red-500 transition-colors duration-300"
                >
                  <span className="max-sm:hidden">Logout</span>
                  <LogOut className="size-5 sm:hidden" />
                </button>
              </form>

              {/* User Avatar with Hover Ring */}
              <Link href={`/user/${session?.id}`} className="group">
                <Avatar className="size-10 ring-2 ring-transparent group-hover:ring-primary group-hover:ring-offset-2 transition-all duration-300">
                  <AvatarImage
                    src={session?.user?.image || ""}
                    alt={session?.user?.name || ""}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {session?.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </>
          ) : (
            /* Logged Out State - Beautiful Login Button */
            <form
              action={async () => {
                "use server";
                await signIn("github");
              }}
            >
              <button
                type="submit"
                className="flex items-center flex-row gap-2 bg-black-300 text-white px-6 py-2.5 rounded-full text-16-bold hover:bg-primary hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
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