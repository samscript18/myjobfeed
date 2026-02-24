import Layout from "@/components/Layout";
import JobCard from "@/components/JobCard";
import { mockJobs, categories } from "@/data/mock-data";
import { useParams } from "next/navigation";

const CategoryPage = () => {
  const params = useParams();
  const category = params ? params.category : undefined;
  const categoryString = Array.isArray(category) ? category[0] : category;
  const catName = categories.find((c) => c.name.toLowerCase() === categoryString?.toLowerCase())?.name || categoryString || "";
  const jobs = mockJobs.filter((j) => j.category.toLowerCase() === categoryString?.toLowerCase());

  return (
    <Layout>
      <div className="container py-10">
        <h1 className="font-display text-3xl font-bold">{catName} Jobs</h1>
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
