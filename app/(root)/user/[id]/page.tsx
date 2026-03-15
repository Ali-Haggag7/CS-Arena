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

// ─── Metadata ─────────────────────────────────────────────────────────────────

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

// ─── Page ─────────────────────────────────────────────────────────────────────

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
    <section className="profile_container">

      {/* Profile Card */}
      <div className="profile_card">
        <div className="profile_title">
          <h3 className="text-24-black uppercase text-center line-clamp-1">
            {user.name}
          </h3>
        </div>

        <Image
          src={user.image || "https://placehold.co/220x220"}
          alt={user.name ?? "User avatar"}
          width={220}
          height={220}
          className="profile_image"
          priority
        />

        <p className="text-30-extrabold mt-7 text-center">
          @{user.username}
        </p>

        <p className="mt-1 text-center text-14-normal text-black/60 dark:text-white/60">
          {user.bio || "Passionate developer crafting awesome projects."}
        </p>

        {/* Own profile badge */}
        {isOwnProfile && (
          <span className="mt-4 px-4 py-1.5 bg-primary/10 text-primary text-12-medium rounded-full">
            Your Profile
          </span>
        )}

        {/* GitHub link */}
        {user.username && (
          <Link
            href={`https://github.com/${user.username}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${user.name}'s GitHub profile`}
            className="mt-4 flex items-center gap-2 text-14-medium text-black/50 dark:text-white/50 hover:text-primary transition-colors duration-200"
          >
            <Github className="size-4" aria-hidden="true" />
            <span>@{user.username}</span>
          </Link>
        )}
      </div>

      {/* Projects Section */}
      <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
        <p className="text-30-bold">
          {isOwnProfile ? "Your Projects" : `${user.name}'s Projects`}
        </p>

        <ul className="card_grid-sm">
          <Suspense
            fallback={
              <div className="card_grid-sm w-full">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 w-full rounded-xl" />
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