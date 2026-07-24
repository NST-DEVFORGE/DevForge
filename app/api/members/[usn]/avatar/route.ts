import { NextResponse, type NextRequest } from "next/server";
import { createHash } from "node:crypto";
import { club, external, COLLECTIONS } from "@/lib/firebase/collections";
import { authErrorResponse, requireUser } from "@/lib/session";

export const runtime = "nodejs";

/**
 * Student photos live in the portal's `students` collection as base64 data
 * URIs, 10-32KB each. Inlining them into member-list JSON would mean ~260KB
 * for the club roster and ~2.3MB for all 122 students, re-sent on every load.
 * Serving them here instead keeps list payloads small and lets the browser
 * cache each face independently.
 *
 * These are personal photos from a live student system, so they require a
 * session — never public, and never on a shared CDN cache.
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ usn: string }> }) {
    try {
        await requireUser();
        const { usn } = await params;

        // A member's own photo wins (off-roster mentors store it on their doc);
        // otherwise fall back to the student portal by USN.
        const memberSnap = await club(COLLECTIONS.members).doc(usn).get();
        let photo = memberSnap.exists ? (memberSnap.data() as { photo?: string }).photo : undefined;
        if (!photo) {
            const snap = await external("students").doc(usn).get();
            photo = snap.exists ? (snap.data() as { photo?: string }).photo : undefined;
        }

        if (!photo) return new NextResponse(null, { status: 404 });

        // [\s\S] rather than . with the s flag — tsconfig targets ES2017.
        const match = /^data:(image\/[a-z+]+);base64,([\s\S]+)$/i.exec(photo);
        if (!match) return new NextResponse(null, { status: 415 });

        const [, mime, base64] = match;
        const bytes = Buffer.from(base64!, "base64");
        const etag = `"${createHash("sha1").update(bytes).digest("hex").slice(0, 16)}"`;

        if (_request.headers.get("if-none-match") === etag) {
            return new NextResponse(null, { status: 304, headers: { ETag: etag } });
        }

        return new NextResponse(new Uint8Array(bytes), {
            headers: {
                "Content-Type": mime!,
                "Content-Length": String(bytes.byteLength),
                ETag: etag,
                // private: this is one member's photo, not shared-cacheable.
                "Cache-Control": "private, max-age=86400, must-revalidate",
            },
        });
    } catch (error) {
        return authErrorResponse(error);
    }
}
