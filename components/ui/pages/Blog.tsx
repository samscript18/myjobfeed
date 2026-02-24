import Layout from "@/components/Layout";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const posts = [
  { slug: "top-skills-2026", title: "Top 10 Skills Employers Want in 2026", excerpt: "Stay ahead of the curve with these in-demand skills that are shaping the job market.", date: "Feb 20, 2026", category: "Career Tips" },
  { slug: "remote-work-nigeria", title: "Remote Work in Nigeria: A Complete Guide", excerpt: "Everything you need to know about finding and thriving in remote roles from Nigeria.", date: "Feb 18, 2026", category: "Remote Work" },
  { slug: "resume-tips", title: "5 Resume Mistakes That Cost You Interviews", excerpt: "Avoid these common pitfalls and land more callbacks with a polished resume.", date: "Feb 15, 2026", category: "Resume" },
];

const Blog = () => (
  <Layout>
    <div className="container py-16">
      <h1 className="font-display text-3xl font-bold">Career Blog</h1>
      <p className="mt-1 text-muted-foreground">Tips, guides, and insights to level up your career</p>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article key={post.slug} className="job-card rounded-lg border bg-card overflow-hidden">
            <div className="h-40 bg-primary/10" />
            <div className="p-5">
              <span className="text-xs font-medium text-primary">{post.category}</span>
              <h2 className="mt-1 font-display text-lg font-semibold">{post.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>{post.date}</span>
                <Link href={`/blog/${post.slug}`} className="flex items-center gap-1 font-medium text-primary hover:underline">
                  Read more <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </Layout>
);

export default Blog;
