import { client } from "@/sanity/lib/client";
import { PROJECT_VIEWS_QUERY } from "@/sanity/lib/queries";
import { writeClient } from "@/sanity/lib/write-client";
import { after } from "next/server";
import { Eye } from "lucide-react";
import { getTranslations } from "next-intl/server";

const View = async ({ id }: { id: string }) => {
  const result = await client
    .withConfig({ useCdn: false })
    .fetch(PROJECT_VIEWS_QUERY, { id });

  if (!result) return null;

  const totalViews: number = result.views ?? 0;
  const t = await getTranslations("project_components");

  after(async () => {
    try {
      await writeClient
        .patch(id)
        .setIfMissing({ views: 0 })
        .inc({ views: 1 })
        .commit();
    } catch (error) {
      console.error("Failed to increment views:", error);
    }
  });

  return (
    <div
      className="flex gap-2 items-center text-primary"
      aria-label={`${totalViews} views`}
    >
      <Eye className="size-5" aria-hidden="true" />
      <span className="text-[18px] font-semibold">
        {totalViews} {totalViews === 1 ? t("view_singular") : t("view_plural")}
      </span>
    </div>
  );
};

export default View;