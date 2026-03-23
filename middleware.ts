import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const rateLimit = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, limit: number = 60): boolean {
    const now = Date.now();
    const windowMs = 60 * 1000;
    const record = rateLimit.get(ip);

    if (!record || now > record.resetTime) {
        rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
        return true;
    }

    if (record.count >= limit) return false;

    record.count++;
    return true;
}

export default auth((req: any) => {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    const path = req.nextUrl.pathname;

    // ─── Studio Protection ─────────────────────────────────────────────────────
    if (path.startsWith("/studio")) {
        const adminEmail = process.env.ADMIN_EMAIL;
        if (req.auth?.user?.email !== adminEmail) {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    // ─── Rate Limiting ─────────────────────────────────────────────────────────
    if (path.startsWith("/api/") && !path.startsWith("/api/auth")) {
        if (!checkRateLimit(ip, 30)) {
            return NextResponse.json(
                { error: "Too many requests" },
                { status: 429 }
            );
        }
    }

    // ─── Onboarding Guard ──────────────────────────────────────────────────────
    const isLoggedIn = !!req.auth;
    const isOnboarded = req.auth?.isOnboarded;

    if (isLoggedIn && !isOnboarded && path !== "/onboarding" && !path.startsWith("/api")) {
        return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    if (isLoggedIn && isOnboarded && path === "/onboarding") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|studio).*)",
    ],
};