"use client";

import { Search, MapPin, ArrowRight, TrendingUp, Users, Building2, Briefcase, CheckCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/Layout";
import JobCard from "@/components/JobCard";
import { mockCategories } from "@/lib/data/mock-data";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getJobCategories, getJobs } from "@/lib/services/job.service";
import Loader from "@/components/Loader";

const stats = [
	{ label: "Active Jobs", value: "2,400+", icon: TrendingUp },
	{ label: "Companies", value: "850+", icon: Building2 },
	{ label: "Job Seekers", value: "50K+", icon: Users },
];

const benefits = [
	{ icon: Briefcase, title: "Diverse Opportunities", description: "Find jobs across multiple industries and roles" },
	{ icon: CheckCircle, title: "Verified Listings", description: "All job postings are verified and up-to-date" },
	{ icon: Users, title: "Direct Contact", description: "Connect directly with hiring managers" },
];

const HomePage = () => {
	const [keyword, setKeyword] = useState<string>("");
	const [location, setLocation] = useState<string>("");
	const router = useRouter();

	const { data, isPending } = useQuery({
		queryFn: () => getJobs(),
		queryKey: ["get-jobs"],
	});

	const { data: categories, isPending: isCategoriesPending } = useQuery({
		queryFn: () => getJobCategories(),
		queryKey: ["get-categories"],
	});

	const jobs = data?.data || [];

	const featuredJobs = jobs?.slice(0, 6) || [];

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		const params = new URLSearchParams();
		if (keyword) params.set("keyword", keyword);
		if (location) params.set("location", location);
		router.push(`/jobs?${params.toString()}`);
	};

	return (
		<Layout>
			<section className="relative overflow-hidden py-24 w-full lg:py-32">
				<div className="container">
					<div className="mx-auto lg:max-w-4xl">
						<div className="text-center">
							<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
								<Star className="h-4 w-4 text-accent" />
								<span className="text-sm font-medium text-primary">The #1 Job Platform</span>
							</div>

							<h1 className="font-display text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
								Your <span className="bg-linear-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">Dream Job</span> Awaits
							</h1>

							<p className="mt-6 text-lg text-muted-foreground md:text-xl">Discover thousands of opportunities from country&#39;s top companies. Start your career journey today.</p>

							<form onSubmit={handleSearch} className="mt-10">
								<div className="flex flex-col gap-3 sm:flex-row rounded-xl bg-card border border-border/50 p-2 shadow-lg sm:shadow-xl hover:shadow-xl transition-shadow max-md:max-w-full max-lg:max-w-[85%] max-lg:mx-auto">
									<div className="relative flex-1">
										<Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
										<Input
											placeholder="Job title, keywords, or company..."
											className="h-12 pl-12 bg-transparent border-0 text-base placeholder:text-muted-foreground focus:outline-none"
											value={keyword}
											onChange={(e) => setKeyword(e.target.value)}
										/>
									</div>
									<div className="relative flex-1 sm:border-l sm:border-border/30">
										<MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
										<Input
											placeholder="Location..."
											className="h-12 pl-12 bg-transparent border-0 text-base placeholder:text-muted-foreground focus:outline-none"
											value={location}
											onChange={(e) => setLocation(e.target.value)}
										/>
									</div>
									<Button
										type="submit"
										size="lg"
										className="h-12 bg-linear-to-r from-primary to-primary/90 text-white hover:shadow-lg transition-all font-semibold px-8 rounded-lg"
									>
										Search
									</Button>
								</div>
							</form>

							<p className="mt-4 text-sm text-muted-foreground max-md:mx-4">✓ No sign-up required • ✓ Free to use • ✓ Instant applications</p>
						</div>
					</div>
				</div>
			</section>

			<section className="border-none bg-linear-to-r from-primary/5 via-transparent to-primary/5 py-12 -mx-12 max-md:-mx-4">
				<div className="container">
					<div className="grid grid-cols-1 gap-8 sm:grid-cols-3 justify-items-center">
						{stats.map((stat) => (
							<div key={stat.label} className="flex flex-col items-center text-center sm:items-start sm:text-left">
								<div className="rounded-lg bg-linear-to-br from-primary/20 to-primary/15 p-3 mb-3">
									<stat.icon className="h-6 w-6 text-primary" />
								</div>
								<p className="font-display text-3xl font-bold">{stat.value}</p>
								<p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="py-20">
				<div className="container">
					<div className="flex items-end justify-between mb-12">
						<div>
							<h2 className="font-display text-4xl font-bold">Featured Opportunities</h2>
							<p className="mt-2 text-muted-foreground">Handpicked positions from top companies</p>
						</div>
						<Link href="/jobs" className="hidden md:flex items-center gap-2 text-primary hover:gap-3 transition-all font-medium group">
							View all jobs <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
						</Link>
					</div>
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{featuredJobs.map((job) => (
							<JobCard key={job._id} job={job} />
						))}
					</div>
					<Link href="/jobs" className="md:hidden mt-8 flex justify-center">
						<Button variant="outline" size="lg" className="w-full sm:w-auto">
							View all jobs <ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					</Link>
				</div>
			</section>

			<section className="py-16 rounded-xl bg-linear-to-br from-secondary/50 to-primary/5">
				<div className="container">
					<div className="text-center mb-12">
						<h2 className="font-display text-4xl font-bold">Why Choose MyJobFeed?</h2>
						<p className="mt-3 text-muted-foreground text-lg max-w-2xl mx-auto">Everything you need to find your perfect job opportunity</p>
					</div>

					<div className="grid gap-8 md:grid-cols-3">
						{benefits.map((benefit) => {
							const Icon = benefit.icon;
							return (
								<Card key={benefit.title} className="group p-8 hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer">
									<div className="rounded-lg bg-linear-to-br from-primary/10 to-primary/5 p-3 w-fit mb-4 group-hover:scale-110 transition-transform">
										<Icon className="h-6 w-6 text-primary" />
									</div>
									<h3 className="font-display text-lg font-semibold mb-2">{benefit.title}</h3>
									<p className="text-muted-foreground">{benefit.description}</p>
								</Card>
							);
						})}
					</div>
				</div>
			</section>

			<section className="py-20">
				<div className="container">
					<div className="text-center mb-12">
						<h2 className="font-display text-4xl font-bold">Explore by Category</h2>
						<p className="mt-3 text-muted-foreground text-lg">Find your next opportunity in your field</p>
					</div>

					{isCategoriesPending ? (
						<div className="flex justify-center items-center gap-4 my-24">
							<Loader />
						</div>
					) : (
						<div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{categories?.map((category) => (
								<Link key={category._id} href={`/category/${category._id}`} className="group">
									<Card className="p-6 h-full flex flex-col items-center text-center hover:shadow-lg hover:border-primary/30 hover:bg-linear-to-br hover:from-primary/5 to-transparent transition-all cursor-pointer">
										<div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{mockCategories.find((c) => c.name === category.slug)?.icon}</div>
										<h2 className="font-display text-sm font-semibold">{category.name}</h2>
										<p className="mt-1 text-sm text-muted-foreground">{category.jobCount} open positions</p>
									</Card>
								</Link>
							))}
						</div>
					)}
				</div>
			</section>

			<section className="py-20 max-md:px-4 bg-linear-to-r from-primary via-primary to-primary/90 relative overflow-hidden rounded-2xl">
				<div className="absolute inset-0 opacity-10">
					<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIEwgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] bg-repeat" />
				</div>

				<div className="container relative z-10">
					<div className="max-w-3xl mx-auto text-center text-white">
						<h2 className="font-display text-4xl md:text-5xl font-bold">Ready to Post a Job?</h2>
						<p className="mt-4 text-lg opacity-90">Reach thousands of talented professionals and find your next team member. It&#39;s completely free!</p>

						<Link href="/post-job" className="mt-8 inline-block">
							<Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg">
								Post Your Job Now <ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						</Link>
					</div>
				</div>
			</section>

			<section className="py-20 bg-linear-to-b from-transparent via-secondary/30 to-transparent">
				<div className="container">
					<h2 className="font-display text-4xl font-bold mb-3">Latest Job Listings</h2>
					<p className="text-muted-foreground mb-12">Find opportunities posted just today</p>

					{isPending ? (
						<div className="flex justify-center items-center gap-4 my-24">
							<Loader />
						</div>
					) : (
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
							{jobs?.slice(0, 9).map((job) => (
								<JobCard key={job._id} job={job} />
							))}
						</div>
					)}

					<div className="text-center">
						<Link href="/jobs">
							<Button variant="outline" size="lg" className="border-primary/20 hover:bg-primary/90">
								Browse All Jobs <ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						</Link>
					</div>
				</div>
			</section>
		</Layout>
	);
};

export default HomePage;
