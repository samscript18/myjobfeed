"use client";

import Layout from "@/components/Layout";
import JobCard from "@/components/JobCard";
import { getJobs } from "@/lib/services/job.service";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loader";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pagination } from "../pagination";
import { Job } from "@/lib/interfaces/job.interface";

interface InitialJobsResponse {
	success: boolean;
	message: string;
	data: Job[];
	meta: {
		count: number;
		page: number;
		totalPages: number;
		limit: number;
	};
}

const CategoryPageUI = ({ categoryId, categoryName, initialJobsResponse }: { categoryId: string; categoryName: string; initialJobsResponse: InitialJobsResponse }) => {
	const router = useRouter();
	const [page, setPage] = useState<number>(1);

	const { data, isPending } = useQuery({
		queryFn: () => getJobs({ category: categoryId, page, limit: initialJobsResponse.meta.limit }),
		queryKey: ["get-category-jobs", categoryId, page],
		initialData: page === 1 ? initialJobsResponse : undefined,
		placeholderData: keepPreviousData,
		staleTime: 60_000,
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
				<h1 className="font-display text-3xl font-bold">{categoryName} Jobs</h1>
				<p className="mt-1 text-muted-foreground min-h-6">{jobsCount} open positions</p>

				{isPending ? (
					<div className="flex justify-center items-center gap-4 my-24">
						<Loader />
					</div>
				) : (
					<>
						<div className="mt-6 grid gap-4 md:grid-cols-2">
							{jobs?.map((job) => (
								<JobCard key={job._id} job={job} />
							))}
							{jobs?.length === 0 && (
								<div className="rounded-lg border bg-card p-12 text-center col-span-full">
									<p className="font-display text-lg font-semibold">No jobs in this category yet</p>
								</div>
							)}
						</div>
						{totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={(newPage) => setPage(newPage)} />}
					</>
				)}
			</div>
		</Layout>
	);
};

export default CategoryPageUI;
