import React, { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import UserProjects from "@/components/project/UserProjects";
import { Skeleton } from "@/components/shadcn/skeleton";

export const experimental_ppr = true;

/**
 * User Profile Page
 * Displays user details and a suspense-wrapped grid of their projects.
 */
const UserProfile = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id });

  if (!user) return notFound();

  return (
    <section className="profile_container">
      {/* User Information Card */}
      <div className="profile_card">
        <div className="profile_title">
          <h3 className="text-24-black uppercase text-center line-clamp-1">
            {user.name}
          </h3>
        </div>

        <Image
          src={user.image || "https://placehold.co/220x220"}
          alt={user.name}
          width={220}
          height={220}
          className="profile_image"
        />

        <p className="text-30-extrabold mt-7 text-center">
          @{user?.username}
        </p>
        <p className="mt-1 text-center text-14-normal">
          {user?.bio || "Passionate Developer crafting awesome projects."}
        </p>
      </div>

      {/* User's Projects Section */}
      <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
        <p className="text-30-bold">
          {user.name}&apos;s Projects
        </p>
        <ul className="card_grid-sm">
          {/* Suspense allows the UI to load instantly while projects fetch in the background */}
          <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
            <UserProjects id={id} />
          </Suspense>
        </ul>
      </div>
    </section>
  );
};

export default UserProfile;