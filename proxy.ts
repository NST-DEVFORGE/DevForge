import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, verifySession } from "@/lib/auth";

/**
 * Redirects unauthenticated visitors away from the member app. This is UX, not
 * authorization — every protected route handler and page still calls
 * requireUser()/requireAdmin() for itself. CODE-4O4's portal treated its
 * middleware check as the authorization boundary and was trivially bypassed;
 * nothing here is permitted to be the only thing standing in the way.
 */
export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const session = verifySession(request.cookies.get(AUTH_COOKIE)?.value);

    if (!session) {
        const login = new URL("/login", request.url);
        // Bounce back to the requested page once they're signed in.
        login.searchParams.set("next", pathname);
        return NextResponse.redirect(login);
    }

    if (pathname.startsWith("/admin") && session.role !== "admin" && session.role !== "mentor") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

// Proxy always runs on the Node.js runtime in Next 16, so jsonwebtoken's use of
// node crypto is fine here and the signature can be verified rather than assumed.
export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*"],
};
