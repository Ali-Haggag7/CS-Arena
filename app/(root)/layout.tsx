import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Layout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <main className="font-work-sans min-h-screen flex flex-col bg-gray-50 dark:bg-[#0d0d0f] transition-colors duration-300">
            <Navbar />
            <div className="flex-grow">{children}</div>
            <Footer />
        </main>
    );
}