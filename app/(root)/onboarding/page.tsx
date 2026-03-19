import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { client } from "@/sanity/lib/client";
import OnboardingForm from "@/components/shared/OnboardingForm";

export default async function OnboardingPage() {
    const session = await auth();

    if (!session) redirect("/");

    if (session.isOnboarded) redirect("/");

    const universities = await client.fetch(`*[_type == "university"] | order(name asc) { _id, name }`);
    const domains = await client.fetch(`*[_type == "domain"] | order(name asc) { _id, name }`);

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-[#0d0d0f] font-work-sans flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">

            <div className="absolute inset-0 grid-bg opacity-30 dark:opacity-40 pointer-events-none" aria-hidden="true" />
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-20 dark:opacity-10 blur-[120px] pointer-events-none"
                style={{ background: "radial-gradient(ellipse, #3b82f6 0%, transparent 70%)" }}
                aria-hidden="true"
            />

            <div className="w-full max-w-lg relative z-10">
                <OnboardingForm universities={universities} domains={domains} />
            </div>
        </main>
    );
}