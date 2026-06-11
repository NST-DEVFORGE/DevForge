import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    try {
        // Try the GSSoC backend API
        const res = await fetch(
            `https://backend.gssoc.girlscript.tech/user/profile?id=${id}`,
            {
                headers: { 'Accept': 'application/json' },
                next: { revalidate: 1800 } // Cache for 30 minutes
            }
        );

        if (!res.ok) throw new Error(`GSSoC API error: ${res.status}`);

        const data = await res.json();
        return NextResponse.json(data, {
            headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' }
        });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch GSSoC data' }, { status: 500 });
    }
}
