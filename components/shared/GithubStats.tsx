import { Star, GitFork, CircleDot, Github, ExternalLink } from "lucide-react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GitHubData {
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    description: string | null;
    language: string | null;
    license: { spdx_id: string } | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCount = (count: number): string => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
};

const parseGithubUrl = (url: string) => {
    const match = url.match(/github\.com\/([^/]+)\/([^/?#]+)/);
    if (!match) return null;
    return { owner: match[1], repo: match[2] };
};

// ─── Stat Item ────────────────────────────────────────────────────────────────

const StatItem = ({
    icon,
    value,
    label,
}: {
    icon: React.ReactNode;
    value: number;
    label: string;
}) => (
    <div className="flex flex-col items-center justify-center">
        <div className="flex items-center gap-1.5 text-black dark:text-white">
            {icon}
            <span className="text-16-bold">{formatCount(value)}</span>
        </div>
        <span className="text-12-medium text-black/40 dark:text-white/40 uppercase tracking-wider mt-1">
            {label}
        </span>
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const GithubStats = async ({ githubLink }: { githubLink: string }) => {
    if (!githubLink) return null;

    const parsed = parseGithubUrl(githubLink);
    if (!parsed) return null;

    const { owner, repo } = parsed;

    try {
        const res = await fetch(
            `https://api.github.com/repos/${owner}/${repo}`,
            {
                next: { revalidate: 3600 },
                headers: {
                    Accept: "application/vnd.github.v3+json",
                    // Add token if available to avoid rate limiting
                    ...(process.env.GITHUB_TOKEN && {
                        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    }),
                },
            }
        );

        if (!res.ok) return null;

        const data: GitHubData = await res.json();

        return (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-5 mt-5 pt-5 border-t border-black/5 dark:border-white/10">

                {/* Stats */}
                <div className="flex gap-6 items-center">
                    <StatItem
                        icon={<Star className="size-5 text-yellow-500 fill-yellow-500" />}
                        value={data.stargazers_count}
                        label="Stars"
                    />

                    <div className="w-px h-8 bg-black/10 dark:bg-white/10" />

                    <StatItem
                        icon={<GitFork className="size-5 text-primary" />}
                        value={data.forks_count}
                        label="Forks"
                    />

                    <div className="w-px h-8 bg-black/10 dark:bg-white/10" />

                    <StatItem
                        icon={<CircleDot className="size-5 text-green-500" />}
                        value={data.open_issues_count}
                        label="Issues"
                    />

                    {/* Language badge لو موجودة */}
                    {data.language && (
                        <>
                            <div className="w-px h-8 bg-black/10 dark:bg-white/10" />
                            <div className="flex flex-col items-center justify-center">
                                <span className="text-16-bold text-black dark:text-white">
                                    {data.language}
                                </span>
                                <span className="text-12-medium text-black/40 dark:text-white/40 uppercase tracking-wider mt-1">
                                    Language
                                </span>
                            </div>
                        </>
                    )}
                </div>

                {/* CTA */}
                <Link
                    href={githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${repo} on GitHub`}
                    className="flex items-center gap-2 bg-gray-900 dark:bg-white/10 text-white px-5 py-2.5 rounded-full hover:bg-primary transition-all duration-300 text-[14px] font-medium hover:-translate-y-0.5 w-full sm:w-auto justify-center"
                >
                    <Github className="size-4" aria-hidden="true" />
                    <span>View on GitHub</span>
                    <ExternalLink className="size-3.5 opacity-70" aria-hidden="true" />
                </Link>

            </div>
        );
    } catch (error) {
        console.error("[GithubStats]", error);
        return null;
    }
};

export default GithubStats;