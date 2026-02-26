import Layout from "@/components/Layout";
import JobCard from "@/components/JobCard";
import { mockJobs, categories } from "@/lib/data/mock-data";

interface CategoryProps {
  categorySlug: string;
}

const CategoryPage = ({ categorySlug }: CategoryProps) => {
  const jobs = mockJobs.filter((job) => job.category.toLowerCase() === categorySlug.toLowerCase());
  const category = categories.find((category) => category.name.toLowerCase() === categorySlug.toLowerCase());

  return (
    <Layout>
      <div className="container py-10">
        <h1 className="font-display text-3xl font-bold">{category?.name} Jobs</h1>
        <p className="mt-1 text-muted-foreground">{jobs.length} open positions</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {jobs.map((job) => <JobCard key={job.id} job={job} />)}
          {jobs.length === 0 && (
            <div className="rounded-lg border bg-card p-12 text-center col-span-full">
              <p className="font-display text-lg font-semibold">No jobs in this category yet</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
