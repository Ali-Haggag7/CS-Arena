import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";
import { redirect } from "next/navigation";
import EditProjectForm from "@/components/project/EditProjectForm";

export const metadata = {
    title: "Edit Project | CS-Arena",
};

export default async function EditProjectPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await auth();
    if (!session) redirect("/");

    const { id } = await params;

    const project = await client.withConfig({ useCdn: false }).fetch(
        `*[_type == "project" && _id == $id][0]`,
        { id }
    );

    if (!project) redirect("/404");

    if (project.author?._ref !== session.id) {
        redirect(`/project/${id}`);
    }

    const domains = await client.fetch(`*[_type == "domain"] | order(name asc) { _id, name }`);

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-[#0d0d0f] font-work-sans pt-24 pb-24 transition-colors duration-300 relative selection:bg-primary/30">
            <div className="absolute inset-0 grid-bg opacity-30 dark:opacity-40 pointer-events-none" aria-hidden="true" />
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-20 dark:opacity-10 blur-[100px] pointer-events-none"
                style={{ background: "radial-gradient(ellipse, #3b82f6 0%, transparent 70%)" }}
                aria-hidden="true"
            />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <EditProjectForm project={project} domains={domains} />
            </div>
        </main>
    );
}