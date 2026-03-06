'use client';

import { useState } from "react";
import { Search, MapPin, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/Layout";
import JobCard from "@/components/JobCard";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getJobs } from "@/lib/services/job.service";
import Loader from "@/components/Loader";

// const jobTypes = ["All Types", "Full-time", "Part-time", "Contract", "Remote", "Internship"];
const experienceLevels = ["All Levels", "Entry Level", "2+ years", "3+ years", "4+ years", "5+ years"];

const Jobs = () => {
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams?.get("keyword") || "");
  const [location, setLocation] = useState(searchParams?.get("location") || "");
  // const [jobType, setJobType] = useState("All Types");
  const [showFilters, setShowFilters] = useState(false);

  const { data: jobs, isPending } = useQuery({
    queryFn: () =>
      getJobs({ keyword, location }),
    queryKey: ['get-jobs', keyword, location],
  });

  // const jobs? = jobs?.filter((job) => {
  //   const matchesKeyword = !keyword || job.title.toLowerCase().includes(keyword.toLowerCase()) || job.company.toLowerCase().includes(keyword.toLowerCase());
  //   const matchesLocation = !location || job.location.toLowerCase().includes(location.toLowerCase());
  //   // const matchesType = jobType === "All Types" || job.type === jobType;
  //   return matchesKeyword && matchesLocation;
  // }) || [];


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

      <div className="container py-8">
        <div className="flex gap-8">
          <aside className={`${showFilters ? "block" : "hidden"} w-full shrink-0 md:block md:w-56`}>
            <div className="sticky top-24 space-y-6">
              <div className="flex items-center justify-between md:hidden">
                <h3 className="font-display font-semibold">Filters</h3>
                <button onClick={() => setShowFilters(false)}><X className="h-5 w-5" /></button>
              </div>
              {/* <div>
                <label className="text-sm font-medium">Job Type</label>
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {jobTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div> */}
              <div>
                <label className="text-sm font-medium">Experience</label>
                <Select defaultValue="All Levels">
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select defaultValue="All Categories">
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Date Posted</label>
                <Select defaultValue="Any Date">
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <p className="mb-4 text-sm text-muted-foreground">{jobs?.length} jobs found</p>
            <div className="grid gap-4">
              {isPending ? (
                <div className="flex justify-center items-center gap-4 my-24">
                  <Loader />
                </div>
              ) : (
                <>
                  {
                    jobs?.map((job) => (
                      <JobCard key={job._id} job={job} />
                    ))
                  }
                  {jobs?.length === 0 && (
                    <div className="rounded-lg border bg-card p-12 text-center">
                      <p className="font-display text-lg font-semibold">No jobs found</p>
                      <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filters</p>
                    </div>
                  )}
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Jobs;
