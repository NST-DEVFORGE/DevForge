import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BlogPostMeta } from "@/lib/blog";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

export function BlogTeaser({ posts }: { posts: BlogPostMeta[] }) {
    return (
        <section className="py-24 relative">
            <div className="max-w-6xl mx-auto px-4">
                <SectionHeading
                    title={<>From the <span className="text-orange-500">Blog</span></>}
                    dek="Tutorials and writeups from the club."
                />
                <div className="grid md:grid-cols-3 gap-6">
                    {posts.map((post, i) => (
                        <Reveal key={post.slug} delay={i * 0.1}>
                            <Link
                                href={`/blog/${post.slug}`}
                                className="block h-full bg-neutral-900/50 border border-neutral-800 hover:border-orange-500/40 rounded-2xl p-6 transition-colors group"
                            >
                                <div className="text-xs text-orange-400 font-semibold uppercase tracking-wider mb-3">{post.category}</div>
                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">{post.title}</h3>
                                <p className="text-neutral-400 text-sm line-clamp-3 mb-4">{post.excerpt}</p>
                                <div className="flex items-center gap-1 text-xs font-semibold text-orange-400 group-hover:gap-2 transition-all">
                                    Read <ArrowUpRight size={14} />
                                </div>
                            </Link>
                        </Reveal>
                    ))}
                </div>
                <div className="text-center mt-8">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-semibold text-sm transition-colors">
                        View all posts <ArrowUpRight size={14} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
