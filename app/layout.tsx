import type { Metadata } from "next";
import localFont from "next/font/local";
import { Cairo } from "next/font/google";
import "./globals.css";
import "easymde/dist/easymde.min.css";
import { Toaster } from "@/components/shadcn/toaster";
import Providers from "@/components/shared/Providers";
import { getLocale, getMessages, getTranslations } from "next-intl/server";

const workSans = localFont({
  src: [
    { path: "./fonts/WorkSans-Black.ttf", weight: "900", style: "normal" },
    { path: "./fonts/WorkSans-ExtraBold.ttf", weight: "800", style: "normal" },
    { path: "./fonts/WorkSans-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/WorkSans-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/WorkSans-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/WorkSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/WorkSans-Thin.ttf", weight: "200", style: "normal" },
    { path: "./fonts/WorkSans-ExtraLight.ttf", weight: "100", style: "normal" },
  ],
  variable: "--font-work-sans",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: {
      default: t("title"),
      template: t("title_template"),
    },
    description: t("description"),
    keywords: t("keywords").split(", "),
    authors: [{ name: "Ali Haggag" }],
    manifest: "/manifest.json",
    verification: {
      google: "Hw7DN2AewiWsmwVINhf3fhUFxjt83ci1o5VCE95_8Wk",
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: "CS Arena",
    },
    icons: {
      icon: "/cs-arena-logo-512.png",
      apple: "/cs-arena-logo-192.png",
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
      className="dark"
    >
      <body className={`${workSans.variable} ${cairo.variable} font-work-sans antialiased bg-gray-50 dark:bg-[#0d0d0f]`}>
        <Providers locale={locale} messages={messages}>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}