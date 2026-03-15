"use client";

import { MapPin, Briefcase, Clock, ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import JobCard from "@/components/JobCard";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getJob, getJobs } from "@/lib/services/job.service";
import { Category } from "@/lib/interfaces/job.interface";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { sanitizeDescription } from "@/lib/utils";

interface JobDetailProps {
	jobSlug: string;
}

const JobDetail = ({ jobSlug }: JobDetailProps) => {
	const router = useRouter();
	const { data: job, isLoading } = useQuery({
		queryFn: () => getJob(jobSlug),
		queryKey: ["get-job", jobSlug],
	});

	const { data } = useQuery({
		queryFn: () => getJobs({ category: (job?.categoryId as Category)._id }),
		queryKey: ["get-jobs"],
	});

	const jobs = data?.data || [];

	if (!isLoading && !job) {
		return (
			<Layout>
				<div className="container py-20 text-center">
					<h1 className="font-display text-2xl font-bold">Job not found</h1>
					<Link href="/jobs">
						<Button className="mt-4" variant="outline">
							Back to Jobs
						</Button>
					</Link>
				</div>
			</Layout>
		);
	}

	const relatedJobs = jobs?.filter((j) => (j.categoryId as Category)._id === (job?.categoryId as Category)._id && j._id !== job?._id).slice(0, 3) || [];

	const isEmail = job?.url.includes("@") && !job?.url.includes("https");

	return (
		<Layout>
			<div className="container py-4 mt-6">
				<Link href="/jobs" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
					<ArrowLeft className="h-4 w-4" /> Back to Jobs
				</Link>
			</div>

			{isLoading ? (
				<div className="flex justify-center items-center gap-4 my-32">
					<Loader />
				</div>
			) : (
				<div className="container py-8">
					<div className="flex flex-col gap-8 lg:flex-row">
						<div className="flex-1">
							<div className="rounded-lg border bg-card p-6">
								<div className="flex items-start gap-4">
									<div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-display text-lg font-bold text-primary">
										{job?.companyLogo || job?.company.slice(0, 5)}
									</div>
									<div className="flex-1">
										<div className="flex items-center gap-2">
											<h1 className="font-display text-2xl font-bold">{job?.title}</h1>
										</div>
										<p className="mt-1 text-muted-foreground">{job?.company}</p>
										<div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
											<span className="flex items-center gap-1 capitalize">
												<MapPin className="h-4 w-4" />
												{job?.location}
											</span>
											<span className="flex items-center gap-1 capitalize">
												<Briefcase className="h-4 w-4" />
												{job?.level}
											</span>
											<span className="flex items-center gap-1">
												<Clock className="h-4 w-4" />
												{new Date(job?.postedAt! || job?.createdAt!).toDateString()}
											</span>
										</div>
										<div className="mt-4 flex flex-wrap gap-2">
											<Badge variant="secondary">{(job?.categoryId as Category).name}</Badge>
										</div>
									</div>
								</div>
								<div className="mt-6 max-lg:hidden">
									{isEmail ? (
										<div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
											<h3 className="font-display font-semibold text-accent">Method of Application</h3>
											<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
												Apply: Send CV to <span className="font-bold text-primary">{job?.url}</span>
												<br />
												Subject:{" "}
												<span className="italic">
													{job?.title} - {job?.company}
												</span>
											</p>
											<Button
												onClick={() => (window.location.href = `mailto:${job?.url}?subject=${encodeURIComponent(job?.title!)}`)}
												className="mt-4 w-full bg-accent cursor-pointer text-accent-foreground sm:w-auto"
											>
												Send Email
											</Button>
										</div>
									) : (
										<Button
											onClick={() => window.open(job?.url, "_blank")}
											size="lg"
											className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold sm:w-auto cursor-pointer"
										>
											<ExternalLink className="mr-2 h-4 w-4" /> Apply via Website
										</Button>
									)}
								</div>
							</div>

							<div className="mt-6 space-y-6 rounded-lg border bg-card p-6">
								<div>
									<h2 className="font-display text-lg font-semibold">Job Description</h2>
									<p className="mt-2 text-muted-foreground leading-relaxed whitespace-pre-line">{sanitizeDescription(job?.description!)}</p>
								</div>
								{/* <div>
                <h2 className="font-display text-lg font-semibold">Responsibilities</h2>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                  {job?.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold">Requirements</h2>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                  {job?.requirements.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold">Benefits</h2>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                  {job?.benefits.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div> */}
							</div>
						</div>

						<aside className="w-full shrink-0 lg:w-72">
							<div className="sticky top-24 space-y-6">
								<div className="rounded-lg border bg-card p-5">
									<h3 className="font-display font-semibold">Job Overview</h3>
									<dl className="mt-4 space-y-3 text-sm">
										<div>
											<dt className="text-muted-foreground">Location</dt>
											<dd className="font-medium capitalize">{job?.location}</dd>
										</div>
										<div>
											<dt className="text-muted-foreground">Job Type</dt>
											<dd className="font-medium capitalize">{job?.type}</dd>
										</div>
										<div>
											<dt className="text-muted-foreground">Salary</dt>
											<dd className="font-medium">{job?.salaryRange}</dd>
										</div>
										<div>
											<dt className="text-muted-foreground">Experience</dt>
											<dd className="font-medium capitalize">{job?.level}</dd>
										</div>
										<div>
											<dt className="text-muted-foreground">Category</dt>
											<dd className="font-medium">{(job?.categoryId as Category).name}</dd>
										</div>
									</dl>
								</div>
								<div className="mt-2 lg:hidden">
									{isEmail ? (
										<div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
											<h3 className="font-display font-semibold text-accent">Method of Application</h3>
											<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
												Apply: Send CV to <span className="font-bold text-primary">{job?.url}</span>
												<br />
												Subject:{" "}
												<span className="italic">
													{job?.title} - {job?.company}
												</span>
											</p>
											<Button
												onClick={() => (window.location.href = `mailto:${job?.url}?subject=${encodeURIComponent(job?.title!)}`)}
												className="mt-4 w-full bg-accent cursor-pointer text-accent-foreground sm:w-auto"
											>
												Send Email
											</Button>
										</div>
									) : (
										<Button
											onClick={() => window.open(job?.url, "_blank")}
											size="lg"
											className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold cursor-pointer"
										>
											<ExternalLink className="mr-2 h-4 w-4" /> Apply via Website
										</Button>
									)}
								</div>
							</div>
						</aside>
					</div>

					{relatedJobs?.length > 0 && (
						<section className="mt-12">
							<h2 className="font-display text-xl font-bold">Related Jobs</h2>
							<div className="mt-4 grid gap-4 grid-cols-1">
								{relatedJobs?.map((job) => (
									<JobCard key={job._id} job={job} />
								))}
							</div>
						</section>
					)}
				</div>
			)}
		</Layout>
	);
};

export default JobDetail;
