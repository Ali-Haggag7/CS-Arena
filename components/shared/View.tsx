import { client } from "@/sanity/lib/client";
import { PROJECT_VIEWS_QUERY } from "@/sanity/lib/queries";
import { writeClient } from "@/sanity/lib/write-client";
import { after } from "next/server";
import { Eye } from "lucide-react";

const View = async ({ id }: { id: string }) => {
  const result = await client
    .withConfig({ useCdn: false })
    .fetch(PROJECT_VIEWS_QUERY, { id });

  // Return null if result is not found, to avoid rendering the view count for non-existent projects
  if (!result) return null;

  const totalViews: number = result.views ?? 0;

  // Increment in background after response is sent
  after(async () => {
    await writeClient
      .patch(id)
      .setIfMissing({ views: 0 })
      .inc({ views: 1 }) // ✅ atomic increment بدل set
      .commit();
  });

  return (
    <div
      className="flex gap-2 items-center text-primary"
      aria-label={`${totalViews} views`}
    >
      <Eye className="size-6" aria-hidden="true" />
      <span className="text-20-medium">
        {totalViews} {totalViews === 1 ? "View" : "Views"}
      </span>
    </div>
  );
};

export default View;