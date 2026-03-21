import { client } from "@/sanity/lib/client";
import { PROJECT_VIEWS_QUERY } from "@/sanity/lib/queries";
import { Eye } from "lucide-react";
import { getTranslations } from "next-intl/server";
import ViewTracker from "./ViewTracker";

const View = async ({ id }: { id: string }) => {
  const result = await client
    .withConfig({ useCdn: false })
    .fetch(PROJECT_VIEWS_QUERY, { id });

  if (!result) return null;

  const totalViews: number = result.views ?? 0;
  const t = await getTranslations("project_components");

  return (
    <div
      className="flex gap-2 items-center text-primary"
      aria-label={`${totalViews} views`}
    >
      <ViewTracker id={id} />
      <Eye className="size-5" aria-hidden="true" />
      <span className="text-[18px] font-semibold">
        {totalViews} {totalViews === 1 ? t("view_singular") : t("view_plural")}
      </span>
    </div>
  );
};

export default View;