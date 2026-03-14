import { client } from "@/sanity/lib/client";
import { PROJECT_VIEWS_QUERY } from "@/sanity/lib/queries";
import { writeClient } from "@/sanity/lib/write-client";
import { unstable_after as after } from "next/server";
import { Eye } from "lucide-react";

const View = async ({ id }: { id: string }) => {
  // Fetch only the views to keep it lightweight
  const { views: totalViews } = await client
    .withConfig({ useCdn: false }) // ensure fresh data
    .fetch(PROJECT_VIEWS_QUERY, { id });

  // Update the view count in the background using Next.js 'after'
  after(
    async () =>
      await writeClient
        .patch(id)
        .set({ views: totalViews + 1 })
        .commit()
  );

  return (
    <div className="flex gap-2 items-center text-primary">
      <Eye className="size-6" />
      <span className="text-20-medium">{totalViews} Views</span>
    </div>
  );
};

export default View;