"use client";

import Layout from "@/components/Layout";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getJobCategories } from "@/lib/services/job.service";
import Loader from "@/components/Loader";
import { mockCategories } from "@/lib/data/mock-data";

const CategoriesPage = () => {
	const { data: categories, isPending } = useQuery({
		queryFn: () => getJobCategories(),
		queryKey: ["get-job-categories"],
	});

	return (
		<Layout>
			<div className="container py-10">
				<h1 className="font-display text-3xl font-bold">Job Categories</h1>
				<p className="mt-2 text-muted-foreground">Browse jobs by category</p>

				{isPending ? (
					<div className="flex justify-center items-center gap-4 my-24">
						<Loader />
					</div>
				) : (
					<div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{categories?.map((category) => (
							<Link key={category._id} href={`/category/${category._id}`}>
								<Card className="h-full p-6 cursor-pointer transition-all hover:shadow-lg hover:border-primary">
									<div className="text-4xl mb-3">{mockCategories.find((c) => c.name === category.slug)?.icon}</div>
									<h2 className="font-display text-lg font-semibold">{category.name}</h2>
									<p className="mt-2 text-sm text-muted-foreground">{category.jobCount} open positions</p>
								</Card>
							</Link>
						))}
					</div>
				)}
			</div>
		</Layout>
	);
};

export default CategoriesPage;
