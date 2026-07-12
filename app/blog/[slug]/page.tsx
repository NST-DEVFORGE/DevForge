import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ArrowLeft, ArrowUpRight } from "lucide-react";
import { getAllPostsMeta, getPost, getRelatedPosts } from "@/lib/blog";
import { getAuthor } from "@/data/blog-authors";

export function generateStaticParams() {
    return getAllPostsMeta().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getPost(slug);
    if (!post) return {};
    return {
        title: `${post.title} | DevForge Blog`,
        description: post.excerpt,
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getPost(slug);
    if (!post) notFound();

    const author = getAuthor(post.authorSlug);
    const related = getRelatedPosts(post);

    return (
        <div className="min-h-screen bg-transparent text-white pt-24 pb-16">
            <div className="max-w-3xl mx-auto px-4">
                <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-cyan-300 transition-colors mb-8">
                    <ArrowLeft size={14} /> All posts
                </Link>

                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-3 text-xs">
                        <span className="text-cyan-300 font-semibold uppercase tracking-wider">{post.category}</span>
                        <span className="text-neutral-600">·</span>
                        <span className="text-neutral-500">{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">{post.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-neutral-500">
                        <Link href={`/blog/author/${author.slug}`} className="hover:text-cyan-300 transition-colors font-medium text-neutral-300">
                            {author.name}
                        </Link>
                        <span className="flex items-center gap-1">
                            <Clock size={13} /> {post.readingTime}
                        </span>
                    </div>
                </div>

                <article
                    className="prose-devforge"
                    dangerouslySetInnerHTML={{ __html: post.html }}
                />

                {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-neutral-800">
                        {post.tags.map((tag) => (
                            <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-neutral-400 border border-white/10">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {related.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-neutral-800">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-4">Related</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {related.map((r) => (
                                <Link
                                    key={r.slug}
                                    href={`/blog/${r.slug}`}
                                    className="block p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-cyan-400/40 transition-colors group"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-medium text-white group-hover:text-cyan-300 transition-colors">{r.title}</span>
                                        <ArrowUpRight size={14} className="text-neutral-600 flex-shrink-0" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
