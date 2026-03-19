import Link from "next/link";
import { Github, Linkedin, Twitter, ArrowRight, Heart, Layers } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { client } from "@/sanity/lib/client";

const FOOTER_DOMAINS_QUERY = `*[_type == "domain"] | order(name asc)[0...5] { _id, name }`;

const Footer = async () => {
    const currentYear = new Date().getFullYear();
    const t = await getTranslations("footer");

    const domains: { _id: string; name: string }[] = await client.fetch(FOOTER_DOMAINS_QUERY);

    const platformLinks = [
        { href: "/projects", label: t("link_explore") },
        { href: "/leaderboard", label: t("link_leaderboard") },
        { href: "/developers", label: t("link_developers") },
    ];

    const resourceLinks = [
        { href: "/blog", prefetch: true, label: t("link_blog") },
        { href: "/docs", prefetch: true, label: t("link_docs") },
        { href: "/open-source", prefetch: true, label: t("link_opensource") },
    ];

    const legalLinks = [
        { href: "/about", prefetch: true, label: t("link_about") },
        { href: "/privacy", prefetch: true, label: t("link_privacy") },
        { href: "/terms", prefetch: true, label: t("link_terms") },
        { href: "/cookies", prefetch: true, label: t("link_cookies") },
    ];

    const domainLinks = domains.map((domain) => ({
        href: `/projects?domain=${domain._id}`,
        label: domain.name,
    }));

    const socialLinks = [
        { href: "https://github.com/Ali-Haggag7", label: "GitHub", icon: Github },
        { href: "https://linkedin.com/in/ali-haggag", label: "LinkedIn", icon: Linkedin },
        { href: "https://twitter.com", label: "Twitter", icon: Twitter },
    ];

    return (
        <footer className="relative bg-white dark:bg-[#0a0a0c] pt-16 pb-8 border-t border-slate-200 dark:border-white/[0.06] mt-20 font-work-sans transition-colors duration-300 overflow-hidden">

            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 dark:via-primary/30 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8 mb-16">

                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-6 w-fit group" aria-label="CS Arena Home">
                            <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300">
                                <span className="text-primary font-black text-sm">CS</span>
                            </div>
                            <span className="text-[18px] font-black text-black dark:text-white tracking-tight">Arena</span>
                        </Link>

                        <p className="text-[14px] text-slate-500 dark:text-white/40 max-w-sm leading-relaxed mb-6">
                            {t("description")}
                        </p>

                        <ul className="flex gap-3" aria-label="Social media links">
                            {socialLinks.map(({ href, label, icon: Icon }) => (
                                <li key={label}>
                                    <Link
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                        className="size-9 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/[0.06] rounded-full flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-primary/10 dark:hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 group/social"
                                    >
                                        <Icon className="size-4 text-slate-500 dark:text-white/40 group-hover/social:text-white dark:group-hover/social:text-primary transition-colors" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <FooterColumn title={t("platform_title")} links={platformLinks} />

                    {domainLinks.length > 0 && (
                        <FooterColumn
                            title={t("domains_title") || "Top Domains"}
                            links={domainLinks}
                            icon={Layers}
                        />
                    )}

                    <FooterColumn title={t("resources_title")} links={resourceLinks} />
                    <FooterColumn title={t("legal_title")} links={legalLinks} />
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/[0.06] to-transparent mb-8" />

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] text-slate-500 dark:text-white/40">
                    <p>{t("copyright", { year: currentYear })}</p>
                    <div className="flex items-center gap-1.5 font-medium">
                        <span>{t("built_with")}</span>
                        <span className="text-black dark:text-white font-bold ml-0.5">{t("egypt")}</span>
                        <Heart className="size-4 text-red-500 fill-red-500 animate-pulse ml-0.5" />
                    </div>
                </div>

            </div>
        </footer>
    );
};

const FooterColumn = ({
    title,
    links,
    icon: Icon,
}: {
    title: string;
    links: { href: string; label: string; prefetch?: boolean }[];
    icon?: React.ElementType;
}) => (
    <div>
        <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h3 className="text-[13px] font-bold text-black dark:text-white uppercase tracking-widest flex items-center gap-2">
                {Icon && <Icon className="size-4 text-primary/70" />}
                {title}
            </h3>
        </div>
        <ul className="flex flex-col gap-3">
            {links.map(({ href, label, prefetch }) => (
                <li key={label}>
                    <Link
                        href={href}
                        prefetch={prefetch}
                        className="text-[14px] text-slate-500 dark:text-white/40 hover:text-primary dark:hover:text-primary transition-all duration-300 flex items-center gap-2 group"
                    >
                        <ArrowRight className="size-3 opacity-0 rtl:rotate-180 -ms-5 group-hover:opacity-100 group-hover:ms-0 transition-all duration-300" />
                        <span className="truncate max-w-[150px] inline-block">{label}</span>
                    </Link>
                </li>
            ))}
        </ul>
    </div>
);

export default Footer;