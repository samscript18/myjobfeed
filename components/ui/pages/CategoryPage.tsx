'use client';

import Layout from "@/components/Layout";
import JobCard from "@/components/JobCard";
import { getCategory, getJobs } from "@/lib/services/job.service";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loader";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const CategoryPage = ({ categoryId }: { categoryId: string }) => {
  const { data: category } = useQuery({
    queryFn: () =>
      getCategory(categoryId),
    queryKey: ['get-category', categoryId],
  });

  const { data: jobs, isPending } = useQuery({
    queryFn: () =>
      getJobs({ category: categoryId }),
    queryKey: ['get-category-jobs', categoryId],
  });
  const router = useRouter();

  return (
    <Layout>
      <div className="container py-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <h1 className="font-display text-3xl font-bold">{category?.name} Jobs</h1>
        <p className="mt-1 text-muted-foreground">{jobs?.length ?? 0} open positions</p>

        {isPending ? (
          <div className="flex justify-center items-center gap-4 my-24">
            <Loader />
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {jobs?.map((job) => <JobCard key={job._id} job={job} />)}
            {jobs?.length === 0 && (
              <div className="rounded-lg border bg-card p-12 text-center col-span-full">
                <p className="font-display text-lg font-semibold">No jobs in this category yet</p>
              </div>
            )}
          </div>)}
      </div>
    </Layout>
  );
};

export default CategoryPage;
