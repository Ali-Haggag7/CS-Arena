import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isOnboarded = req.auth?.isOnboarded;
    const path = req.nextUrl.pathname;

    // If the user is logged in but not onboarded, and they are trying to access a page other than onboarding, redirect them to the onboarding page
    if (isLoggedIn && !isOnboarded && path !== "/onboarding") {
        return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    // If the user is logged in and onboarded, and they are trying to access the onboarding page, redirect them to the home page
    if (isLoggedIn && isOnboarded && path === "/onboarding") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
});

// We only want to run this middleware on pages that require authentication, so we exclude API routes, static files, and the favicon
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};