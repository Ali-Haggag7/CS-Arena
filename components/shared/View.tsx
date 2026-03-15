import { client } from "@/sanity/lib/client";
import { PROJECT_VIEWS_QUERY } from "@/sanity/lib/queries";
import { writeClient } from "@/sanity/lib/write-client";
import { after } from "next/server";
import { Eye } from "lucide-react";
import { cookies } from "next/headers";

const View = async ({ id }: { id: string }) => {
  const result = await client
    .withConfig({ useCdn: false })
    .fetch(PROJECT_VIEWS_QUERY, { id });

  if (!result) return null;

  const totalViews: number = result.views ?? 0;

  // Check if already viewed in this session
  const cookieStore = await cookies();
  const viewedKey = `viewed_${id}`;
  const alreadyViewed = cookieStore.get(viewedKey);

  after(async () => {
    if (!alreadyViewed) {
      // Set cookie for 1 hour
      const cookieStore = await cookies();
      cookieStore.set(viewedKey, "true", { maxAge: 3600 });

      await writeClient
        .patch(id)
        .setIfMissing({ views: 0 })
        .inc({ views: 1 })
        .commit();
    }
  });

  return (
    <div
      className="flex gap-2 items-center text-primary"
      aria-label={`${totalViews} views`}
    >
      <Eye className="size-5" aria-hidden="true" />
      <span className="text-[18px] font-semibold">
        {totalViews} {totalViews === 1 ? "View" : "Views"}
      </span>
    </div>
  );
};

export default View;