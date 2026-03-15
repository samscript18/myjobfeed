"use client";

import { useState } from "react";
import { Search, MapPin, SlidersHorizontal, X, ChevronRight, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/Layout";
import JobCard from "@/components/JobCard";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getJobCategories, getJobs } from "@/lib/services/job.service";
import Loader from "@/components/Loader";
import { Label } from "../../label";
import { Controller, useForm } from "react-hook-form";
import { JobLevel, JobType } from "@/lib/enums";
import { GetJobs } from "@/lib/types";

const Jobs = () => {
	const searchParams = useSearchParams();
	const [keyword, setKeyword] = useState<string>(searchParams?.get("keyword") || "");
	const [location, setLocation] = useState<string>(searchParams?.get("location") || "");
	const [showFilters, setShowFilters] = useState<boolean>(false);
	const [page, setPage] = useState<number>(1);

	const { watch, control } = useForm<GetJobs>({});

	const { data: categories, isPending: isCategoriesPending } = useQuery({
		queryFn: () => getJobCategories(),
		queryKey: ["get-categories"],
	});

	const type = watch("type");
	const level = watch("level");
	const category = watch("category");

	const { data, isPending } = useQuery({
		queryFn: () => getJobs({ keyword, location, type, level, category, page }),
		queryKey: ["get-jobs", keyword, location, type, level, category, page],
	});

	const jobs = data?.data || [];
	const jobsCount = data?.meta?.count;
	const totalPages = data?.meta?.totalPages || 1;

	return (
		<Layout>
			<section className="border-b bg-card p-8 rounded-xl mt-8">
				<div className="container">
					<h1 className="font-display text-3xl font-bold">Find Jobs</h1>
					<p className="mt-1 text-muted-foreground">Discover your next career opportunity</p>

					<div className="mt-6 flex flex-col gap-3 sm:flex-row">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input placeholder="Job title or keyword..." className="h-11 pl-10" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
						</div>
						<div className="relative flex-1">
							<MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input placeholder="Location..." className="h-11 pl-10" value={location} onChange={(e) => setLocation(e.target.value)} />
						</div>
						<Button variant="outline" className="h-11 md:hidden" onClick={() => setShowFilters(!showFilters)}>
							<SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
						</Button>
					</div>
				</div>
			</section>

			<section className="flex flex-col md:flex-row gap-8 my-8">
				<aside className={`${showFilters ? "block" : "hidden"} md:w-[30vw] shrink-0 md:block`}>
					<div className="sticky top-24 space-y-6">
						<div className="flex items-center justify-between md:hidden">
							<h3 className="font-display font-semibold">Filters</h3>
							<button onClick={() => setShowFilters(false)}>
								<X className="h-5 w-5" />
							</button>
						</div>
						<div className="grid gap-4 grid-cols-1">
							<div>
								<Label>Job Type</Label>
								<Controller
									name="type"
									control={control}
									render={({ field, fieldState }) => (
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<SelectTrigger className="mt-1.5" helperText={fieldState.error?.message}>
												<SelectValue placeholder="Select job type" className="capitalize" />
											</SelectTrigger>
											<SelectContent>
												{Object.values(JobType).map((type) => (
													<SelectItem key={type} value={type} className="capitalize">
														{type.replace("-", " ").toLowerCase()}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
								/>
							</div>
							<div>
								<Label>Job Level</Label>
								<Controller
									name="level"
									control={control}
									render={({ field, fieldState }) => (
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<SelectTrigger className="mt-1.5" helperText={fieldState.error?.message}>
												<SelectValue placeholder="Select job level" className="capitalize" />
											</SelectTrigger>
											<SelectContent>
												{Object.values(JobLevel).map((level) => (
													<SelectItem key={level} value={level} className="capitalize">
														{level.replace("-", " ").toLowerCase()}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
								/>
							</div>
							<div>
								<Label>Category</Label>
								<Controller
									name="category"
									control={control}
									render={({ field, fieldState }) => (
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<SelectTrigger isLoading={isCategoriesPending} className="mt-1.5" helperText={fieldState.error?.message}>
												<SelectValue placeholder="Select job category" className="capitalize" />
											</SelectTrigger>
											<SelectContent>
												{categories?.map((category) => (
													<SelectItem key={category._id} value={category._id} className="capitalize">
														{category.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
								/>
							</div>
						</div>
					</div>
				</aside>

				<div className="flex-1">
					<p className="mb-4 text-sm text-muted-foreground">{jobsCount} jobs found</p>
					<div className="max-w-[auto]">
						<div className="grid gap-4 w-full">
							{isPending ? (
								<div className="flex justify-center items-center gap-4 my-24">
									<Loader />
								</div>
							) : (
								<>
									{jobs?.map((job) => (
										<JobCard key={job._id} job={job} />
									))}
									{jobs?.length === 0 && (
										<div className="rounded-lg border bg-card p-12 text-center">
											<p className="font-display text-lg font-semibold">No jobs found</p>
											<p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filters</p>
										</div>
									)}

									{totalPages > 1 && (
										<div className="flex flex-wrap justify-center items-center gap-2 my-10">
											<Button
												variant="outline"
												size="icon"
												disabled={page === 1}
												onClick={() => {
													setPage((prev) => prev - 1);
													window.scrollTo(0, 0);
												}}
											>
												<ChevronLeft className="h-4 w-4" />
											</Button>

											{Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
												<Button
													key={pageNumber}
													variant={page === pageNumber ? "default" : "outline"}
													className="h-9 w-9 cursor-pointer"
													onClick={() => {
														setPage(pageNumber);
														window.scrollTo(0, 0);
													}}
												>
													{pageNumber}
												</Button>
											))}

											<Button
												variant="outline"
												size="icon"
												disabled={page === totalPages}
												onClick={() => {
													setPage((prev) => prev + 1);
													window.scrollTo(0, 0);
												}}
											>
												<ChevronRight className="h-4 w-4" />
											</Button>
										</div>
									)}
								</>
							)}
						</div>
					</div>
				</div>
			</section>
		</Layout>
	);
};

export default Jobs;
