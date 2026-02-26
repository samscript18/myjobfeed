'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";
import { useToast } from "@/lib/hooks/use-toast";

const PostJob = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast({ title: "Job submitted!", description: "Your job will be reviewed and published shortly." });
  };

  if (submitted) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <div className="mx-auto max-w-md">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success text-3xl">✓</div>
            <h1 className="mt-6 font-display text-2xl font-bold">Job Submitted!</h1>
            <p className="mt-2 text-muted-foreground">Your job posting is under review. You&#39;ll receive an email confirmation shortly.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-10">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-3xl font-bold">Post a Job</h1>
          <p className="mt-1 text-muted-foreground">No account required. Fill in the details and submit.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            <fieldset className="space-y-4 rounded-lg border bg-card p-6">
              <legend className="font-display text-lg font-semibold px-1">Company Information</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label htmlFor="company">Company Name *</Label><Input id="company" required className="mt-1.5" /></div>
                <div><Label htmlFor="website">Website</Label><Input id="website" type="url" className="mt-1.5" /></div>
              </div>
              <div><Label htmlFor="email">Contact Email *</Label><Input id="email" type="email" required className="mt-1.5" /></div>
            </fieldset>

            <fieldset className="space-y-4 rounded-lg border bg-card p-6">
              <legend className="font-display text-lg font-semibold px-1">Job Details</legend>
              <div><Label htmlFor="title">Job Title *</Label><Input id="title" required className="mt-1.5" /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Job Type *</Label>
                  <Select required>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      {["Full-time", "Part-time", "Contract", "Remote", "Internship"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Category *</Label>
                  <Select required>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {["Technology", "Marketing", "Design", "Finance", "Healthcare", "Education", "Engineering", "Sales"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label htmlFor="location">Location *</Label><Input id="location" required className="mt-1.5" /></div>
                <div><Label htmlFor="salary">Salary Range</Label><Input id="salary" placeholder="e.g. ₦500,000 - ₦700,000/mo" className="mt-1.5" /></div>
              </div>
            </fieldset>

            <fieldset className="space-y-4 rounded-lg border bg-card p-6">
              <legend className="font-display text-lg font-semibold px-1">Job Description</legend>
              <div><Label htmlFor="desc">Description *</Label><Textarea id="desc" required rows={6} className="mt-1.5" placeholder="Describe the role, responsibilities, and ideal candidate..." /></div>
            </fieldset>

            <fieldset className="space-y-4 rounded-lg border bg-card p-6">
              <legend className="font-display text-lg font-semibold px-1">Application Method</legend>
              <div><Label htmlFor="apply">Application Link or Email *</Label><Input id="apply" required className="mt-1.5" placeholder="https://... or email@company.com" /></div>
            </fieldset>

            <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
              Submit Job Posting
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default PostJob;
