import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer"; // استدعاء الفوتر الجديد

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <main className="font-work-sans min-h-screen flex flex-col">
            <Navbar />

            <div className="flex-grow">
                {children}
            </div>

            <Footer />
        </main>
    );
}