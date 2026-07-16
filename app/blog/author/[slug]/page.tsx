import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock } from "lucide-react";
import { getAllPostsMeta } from "@/lib/blog";
import { blogAuthors } from "@/data/blog-authors";

export function generateStaticParams() {
    return blogAuthors.map((a) => ({ slug: a.slug }));
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const author = blogAuthors.find((a) => a.slug === slug);
    if (!author) notFound();

    const posts = getAllPostsMeta().filter((p) => p.authorSlug === author.slug);

    return (
        <div className="min-h-screen bg-transparent text-white pt-24 pb-16">
            <div className="max-w-3xl mx-auto px-4">
                <div className="flex items-center gap-4 mb-12">
                    <img src={author.avatar} alt={author.name} className="w-16 h-16 rounded-full object-contain bg-neutral-900 p-2 border border-neutral-800" />
                    <div>
                        <h1 className="text-3xl font-bold text-white">{author.name}</h1>
                        <p className="text-neutral-500 text-sm">{author.bio}</p>
                    </div>
                </div>

                <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-4">
                    {posts.length} post{posts.length === 1 ? "" : "s"}
                </h2>

                <div className="space-y-4">
                    {posts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="block glass hover:border-cyan-400/40 rounded-2xl p-6 transition-colors group"
                        >
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">{post.title}</h3>
                            <p className="text-neutral-400 mb-3">{post.excerpt}</p>
                            <div className="flex items-center gap-4 text-xs text-neutral-500">
                                <span>{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                                <span className="flex items-center gap-1">
                                    <Clock size={12} /> {post.readingTime}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
