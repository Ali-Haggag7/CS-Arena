import Image from "next/image";
import Link from "next/link";
import { Users } from "lucide-react";
import { useTranslations } from "next-intl";

type Contributor = {
    _id: string;
    name: string;
    image: string;
    username: string;
};


export default function ContributorsSection({ contributors }: { contributors: Contributor[] }) {
    const t = useTranslations("project_details");
    if (!contributors || contributors.length === 0) return null;

    return (
        <div className="bg-white dark:bg-[#111115] rounded-2xl p-6 border border-slate-200 dark:border-white/10 shadow-sm mb-8">
            <h3 className="flex items-center gap-2 text-lg font-bold text-black dark:text-white mb-5">
                <Users className="size-5 text-primary" />
                {t("team_members")}
                <span className="ml-1 px-2 py-0.5 text-xs font-bold bg-primary/10 text-primary rounded-full">
                    {contributors.length}
                </span>
            </h3>

            <div className="flex flex-wrap gap-4">
                {contributors.map((contributor) => (
                    <Link
                        key={contributor._id}
                        href={`/user/${contributor._id}`}
                        className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 hover:border-primary/40 transition-all duration-200 group"
                    >
                        <Image
                            src={contributor.image || "https://placehold.co/40x40"}
                            alt={contributor.name}
                            width={36}
                            height={36}
                            className="rounded-full ring-2 ring-slate-100 dark:ring-white/10 group-hover:ring-primary/30 transition-all object-cover"
                        />
                        <div>
                            <p className="text-sm font-bold text-black dark:text-white group-hover:text-primary transition-colors">
                                {contributor.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-white/40">
                                @{contributor.username}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}