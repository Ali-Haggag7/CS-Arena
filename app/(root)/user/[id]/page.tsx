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
import ShareProfileButton from "@/components/shared/ShareProfileButton";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id });
  if (!user) return {};

  const t = await getTranslations("profile");

  return {
    title: `${user.name} | CS-Arena`,
    description: user.bio ?? t("seo_desc_fallback", { name: user.name }),
    openGraph: {
      title: `${user.name} on CS-Arena`,
      images: user.image ? [{ url: user.image }] : [],
    },
  };
}

async function ProfileContent({ id }: { id: string }) {
  const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id });
  const session = await auth();

  if (!user) return notFound();

  const t = await getTranslations("profile");
  const isOwnProfile = session?.id === id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="flex flex-col lg:flex-row gap-10">
        <aside className="w-full lg:w-[340px] shrink-0">
          <div className="bg-white dark:bg-[#111115] rounded-[2rem] p-8 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-2xl flex flex-col items-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/10 to-transparent opacity-50 pointer-events-none" />

            <div className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 mb-8 text-center backdrop-blur-sm z-10">
              <h1 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest line-clamp-1">
                {user.name}
              </h1>
            </div>

            <div className="relative mb-6 z-10">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-md group-hover:bg-primary/40 transition-colors duration-500" />
              <Image
                src={user.image || "https://placehold.co/160x160"}
                alt={user.name ?? "User avatar"}
                width={140} height={140}
                className="relative rounded-full ring-4 ring-white dark:ring-[#111115] object-cover bg-slate-100 dark:bg-black"
                priority
              />
            </div>

            <h2 className="text-2xl font-extrabold text-black dark:text-white text-center mb-3 z-10">
              @{user.username}
            </h2>

            <p className="text-center text-sm text-slate-500 dark:text-white/50 leading-relaxed max-w-[240px] mb-8 z-10">
              {user.bio || t("default_bio")}
            </p>

            <div className="w-full flex flex-col items-center gap-4 z-10 border-t border-slate-100 dark:border-white/5 pt-6 mt-auto">
              <ShareProfileButton />

              {user.username && (
                <Link
                  href={`https://github.com/${user.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${user.name}'s GitHub profile`}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors duration-200 group/github"
                >
                  <Github className="size-4 group-hover/github:text-black dark:group-hover/github:text-white transition-colors" aria-hidden="true" />
                  <span>{t("btn_github")}</span>
                </Link>
              )}
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
          <p className="text-[24px] font-bold text-black dark:text-white">
            {isOwnProfile ? t("title_own_projects") : t("title_other_projects", { name: user.name })}
          </p>

          <ul className="card_grid-sm">
            <Suspense
              fallback={
                <div className="card_grid-sm w-full">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-[300px] w-full rounded-2xl bg-black/5 dark:bg-white/5" />
                  ))}
                </div>
              }
            >
              <UserProjects id={id} />
            </Suspense>
          </ul>
        </div>
      </div>
    </div>
  );
}

const ProfileSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div className="flex flex-col lg:flex-row gap-10">
      <aside className="w-full lg:w-[340px] shrink-0">
        <div className="bg-white dark:bg-[#111115] rounded-[2rem] p-8 border border-slate-200 dark:border-white/10 shadow-sm flex flex-col items-center">
          <Skeleton className="w-full h-12 rounded-xl mb-8" />
          <Skeleton className="size-[140px] rounded-full mb-6" />
          <Skeleton className="h-8 w-3/4 mb-3 rounded-lg" />
          <Skeleton className="h-16 w-full mb-8 rounded-lg" />
          <div className="w-full border-t border-slate-100 dark:border-white/5 pt-6 mt-auto flex flex-col items-center gap-4">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-6 w-24 rounded-lg" />
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <div className="card_grid-sm w-full">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[300px] w-full rounded-2xl bg-black/5 dark:bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default async function UserProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0d0d0f] font-work-sans pt-24 pb-24 transition-colors duration-300 relative selection:bg-primary/30">
      <div className="absolute inset-0 grid-bg opacity-30 dark:opacity-40 pointer-events-none" aria-hidden="true" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-20 dark:opacity-10 blur-[100px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #3b82f6 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileContent id={id} />
      </Suspense>
    </main>
  );
}