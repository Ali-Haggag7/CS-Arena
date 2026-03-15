import React, { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import type { Metadata } from "next";
import Image from "next/image";
import UserProjects from "@/components/project/UserProjects";
import { Skeleton } from "@/components/shadcn/skeleton";
import { Github } from "lucide-react";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id });
  if (!user) return {};
  return {
    title: user.name,
    description: user.bio ?? `${user.name}'s projects on CS Arena`,
    openGraph: {
      title: user.name,
      images: user.image ? [{ url: user.image }] : [],
    },
  };
}

const UserProfile = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id });
  const session = await auth();

  if (!user) return notFound();

  const isOwnProfile = session?.id === id;

  return (
    <section className="profile_container bg-gray-50 dark:bg-[#0d0d0f] min-h-screen">

      {/* Profile Card */}
      <div className="w-80 max-lg:w-full flex-shrink-0">
        <div className="glass-card rounded-3xl px-6 pb-8 pt-8 flex flex-col items-center border border-primary/10 relative">

          {/* Name Banner */}
          <div className="w-full glass border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 mb-6 text-center">
            <h3 className="text-[16px] font-black text-black dark:text-white uppercase tracking-wide line-clamp-1">
              {user.name}
            </h3>
          </div>

          <Image
            src={user.image || "https://placehold.co/160x160"}
            alt={user.name ?? "User avatar"}
            width={160} height={160}
            className="rounded-full ring-2 ring-primary/30 object-cover"
            priority
          />

          <p className="text-[22px] font-extrabold text-black dark:text-white mt-5 text-center">
            @{user.username}
          </p>

          <p className="mt-2 text-center text-[13px] text-black/50 dark:text-white/40 leading-relaxed max-w-[220px]">
            {user.bio || "Passionate developer crafting awesome projects."}
          </p>

          {isOwnProfile && (
            <span className="mt-4 px-4 py-1.5 bg-primary/10 text-primary text-[12px] font-medium rounded-full border border-primary/20">
              Your Profile
            </span>
          )}

          {user.username && (
            <Link
              href={`https://github.com/${user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${user.name}'s GitHub profile`}
              className="mt-4 flex items-center gap-2 text-[13px] font-medium text-black/30 dark:text-white/30 hover:text-primary transition-colors duration-200"
            >
              <Github className="size-4" aria-hidden="true" />
              <span>@{user.username}</span>
            </Link>
          )}
        </div>
      </div>

      {/* Projects Section */}
      <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
        <p className="text-[24px] font-bold text-black dark:text-white">
          {isOwnProfile ? "Your Projects" : `${user.name}'s Projects`}
        </p>

        <ul className="card_grid-sm">
          <Suspense
            fallback={
              <div className="card_grid-sm w-full">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 w-full rounded-xl bg-black/5 dark:bg-white/5" />
                ))}
              </div>
            }
          >
            <UserProjects id={id} />
          </Suspense>
        </ul>
      </div>
    </section>
  );
};

export default UserProfile;