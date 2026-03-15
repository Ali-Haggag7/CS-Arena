import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const platformLinks = [
        { href: "/projects", label: "Explore Projects" },
        { href: "/leaderboard", label: "Leaderboard" },
        { href: "/developers", label: "Find Developers" },
    ];

    const resourceLinks = [
        { href: "/coming-soon", label: "Blog" },
        { href: "/coming-soon", label: "Documentation" },
        { href: "/open-source", label: "Open Source" },
    ];

    const legalLinks = [
        { href: "/about", label: "About Us" },
        { href: "/privacy", label: "Privacy Policy" },
        { href: "/terms", label: "Terms of Service" },
        { href: "/cookies", label: "Cookie Policy" },
    ];

    const socialLinks = [
        { href: "https://github.com/Ali-Haggag7", label: "GitHub", icon: Github },
        { href: "https://linkedin.com/in/ali-haggag", label: "LinkedIn", icon: Linkedin },
        { href: "https://twitter.com", label: "Twitter", icon: Twitter },
    ];

    return (
        <footer className="bg-[#080809] text-white pt-16 pb-8 border-t border-white/[0.06] mt-20 font-work-sans">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">

                {/* Top Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">

                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-6 w-fit group" aria-label="CS Arena Home">
                            <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <span className="text-primary font-black text-sm">CS</span>
                            </div>
                            <span className="text-[18px] font-black text-white tracking-tight">Arena</span>
                        </Link>

                        <p className="text-[14px] text-white/30 max-w-sm leading-relaxed mb-6">
                            The ultimate platform for Computer Science students to showcase
                            their code, find open-source contributors, and get headhunted by
                            top tech recruiters.
                        </p>

                        <ul className="flex gap-2" aria-label="Social media links">
                            {socialLinks.map(({ href, label, icon: Icon }) => (
                                <li key={label}>
                                    <Link
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                        className="size-9 bg-white/5 border border-white/[0.06] rounded-full flex items-center justify-center hover:bg-primary/10 hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300"
                                    >
                                        <Icon className="size-4 text-white/30 hover:text-primary transition-colors" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <FooterColumn title="Platform" links={platformLinks} />
                    <FooterColumn title="Resources" links={resourceLinks} />
                    <FooterColumn title="Legal" links={legalLinks} />
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-8" />

                {/* Bottom */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] text-white/20">
                    <p>© {currentYear} CS-Arena. All rights reserved.</p>
                    <div className="flex items-center gap-1.5">
                        <span>Built with passion in Egypt</span>
                        <span className="text-primary animate-pulse" role="img" aria-label="love">❤️</span>
                    </div>
                </div>

            </div>
        </footer>
    );
};

const FooterColumn = ({
    title,
    links,
}: {
    title: string;
    links: { href: string; label: string }[];
}) => (
    <div>
        {/* Title and accent line */}
        <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h3 className="text-[12px] font-bold text-white uppercase tracking-widest">
                {title}
            </h3>
        </div>
        <ul className="flex flex-col gap-3">
            {links.map(({ href, label }) => (
                <li key={label}>
                    <Link
                        href={href}
                        className="text-[14px] text-white/30 hover:text-primary transition-colors duration-200 flex items-center gap-1.5 group"
                    >
                        <span className="w-0 group-hover:w-2 h-px bg-primary transition-all duration-200 overflow-hidden" />
                        {label}
                    </Link>
                </li>
            ))}
        </ul>
    </div>
);

export default Footer;