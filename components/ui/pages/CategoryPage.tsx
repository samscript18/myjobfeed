"use client";

import Layout from "@/components/Layout";
import JobCard from "@/components/JobCard";
import { getCategory, getJobs } from "@/lib/services/job.service";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loader";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../button";
import { useState } from "react";

const CategoryPageUI = ({ categoryId }: { categoryId: string }) => {
	const router = useRouter();
	const [page, setPage] = useState<number>(1);
	const { data: category } = useQuery({
		queryFn: () => getCategory(categoryId),
		queryKey: ["get-category", categoryId],
	});

	const { data, isPending } = useQuery({
		queryFn: () => getJobs({ category: categoryId, page }),
		queryKey: ["get-category-jobs", categoryId, page],
	});

	const jobs = data?.data || [];
	const jobsCount = data?.meta?.count;
	const totalPages = data?.meta?.totalPages || 1;

	return (
		<Layout>
			<div className="container py-10">
				<button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
					<ArrowLeft size={16} />
					Back
				</button>
				<h1 className="font-display text-3xl font-bold">{category?.name} Jobs</h1>
				<p className="mt-1 text-muted-foreground">{jobsCount} open positions</p>

				{isPending ? (
					<div className="flex justify-center items-center gap-4 my-24">
						<Loader />
					</div>
				) : (
					<div className="mt-6 grid gap-4 md:grid-cols-2">
						{jobs?.map((job) => (
							<JobCard key={job._id} job={job} />
						))}
						{jobs?.length === 0 && (
							<div className="rounded-lg border bg-card p-12 text-center col-span-full">
								<p className="font-display text-lg font-semibold">No jobs in this category yet</p>
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
					</div>
				)}
			</div>
		</Layout>
	);
};

export default CategoryPageUI;
