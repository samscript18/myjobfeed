import { MapPin, Briefcase, Clock, DollarSign, ArrowLeft, ExternalLink, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import JobCard from "@/components/JobCard";
import { mockJobs } from "@/data/mock-data";
import Link from "next/link";
import { useParams } from "next/navigation";

const JobDetail = () => {
  const params = useParams();
  console.log(params)
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const job = mockJobs.find((j) => j.slug === slug);

  if (!job) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-display text-2xl font-bold">Job not found</h1>
          <Link href="/jobs"><Button className="mt-4" variant="outline">Back to Jobs</Button></Link>
        </div>
      </Layout>
    );
  }

  const relatedJobs = mockJobs.filter((j) => j.category === job.category && j.id !== job.id).slice(0, 3);

  return (
    <Layout>
      <div className="border-b bg-card">
        <div className="container py-4">
          <Link href="/jobs" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Back to Jobs
          </Link>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex-1">
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-display text-lg font-bold text-primary">
                  {job.companyLogo}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h1 className="font-display text-2xl font-bold">{job.title}</h1>
                    {job.featured && <Star className="h-5 w-5 fill-accent text-accent" />}
                  </div>
                  <p className="mt-1 text-muted-foreground">{job.company}</p>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{job.location}</span>
                    <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" />{job.type}</span>
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{job.postedAt}</span>
                    <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" />{job.salary}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="secondary">{job.category}</Badge>
                    <Badge variant="outline">{job.experience}</Badge>
                  </div>
                </div>
              </div>
              <Button size="lg" className="mt-6 w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold sm:w-auto">
                <ExternalLink className="mr-2 h-4 w-4" /> Apply Now
              </Button>
            </div>

            <div className="mt-6 space-y-6 rounded-lg border bg-card p-6">
              <div>
                <h2 className="font-display text-lg font-semibold">Job Description</h2>
                <p className="mt-2 text-muted-foreground leading-relaxed">{job.description}</p>
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold">Responsibilities</h2>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                  {job.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold">Requirements</h2>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                  {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold">Benefits</h2>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                  {job.benefits.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            </div>
          </div>

          <aside className="w-full shrink-0 lg:w-72">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-lg border bg-card p-5">
                <h3 className="font-display font-semibold">Job Overview</h3>
                <dl className="mt-4 space-y-3 text-sm">
                  <div><dt className="text-muted-foreground">Location</dt><dd className="font-medium">{job.location}</dd></div>
                  <div><dt className="text-muted-foreground">Job Type</dt><dd className="font-medium">{job.type}</dd></div>
                  <div><dt className="text-muted-foreground">Salary</dt><dd className="font-medium">{job.salary}</dd></div>
                  <div><dt className="text-muted-foreground">Experience</dt><dd className="font-medium">{job.experience}</dd></div>
                  <div><dt className="text-muted-foreground">Category</dt><dd className="font-medium">{job.category}</dd></div>
                </dl>
              </div>

              <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold lg:hidden">
                Apply Now
              </Button>
            </div>
          </aside>
        </div>

        {relatedJobs.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-xl font-bold">Related Jobs</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {relatedJobs.map((j) => <JobCard key={j.id} job={j} />)}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default JobDetail;
