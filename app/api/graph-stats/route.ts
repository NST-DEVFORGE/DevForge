import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'data', 'graph-stats.json');
        const fileData = fs.readFileSync(filePath, 'utf-8');
        const stats = JSON.parse(fileData);

        return NextResponse.json(
            { ...stats, fetchedAt: new Date().toISOString() },
            { headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=7200' } }
        );
    } catch (error) {
        console.error('graph-stats error:', error);
        return NextResponse.json({ error: 'Failed to read graph stats' }, { status: 500 });
    }
}
