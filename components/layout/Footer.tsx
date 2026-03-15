import Link from "next/link";
import { Github, Linkedin, Twitter, Code2 } from "lucide-react";

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
        {
            href: "https://github.com/Ali-Haggag7",
            label: "GitHub",
            icon: Github,
            hover: "hover:bg-primary",
        },
        {
            href: "https://linkedin.com/in/ali-haggag",
            label: "LinkedIn",
            icon: Linkedin,
            hover: "hover:bg-blue-500",
        },
        {
            href: "https://twitter.com",
            label: "Twitter",
            icon: Twitter,
            hover: "hover:bg-sky-400",
        },
    ];

    return (
        <footer className="bg-[#0a0a0a] dark:bg-[#050505] text-white pt-16 pb-8 border-t border-white/5 mt-20 font-work-sans">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">

                {/* Top Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">

                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <Link
                            href="/"
                            className="flex items-center gap-2 mb-6 w-fit"
                            aria-label="CS Arena Home"
                        >
                            <Code2 className="size-8 text-primary" />
                            <span className="text-24-black text-white tracking-wide">
                                CS-ARENA
                            </span>
                        </Link>

                        <p className=" text-gray-400 max-w-sm leading-relaxed mb-6">
                            The ultimate platform for Computer Science students to showcase
                            their code, find open-source contributors, and get headhunted by
                            top tech recruiters.
                        </p>

                        {/* Social Links */}
                        <ul className="flex gap-3" aria-label="Social media links">
                            {socialLinks.map(({ href, label, icon: Icon, hover }) => (
                                <li key={label}>
                                    <Link
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                        className={`p-2 bg-white/5 rounded-full ${hover} transition-all duration-300 hover:-translate-y-1 flex items-center justify-center`}
                                    >
                                        <Icon className="size-5 text-white" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Platform Links */}
                    <FooterColumn title="Platform" links={platformLinks} />

                    {/* Resources Links */}
                    <FooterColumn title="Resources" links={resourceLinks} />

                    {/* Legal Links */}
                    <FooterColumn title="Legal" links={legalLinks} />
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-8" />

                {/* Bottom */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500">
                    <p>© {currentYear} CS-Arena. All rights reserved.</p>
                    <div className="flex items-center gap-2">
                        <span>Built with passion in Egypt</span>
                        <span
                            className="text-primary animate-pulse"
                            role="img"
                            aria-label="love"
                        >
                            ❤️
                        </span>
                    </div>
                </div>

            </div>
        </footer>
    );
};

// Helper Component for Footer Columns
const FooterColumn = ({
    title,
    links,
}: {
    title: string;
    links: { href: string; label: string }[];
}) => (
    <div>
        <h3 className="text-16-semibold text-white mb-5 uppercase tracking-wider">
            {title}
        </h3>
        <ul className="flex flex-col gap-3">
            {links.map(({ href, label }) => (
                <li key={label}>
                    <Link
                        href={href}
                        className="text-gray-400 hover:text-primary transition-colors duration-200"
                    >
                        {label}
                    </Link>
                </li>
            ))}
        </ul>
    </div>
);

export default Footer;