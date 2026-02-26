import JobDetail from "@/components/ui/pages/jobs/JobDetail"

interface JobDetailsPageProps {
  params: Promise<{
    jobSlug: string;
  }>;
}

const JobDetailsPage = async ({ params }: JobDetailsPageProps) => {
  const { jobSlug } = await params;
  return <JobDetail jobSlug={jobSlug} />;
}
export default JobDetailsPage;
