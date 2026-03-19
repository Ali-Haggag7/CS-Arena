import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { LayoutDashboard, FolderKanban, Settings, Eye, ChevronUp, FolderCode, Activity } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import ManageProjects from "@/components/dashboard/ManageProjects";
import ProfileSettings from "@/components/dashboard/ProfileSettings";

export const metadata = {
    title: "Dashboard | CS-Arena",
    description: "Manage your CS-Arena profile and projects.",
};

const USER_DASHBOARD_QUERY = `*[_type == "project" && author._ref == $id] | order(_createdAt desc) {
  _id,
  title,
  views,
  upvotes,
  _createdAt,
  "domain": domain->name
}`;

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ tab?: string }>;
}) {
    const session = await auth();
    if (!session) redirect("/");

    const resolvedParams = await searchParams;
    const currentTab = resolvedParams.tab || "overview";
    const t = await getTranslations("dashboard");

    const projects = await client.fetch(USER_DASHBOARD_QUERY, { id: session.id });
    const userProfile = await client.fetch(`*[_type == "author" && _id == $id][0]`, { id: session.id });
    const universities = await client.fetch(`*[_type == "university"] | order(name asc) { _id, name }`);
    const domains = await client.fetch(`*[_type == "domain"] | order(name asc) { _id, name }`);

    const totalProjects = projects.length;
    const totalViews = projects.reduce((acc: number, proj: any) => acc + (proj.views || 0), 0);
    const totalUpvotes = projects.reduce((acc: number, proj: any) => acc + (proj.upvotes || 0), 0);

    const TABS = [
        { id: "overview", label: t("overview"), icon: LayoutDashboard },
        { id: "projects", label: t("projects"), icon: FolderKanban },
        { id: "settings", label: t("settings"), icon: Settings },
    ];

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-[#0d0d0f] font-work-sans pt-8 pb-24 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                        <LayoutDashboard className="size-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white">
                            {t("title")}
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-white/40 mt-1 font-medium">
                            Welcome back, {session.user?.name}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">

                    <aside className="w-full md:w-64 shrink-0 bg-white dark:bg-[#111115] p-2 md:p-4 rounded-[1.25rem] md:rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm relative z-20">
                        <div className="flex flex-row md:flex-col gap-1.5 md:gap-2">
                            {TABS.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = currentTab === tab.id;
                                return (
                                    <Link
                                        key={tab.id}
                                        href={`/dashboard?tab=${tab.id}`}
                                        className={`flex-1 md:flex-none flex flex-col md:flex-row items-center justify-center md:justify-start gap-1.5 md:gap-3 py-2.5 px-1 md:px-4 md:py-3 rounded-xl font-bold transition-all duration-300 ${isActive
                                            ? "bg-primary text-white shadow-md shadow-primary/20"
                                            : "text-slate-500 dark:text-white/50 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"
                                            }`}
                                    >
                                        <Icon className="size-5 md:size-4.5 shrink-0" />
                                        <span className="text-[10px] sm:text-xs md:text-sm text-center md:text-start leading-tight">
                                            {tab.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </aside>

                    <div className="flex-1 w-full min-w-0">

                        {currentTab === "overview" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                                    <div className="bg-white dark:bg-[#111115] p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-blue-500/20" />
                                        <div className="flex items-center gap-4 mb-4 relative z-10">
                                            <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                                                <FolderCode className="size-5" />
                                            </div>
                                            <h3 className="text-sm font-bold text-slate-500 dark:text-white/50">{t("total_projects")}</h3>
                                        </div>
                                        <p className="text-4xl font-black text-black dark:text-white relative z-10">{totalProjects}</p>
                                    </div>

                                    <div className="bg-white dark:bg-[#111115] p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-emerald-500/20" />
                                        <div className="flex items-center gap-4 mb-4 relative z-10">
                                            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                                                <Eye className="size-5" />
                                            </div>
                                            <h3 className="text-sm font-bold text-slate-500 dark:text-white/50">{t("total_views")}</h3>
                                        </div>
                                        <p className="text-4xl font-black text-black dark:text-white relative z-10">{totalViews}</p>
                                    </div>

                                    <div className="bg-white dark:bg-[#111115] p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-orange-500/20" />
                                        <div className="flex items-center gap-4 mb-4 relative z-10">
                                            <div className="p-3 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl">
                                                <ChevronUp className="size-5" />
                                            </div>
                                            <h3 className="text-sm font-bold text-slate-500 dark:text-white/50">{t("total_upvotes")}</h3>
                                        </div>
                                        <p className="text-4xl font-black text-black dark:text-white relative z-10">{totalUpvotes}</p>
                                    </div>

                                </div>

                                <div className="bg-white dark:bg-[#111115] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm relative z-10">
                                    <h2 className="flex items-center gap-2 text-lg font-bold text-black dark:text-white mb-6">
                                        <Activity className="size-5 text-primary" />
                                        {t("recent_activity")}
                                    </h2>

                                    {projects.length > 0 ? (
                                        <div className="space-y-4">
                                            {projects.slice(0, 5).map((project: any) => (
                                                <div key={project._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-primary/30 transition-colors">
                                                    <div className="min-w-0">
                                                        <Link href={`/project/${project._id}`} className="text-base font-bold text-black dark:text-white hover:text-primary transition-colors truncate block">
                                                            {project.title}
                                                        </Link>
                                                        {project.domain && (
                                                            <p className="text-xs font-medium text-slate-500 dark:text-white/40 mt-1 truncate">
                                                                {project.domain}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-4 shrink-0">
                                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-white/60 bg-white dark:bg-[#161618] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10">
                                                            <Eye className="size-3.5 text-emerald-500" />
                                                            {project.views || 0}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-white/60 bg-white dark:bg-[#161618] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10">
                                                            <ChevronUp className="size-3.5 text-orange-500" />
                                                            {project.upvotes || 0}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10 bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
                                            <FolderCode className="size-10 text-slate-300 dark:text-white/20 mx-auto mb-3" />
                                            <p className="text-sm font-medium text-slate-500 dark:text-white/50">{t("no_projects_yet")}</p>
                                            <Link href="/project/create" className="inline-block mt-4 text-sm font-bold text-primary hover:underline">
                                                {t("create_first_project")}
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {currentTab === "projects" && (
                            <div className="bg-white dark:bg-[#111115] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
                                <h2 className="text-xl font-bold text-black dark:text-white mb-6">
                                    {t("projects")}
                                </h2>
                                {projects.length > 0 ? (
                                    <ManageProjects projects={projects} />
                                ) : (
                                    <div className="text-center py-12 bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
                                        <p className="text-sm font-medium text-slate-500 dark:text-white/50">{t("no_projects_yet")}</p>
                                        <Link href="/project/create" className="inline-block mt-4 text-sm font-bold text-primary hover:underline">
                                            {t("create_first_project")}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {currentTab === "settings" && (
                            <div className="bg-white dark:bg-[#111115] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
                                <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
                                </div>

                                <h2 className="text-xl font-bold text-black dark:text-white mb-8 relative z-10">
                                    {t("settings")}
                                </h2>

                                <ProfileSettings
                                    user={userProfile}
                                    universities={universities}
                                    domains={domains}
                                />
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </main>
    );
}