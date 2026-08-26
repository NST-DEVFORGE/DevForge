import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { authErrorResponse, getMember, requireCapability } from "@/lib/session";
import { generateOfferLetterPdf, offerLetterFilename } from "@/lib/offer-letter";
import { sendOfferLetterEmail } from "@/lib/email";

export const runtime = "nodejs";

/**
 * Issues the club's official membership offer letter, gated to members:manage
 * (the same power that approves join requests).
 *
 *   mode: "preview"  → returns the PDF inline, so an admin can check it first.
 *   mode: "send"     → emails the letter as a PDF attachment to the recipient.
 *
 * A `usn` may be given to pull the recipient's name/email from their member
 * record; any field can still be overridden in the request body. Sending is a
 * deliberate, per-recipient action — there is no bulk endpoint here.
 */
const schema = z.object({
    mode: z.enum(["preview", "send"]),
    usn: z.string().trim().max(32).optional(),
    name: z.string().trim().max(120).optional(),
    email: z.string().trim().email().optional(),
    role: z.string().trim().max(60).optional(),
    term: z.string().trim().max(20).optional(),
    signatoryName: z.string().trim().max(120).optional(),
    signatoryTitle: z.string().trim().max(160).optional(),
    note: z.string().trim().max(600).optional(),
});

export async function POST(request: NextRequest) {
    try {
        await requireCapability("members:manage");

        const parsed = schema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) {
            return NextResponse.json(
                { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid request" },
                { status: 400 },
            );
        }
        const input = parsed.data;

        // Fill name/email from the member record when a USN is supplied.
        let name = input.name;
        let email = input.email;
        if (input.usn) {
            const member = await getMember(input.usn);
            name ??= member?.name;
            email ??= member?.email || undefined;
        }

        name = name?.trim();
        if (!name) {
            return NextResponse.json({ ok: false, message: "A recipient name is required." }, { status: 400 });
        }

        const pdf = await generateOfferLetterPdf({
            name,
            role: input.role,
            term: input.term,
            signatoryName: input.signatoryName,
            signatoryTitle: input.signatoryTitle,
            note: input.note,
        });
        const filename = offerLetterFilename(name);

        if (input.mode === "preview") {
            return new NextResponse(Buffer.from(pdf), {
                status: 200,
                headers: {
                    "content-type": "application/pdf",
                    "content-disposition": `inline; filename="${filename}"`,
                    "cache-control": "no-store",
                },
            });
        }

        // mode === "send"
        if (!email) {
            return NextResponse.json(
                { ok: false, message: "No email address for this recipient — add one to send." },
                { status: 400 },
            );
        }

        try {
            await sendOfferLetterEmail({ to: email, name, pdf, filename });
        } catch (err) {
            const message = err instanceof Error ? err.message : "Couldn't send the email.";
            return NextResponse.json({ ok: false, message }, { status: 502 });
        }

        return NextResponse.json({ ok: true, message: `Offer letter sent to ${name} at ${email}.` });
    } catch (error) {
        return authErrorResponse(error);
    }
}
