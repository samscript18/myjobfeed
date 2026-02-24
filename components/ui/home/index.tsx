'use client';

import { Search, MapPin, ArrowRight, TrendingUp, Users, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/Layout";
import JobCard from "@/components/JobCard";
import { mockJobs, categories } from "@/data/mock-data";
import heroBg from "@/public/hero-bg.jpg";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const stats = [
  { label: "Active Jobs", value: "2,400+", icon: TrendingUp },
  { label: "Companies", value: "850+", icon: Building2 },
  { label: "Job Seekers", value: "50K+", icon: Users },
];

const HomePage = () => {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const router = useRouter();
  const featuredJobs = mockJobs.filter((j) => j.featured);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (location) params.set("location", location);
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <Layout>
      <section className="relative overflow-hidden hero-section py-20 lg:py-28">
        <div className="absolute inset-0 opacity-15">
          <Image src={heroBg} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-bold leading-tight text-primary-foreground md:text-5xl lg:text-6xl animate-fade-in">
              Find Your Dream Job Today
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/80 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Discover thousands of opportunities from top companies across Nigeria. No sign-up required.
            </p>

            <form onSubmit={handleSearch} className="mt-8 flex flex-col gap-3 sm:flex-row animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Job title or keyword..."
                  className="h-12 pl-10 bg-card border-0"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Location..."
                  className="h-12 pl-10 bg-card border-0"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-8">
                Search Jobs
              </Button>
            </form>
          </div>
        </div>
      </section>

      <section className="border-b bg-card py-8">
        <div className="container flex flex-wrap items-center justify-center gap-10 md:gap-16">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <stat.icon className="h-8 w-8 text-primary" />
              <div>
                <p className="font-display text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">Featured Jobs</h2>
            <Link href="/jobs" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/50 py-16">
        <div className="container">
          <h2 className="text-center font-display text-2xl font-bold">Browse by Category</h2>
          <p className="mt-2 text-center text-muted-foreground">Explore jobs in your field</p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/category/${cat.name.toLowerCase()}`}
                className="job-card flex items-center gap-3 rounded-lg border bg-card p-4 transition-colors"
              >
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <p className="font-display text-sm font-semibold">{cat.name}</p>
                  <p className="text-xs text-muted-foreground">{cat.count} jobs</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <h2 className="font-display text-2xl font-bold">Latest Jobs</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {mockJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/jobs">
              <Button variant="outline" size="lg">
                Browse All Jobs <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="hero-section py-16">
        <div className="container text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground">Ready to Hire?</h2>
          <p className="mt-3 text-primary-foreground/80">Post your job and reach thousands of qualified candidates.</p>
          <Link href="/post-job">
            <Button size="lg" className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
              Post a Job — It&#39;s Free
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
