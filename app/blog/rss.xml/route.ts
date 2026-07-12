import { getAllPostsMeta } from "@/lib/blog";

const BASE_URL = "https://www.devforge.club";

function escapeXml(str: string) {
    return str.replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case "<": return "&lt;";
            case ">": return "&gt;";
            case "&": return "&amp;";
            case "'": return "&apos;";
            case '"': return "&quot;";
            default: return c;
        }
    });
}

export async function GET() {
    const posts = getAllPostsMeta();

    const items = posts
        .map(
            (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${BASE_URL}/blog/${post.slug}</link>
      <guid>${BASE_URL}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
    </item>`
        )
        .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>DevForge Blog</title>
    <link>${BASE_URL}/blog</link>
    <description>Tutorials and writeups from the DevForge team.</description>${items}
  </channel>
</rss>`;

    return new Response(xml, {
        headers: { "Content-Type": "application/xml" },
    });
}
