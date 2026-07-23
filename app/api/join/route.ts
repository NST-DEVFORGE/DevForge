import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { club, external, COLLECTIONS } from "@/lib/firebase/collections";
import { checkRateLimit, clientIp, RATE_LIMITS } from "@/lib/rate-limit";

export const runtime = "nodejs";

const schema = z.object({
    usn: z.string().trim().min(4, "Enter your USN").max(32),
    note: z.string().trim().max(500).optional(),
});

/**
 * Public join request. Identity comes from the student portal, not the form —
 * an applicant supplies only their USN, and name/email are read from the
 * `students` record. That keeps anyone from registering under someone else's
 * details, and means there is nothing to verify by hand at approval time.
 *
 * The response is identical whether or not the USN exists, so this can't be
 * used to enumerate the student roster.
 */
const SUBMITTED = "Request received. An admin will review it shortly.";

export async function POST(request: NextRequest) {
    const limit = await checkRateLimit("join", clientIp(request), RATE_LIMITS.login);
    if (!limit.ok) {
        return NextResponse.json(
            { ok: false, message: "Too many requests. Try again shortly." },
            { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
        );
    }

    const parsed = schema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
        return NextResponse.json(
            { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid request" },
            { status: 400 },
        );
    }

    const { usn, note } = parsed.data;
    const student = await external("students").doc(usn).get();
    const existing = await club(COLLECTIONS.members).doc(usn).get();

    // Unknown USN, or already a member/pending: same answer either way.
    if (!student.exists || existing.exists) {
        return NextResponse.json({ ok: true, message: SUBMITTED });
    }

    const data = student.data() as Record<string, string>;
    await club(COLLECTIONS.members).doc(usn).set({
        usn,
        name: data.name ?? usn,
        email: data.email || data.institutional_email || "",
        role: "member",
        status: "pending",
        passwordHash: "",
        note: note ?? "",
        requestedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true, message: SUBMITTED });
}
