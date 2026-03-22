"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

function ScrollToTop() {
    const pathname = usePathname();
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [pathname]);
    return null;
}

export default function Providers({
    children,
    locale,
    messages,
}: {
    children: React.ReactNode;
    locale: string;
    messages: Record<string, any>;
}) {
    return (
        <SessionProvider>
            <NextIntlClientProvider locale={locale} messages={messages} timeZone="Africa/Cairo">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    <ScrollToTop />
                    {children}
                </ThemeProvider>
            </NextIntlClientProvider>
        </SessionProvider>
    );
}