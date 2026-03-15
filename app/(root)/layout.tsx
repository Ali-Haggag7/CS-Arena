import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Layout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <main className="font-work-sans min-h-screen flex flex-col bg-white dark:bg-black transition-colors duration-300">
            <Navbar />
            <div className="flex-grow">{children}</div>
            <Footer />
        </main>
    );
}