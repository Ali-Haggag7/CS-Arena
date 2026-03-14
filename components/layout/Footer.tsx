import Link from "next/link";
import { Github, Linkedin, Twitter, Mail, Code2 } from "lucide-react";

/**
 * Global Masterclass Footer
 * Designed for scalability, SEO links structure, and premium UX.
 */
const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#0a0a0a] text-white pt-16 pb-8 border-t border-black-100/20 mt-20 font-work-sans">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">

                {/* Top Section: Grid Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">

                    {/* Brand Column (Spans 2 columns on large screens) */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <Code2 className="size-8 text-primary" />
                            <span className="text-24-black text-white tracking-wide">CS-ARENA</span>
                        </Link>
                        <p className="text-14-normal text-gray-400 max-w-sm leading-relaxed mb-6">
                            The ultimate platform for Computer Science students to showcase their code,
                            find open-source contributors, and get headhunted by top tech recruiters.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-4">
                            <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-primary transition-all duration-300 hover:-translate-y-1">
                                <Github className="size-5 text-white" />
                            </Link>
                            <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-blue-500 transition-all duration-300 hover:-translate-y-1">
                                <Linkedin className="size-5 text-white" />
                            </Link>
                            <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-sky-400 transition-all duration-300 hover:-translate-y-1">
                                <Twitter className="size-5 text-white" />
                            </Link>
                        </div>
                    </div>

                    {/* Platform Column */}
                    <div>
                        <h3 className="text-16-semibold text-white mb-5 uppercase tracking-wider">Platform</h3>
                        <ul className="flex flex-col gap-3 text-14-normal text-gray-400">
                            <li><Link href="/projects" className="hover:text-primary transition-colors">Explore Projects</Link></li>
                            <li><Link href="/leaderboard" className="hover:text-primary transition-colors">Leaderboard</Link></li>
                            <li><Link href="/developers" className="hover:text-primary transition-colors">Find Developers</Link></li>
                        </ul>
                    </div>

                    {/* Resources Column */}
                    <div>
                        <h3 className="text-16-semibold text-white mb-5 uppercase tracking-wider">Resources</h3>
                        <ul className="flex flex-col gap-3 text-14-normal text-gray-400">
                            <li><Link href="/coming-soon" className="hover:text-primary transition-colors">Blog</Link></li>
                            <li><Link href="/coming-soon" className="hover:text-primary transition-colors">Documentation</Link></li>
                            <li><Link href="/open-source" className="hover:text-primary transition-colors">Open Source</Link></li>
                        </ul>
                    </div>

                    {/* Legal Column */}
                    <div>
                        <h3 className="text-16-semibold text-white mb-5 uppercase tracking-wider">Legal</h3>
                        <ul className="flex flex-col gap-3 text-14-normal text-gray-400">
                            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>

                </div>

                {/* Divider */}
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-8" />

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-14-normal text-gray-500">
                    <p>© {currentYear} CS-Arena. All rights reserved.</p>
                    <div className="flex items-center gap-2">
                        <span>Built with passion in Egypt</span>
                        <span className="text-primary animate-pulse">❤️</span>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;