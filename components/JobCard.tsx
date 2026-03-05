import { MapPin, Clock, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Job } from "@/lib/interfaces/job.interface";

const JobCard = ({ job }: { job: Job }) => (
  <Link href={`/jobs/${job.slug}`} className="job-card block rounded-lg border bg-card p-5 transition-colors">
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-display text-sm font-bold text-primary">
        {''}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-base font-semibold truncate">{job.title}</h3>
          {/* {job.featured && <Star className="h-4 w-4 shrink-0 fill-accent text-accent" />} */}
        </div>
        <p className="text-sm text-muted-foreground">{job.company}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
          <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{job.level}</span>
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{new Date(job.createdAt).toDateString()}</span>
        </div>
        <div className="mt-3 flex flex-col items-start gap-3">
          <Badge variant="secondary" className="text-xs font-medium">{job.categoryId}</Badge>
          <span className="text-sm font-semibold text-primary">{job.company}</span>
        </div>
      </div>
    </div>
  </Link>
);

export default JobCard;
