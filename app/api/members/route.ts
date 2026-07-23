import { NextResponse } from "next/server";
import { loadRoster } from "@/lib/members";
import { authErrorResponse, requireUser } from "@/lib/session";

export const runtime = "nodejs";

export async function GET() {
    try {
        await requireUser();
        return NextResponse.json({ ok: true, members: await loadRoster() });
    } catch (error) {
        return authErrorResponse(error);
    }
}
