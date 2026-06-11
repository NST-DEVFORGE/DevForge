import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
        return NextResponse.json({ error: 'Missing username' }, { status: 400 });
    }

    const headers: Record<string, string> = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'DevForge-App',
    };

    if (process.env.GITHUB_TOKEN) {
        headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    try {
        const [mergedRes, openRes] = await Promise.all([
            fetch(
                `https://api.github.com/search/issues?q=author:${username}+type:pr+is:merged&per_page=1`,
                { headers, next: { revalidate: 1800 } }
            ),
            fetch(
                `https://api.github.com/search/issues?q=author:${username}+type:pr+is:open&per_page=1`,
                { headers, next: { revalidate: 1800 } }
            ),
        ]);

        const [merged, open] = await Promise.all([mergedRes.json(), openRes.json()]);

        return NextResponse.json({
            merged: merged.total_count ?? 0,
            open: open.total_count ?? 0,
        }, {
            headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' }
        });
    } catch (e) {
        return NextResponse.json({ merged: 0, open: 0 }, { status: 500 });
    }
}
