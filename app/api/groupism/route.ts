import { NextResponse } from "next/server";
import { getSeedGroupismData, fetchLiveGroupismData } from "@/lib/groupism";

export const runtime = "nodejs";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get("refresh") === "1" || searchParams.get("refresh") === "true";

    try {
        if (forceRefresh) {
            const liveData = await fetchLiveGroupismData();
            return NextResponse.json(liveData, {
                headers: {
                    "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
                },
            });
        }

        // Return seed snapshot by default for blazing-fast page loads
        const seedData = getSeedGroupismData();
        return NextResponse.json(seedData, {
            headers: {
                "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
            },
        });
    } catch (error) {
        console.error("[api/groupism] error:", error);
        return NextResponse.json({ error: "Failed to load Groupism battle stats" }, { status: 500 });
    }
}
