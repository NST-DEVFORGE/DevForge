import { HomeBoot } from "@/components/home-boot";
import { Hero } from "@/components/hero";
import { ThisMonth } from "@/components/this-month";
import { OpenSource } from "@/components/open-source";
import { StudentSpotlight } from "@/components/student-spotlight";
import { BlogTeaser } from "@/components/blog-teaser";
import { Join } from "@/components/join";
import { getAllPostsMeta } from "@/lib/blog";

export default function Home() {
    // Only surfaced once there's enough real content that the homepage
    // never shows an empty-feeling "Blog" section as a first impression.
    const latestPosts = getAllPostsMeta().slice(0, 3);
    const showBlogTeaser = latestPosts.length >= 3;

    return (
        <HomeBoot>
            <div className="bg-transparent text-white selection:bg-cyan-400 selection:text-black">
                <Hero />
                <ThisMonth />
                <OpenSource />
                <StudentSpotlight />
                {showBlogTeaser && <BlogTeaser posts={latestPosts} />}
                <Join />
            </div>
        </HomeBoot>
    );
}

