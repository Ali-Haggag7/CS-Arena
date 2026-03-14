import { Star, GitFork, CircleDot, Github, ExternalLink } from "lucide-react";
import Link from "next/link";

/**
 * GithubStats Component
 * Fetches live data from GitHub API and displays it alongside a CTA button.
 */
const GithubStats = async ({ githubLink }: { githubLink: string }) => {
    if (!githubLink) return null;

    const match = githubLink.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) return null;

    const owner = match[1];
    const repo = match[2].replace(/\/$/, "");

    try {
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
            next: { revalidate: 3600 },
        });

        if (!res.ok) return null;
        const data = await res.json();

        return (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-5 mt-5 pt-5 border-t border-black-100/10">

                {/* Live Stats Section */}
                <div className="flex gap-6 items-center">
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center gap-1.5 text-black-300">
                            <Star className="size-5 text-yellow-500 fill-yellow-500" />
                            <span className="text-16-bold">{data.stargazers_count}</span>
                        </div>
                        <span className="text-12-medium text-black-100 uppercase tracking-wider mt-1">Stars</span>
                    </div>

                    <div className="w-[1px] h-8 bg-black-100/20" /> {/* Divider */}

                    <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center gap-1.5 text-black-300">
                            <GitFork className="size-5 text-primary" />
                            <span className="text-16-bold">{data.forks_count}</span>
                        </div>
                        <span className="text-12-medium text-black-100 uppercase tracking-wider mt-1">Forks</span>
                    </div>

                    <div className="w-[1px] h-8 bg-black-100/20" /> {/* Divider */}

                    <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center gap-1.5 text-black-300">
                            <CircleDot className="size-5 text-green-500" />
                            <span className="text-16-bold">{data.open_issues_count}</span>
                        </div>
                        <span className="text-12-medium text-black-100 uppercase tracking-wider mt-1">Issues</span>
                    </div>
                </div>

                {/* Masterclass CTA Button */}
                <Link
                    href={githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#24292e] !text-white px-6 py-3 rounded-full hover:bg-primary transition-all duration-300 text-16-medium shadow-md hover:shadow-xl hover:-translate-y-1 w-full sm:w-auto justify-center"
                >
                    <Github className="size-5" />
                    <span>View on GitHub</span>
                    <ExternalLink className="size-4 opacity-70" />
                </Link>

            </div>
        );
    } catch (error) {
        console.error("Failed to fetch GitHub stats:", error);
        return null;
    }
};

export default GithubStats;