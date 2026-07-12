import Link from "next/link";
import { Newspaper, Clock } from "lucide-react";
import { getAllPostsMeta } from "@/lib/blog";
import { getAuthor } from "@/data/blog-authors";

export const metadata = {
    title: "Blog | DevForge",
    description: "Tutorials, program comparisons, and technical writing from the DevForge team.",
};

export default function BlogIndexPage() {
    const posts = getAllPostsMeta();

    return (
        <div className="min-h-screen bg-transparent text-white pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-4 bg-orange-500/10 text-orange-500 rounded-full mb-6 border border-orange-500/20">
                        <Newspaper size={32} />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
                        The <span className="text-orange-500">Blog</span>
                    </h1>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                        Tutorials and writeups from the club — not marketing copy.
                    </p>
                </div>

                {posts.length === 0 ? (
                    <p className="text-center text-neutral-500 py-12">No posts yet.</p>
                ) : (
                    <div className="space-y-4">
                        {posts.map((post) => {
                            const author = getAuthor(post.authorSlug);
                            return (
                                <Link
                                    key={post.slug}
                                    href={`/blog/${post.slug}`}
                                    className="block bg-neutral-900/50 border border-neutral-800 hover:border-orange-500/40 rounded-2xl p-6 transition-colors group"
                                >
                                    <div className="flex items-center gap-2 mb-2 text-xs">
                                        <span className="text-orange-400 font-semibold uppercase tracking-wider">{post.category}</span>
                                        <span className="text-neutral-600">·</span>
                                        <span className="text-neutral-500">{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                                        {post.title}
                                    </h2>
                                    <p className="text-neutral-400 mb-4">{post.excerpt}</p>
                                    <div className="flex items-center gap-4 text-xs text-neutral-500">
                                        <span>{author.name}</span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} /> {post.readingTime}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
