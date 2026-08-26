import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { authErrorResponse, requireCapability } from "@/lib/session";
import { generateOfferLetterPdf, offerLetterFilename } from "@/lib/offer-letter";
import { sendOfferLetterEmail } from "@/lib/email";

export const runtime = "nodejs";
// Generating and mailing a batch sequentially can take a while; allow for it.
export const maxDuration = 300;

/**
 * Bulk-issues the membership offer letter to a list of recipients — the "send
 * to everyone who passed" case. Gated to members:manage, the same power that
 * approves join requests.
 *
 * Each recipient is generated and mailed independently; one failure never stops
 * the rest, and the per-recipient outcome is returned so the admin can see who
 * did and didn't go out. There is deliberately no way to trigger this without a
 * signed-in admin explicitly submitting the list.
 */
const schema = z.object({
    recipients: z
        .array(
            z.object({
                name: z.string().trim().min(1).max(120),
                email: z.string().trim().email(),
            }),
        )
        .min(1, "No recipients.")
        .max(200, "Too many recipients in one batch."),
    role: z.string().trim().max(60).optional(),
    term: z.string().trim().max(20).optional(),
    signatoryName: z.string().trim().max(120).optional(),
    signatoryTitle: z.string().trim().max(160).optional(),
    note: z.string().trim().max(600).optional(),
});

export interface BulkResult {
    name: string;
    email: string;
    ok: boolean;
    message?: string;
}

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
        const { recipients, role, term, signatoryName, signatoryTitle, note } = parsed.data;

        // De-duplicate by email so an accidental repeat isn't mailed twice.
        const seen = new Set<string>();
        const unique = recipients.filter((r) => {
            const key = r.email.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });

        const results: BulkResult[] = [];
        for (const r of unique) {
            try {
                const pdf = await generateOfferLetterPdf({
                    name: r.name,
                    role,
                    term,
                    signatoryName,
                    signatoryTitle,
                    note,
                });
                await sendOfferLetterEmail({
                    to: r.email,
                    name: r.name,
                    pdf,
                    filename: offerLetterFilename(r.name),
                });
                results.push({ name: r.name, email: r.email, ok: true });
            } catch (err) {
                results.push({
                    name: r.name,
                    email: r.email,
                    ok: false,
                    message: err instanceof Error ? err.message : "Failed to send.",
                });
            }
        }

        const sent = results.filter((r) => r.ok).length;
        const failed = results.length - sent;
        return NextResponse.json({
            ok: true,
            sent,
            failed,
            skippedDuplicates: recipients.length - unique.length,
            results,
            message: `Sent ${sent} of ${results.length} offer letters${failed ? `, ${failed} failed` : ""}.`,
        });
    } catch (error) {
        return authErrorResponse(error);
    }
}
