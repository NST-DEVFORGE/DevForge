import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import readingTime from "reading-time";
import { getAuthor } from "@/data/blog-authors";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface BlogPostMeta {
    slug: string;
    title: string;
    authorSlug: string;
    date: string;
    category: string;
    tags: string[];
    excerpt: string;
    readingTime: string;
}

export interface BlogPost extends BlogPostMeta {
    html: string;
}

function readSlugs(): string[] {
    if (!fs.existsSync(BLOG_DIR)) return [];
    return fs
        .readdirSync(BLOG_DIR)
        .filter((f) => f.endsWith(".md"))
        .map((f) => f.replace(/\.md$/, ""));
}

function readRaw(slug: string) {
    const filePath = path.join(BLOG_DIR, `${slug}.md`);
    const raw = fs.readFileSync(filePath, "utf-8");
    return matter(raw);
}

export function getAllPostsMeta(): BlogPostMeta[] {
    return readSlugs()
        .map((slug) => {
            const { data, content } = readRaw(slug);
            return {
                slug,
                title: data.title,
                authorSlug: data.author,
                date: data.date,
                category: data.category,
                tags: data.tags ?? [],
                excerpt: data.excerpt ?? "",
                readingTime: readingTime(content).text,
            };
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPost(slug: string): BlogPost | null {
    if (!readSlugs().includes(slug)) return null;
    const { data, content } = readRaw(slug);
    return {
        slug,
        title: data.title,
        authorSlug: data.author,
        date: data.date,
        category: data.category,
        tags: data.tags ?? [],
        excerpt: data.excerpt ?? "",
        readingTime: readingTime(content).text,
        html: marked.parse(content, { async: false }) as string,
    };
}

export function getAllCategories(): string[] {
    return Array.from(new Set(getAllPostsMeta().map((p) => p.category))).sort();
}

export function getRelatedPosts(current: BlogPostMeta, limit = 2): BlogPostMeta[] {
    return getAllPostsMeta()
        .filter((p) => p.slug !== current.slug)
        .map((p) => ({
            post: p,
            score:
                (p.category === current.category ? 2 : 0) +
                p.tags.filter((t) => current.tags.includes(t)).length,
        }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((x) => x.post);
}

export { getAuthor };
