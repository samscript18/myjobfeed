"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";
import { Controller, useForm } from "react-hook-form";
import { PostJob as PostJobType } from "@/lib/types";
import { JobLevel, JobType } from "@/lib/enums";
import { getJobCategories, postJob } from "@/lib/services/job.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Building2, CircleCheckBig, Circle, ClipboardList, Globe, BriefcaseBusiness, Sparkles } from "lucide-react";
import { isValidEmail, isValidURL } from "@/lib/helpers";

const PostJob = () => {
	const [submitted, setSubmitted] = useState(false);
	const {
		handleSubmit,
		register,
		formState: { errors },
		control,
		watch,
	} = useForm<PostJobType>({});

	const formValues = watch();
	const isFilled = (value?: string) => Boolean(value?.trim());
	const requiredChecks = [
		{ label: "Company name", done: isFilled(formValues.company) },
		{ label: "Job title", done: isFilled(formValues.title) },
		{ label: "Job type", done: Boolean(formValues.type) },
		{ label: "Job category", done: Boolean(formValues.categoryId) },
		{ label: "Job level", done: Boolean(formValues.level) },
		{ label: "Location", done: isFilled(formValues.location) },
		{ label: "Description", done: isFilled(formValues.description) },
		{ label: "Application method", done: isFilled(formValues.url) },
	];
	const completedSteps = requiredChecks.filter((item) => item.done).length;
	const completionPercent = Math.round((completedSteps / requiredChecks.length) * 100);
	const descriptionLength = formValues.description?.trim().length ?? 0;

	const { data: categories, isPending: isCategoriesPending } = useQuery({
		queryFn: () => getJobCategories(),
		queryKey: ["get-categories"],
	});
	const selectedCategory = categories?.find((item) => item._id === formValues.categoryId)?.name;

	const { mutateAsync: _postJob, isPending: jobPostPending } = useMutation({
		mutationKey: ["post-job"],
		mutationFn: postJob,
		onSuccess() {
			setSubmitted(true);
			toast.success("Job posted successfully");
		},
		onError(error) {
			toast.error(error.message);
		},
	});

	const submit = async (data: PostJobType) => {
		if (data.url && !isValidEmail(data.url) && !isValidURL(data.url)) {
			toast.error("Application method must be a valid email or URL");
			return;
		}

		if (!data.salaryRange?.length) {
			data.salaryRange = undefined;
		}

		await _postJob(data);
	};

	if (submitted) {
		return (
			<Layout>
				<div className="container py-14 sm:py-20">
					<div className="glass-strong mx-auto max-w-xl rounded-3xl border border-white/60 p-8 text-center sm:p-12">
						<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success/15 text-success">
							<CircleCheckBig className="h-9 w-9" />
						</div>
						<p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-success">Submission Complete</p>
						<h1 className="mt-3 text-balance text-3xl font-bold sm:text-4xl">Your job is now live</h1>
						<p className="mt-3 text-balance text-muted-foreground">Great work. Candidates can now discover your listing and apply instantly through your selected application method.</p>
						<div className="mt-7 rounded-2xl border border-border/60 bg-card/70 p-4 text-left">
							<p className="text-sm font-medium">Tip</p>
							<p className="mt-1 text-sm text-muted-foreground">Stronger descriptions and clear salary ranges usually attract more qualified applicants in less time.</p>
						</div>
					</div>
				</div>
			</Layout>
		);
	}

	return (
		<Layout>
			<div className="container py-8 sm:py-10">
				<div className="mx-auto max-w-6xl">
					<div className="glass-strong relative overflow-hidden rounded-3xl border border-white/60 p-4 md:p-6 lg:p-8">
						<div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-primary/20 blur-3xl" />
						<div className="pointer-events-none absolute -bottom-24 -left-24 h-60 w-60 rounded-full bg-accent/20 blur-3xl" />
						<div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
							<div>
								<p className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
									<Sparkles className="h-3.5 w-3.5 text-primary" />
									Fast & free listing
								</p>
								<h1 className="mt-3 text-balance text-4xl font-bold sm:text-5xl">Hire your next teammate</h1>
								<p className="mt-3 max-w-2xl text-balance text-sm text-muted-foreground sm:text-base">
									Publish a detailed job post in minutes. Clear role details and strong requirements usually bring in better applications.
								</p>
							</div>
							<div className="max-md:w-full rounded-2xl border border-border/70 bg-card/80 p-4">
								<p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Listing completion</p>
								<p className="mt-1 text-lg font-semibold">{completionPercent}% done</p>
								<div className="mt-3 h-2 w-52 rounded-full bg-muted/80">
									<div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${completionPercent}%` }} />
								</div>
								<p className="mt-2 text-xs text-muted-foreground">About 2 minutes to publish</p>
							</div>
						</div>
					</div>

					<div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
						<form onSubmit={handleSubmit(submit)} className="space-y-6">
							<fieldset className="glass surface-glow rounded-2xl border border-white/65 p-5 sm:p-6">
								<legend className="sr-only">Company Information</legend>
								<div className="mb-5 flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
										<Building2 className="h-5 w-5" />
									</div>
									<div>
										<h2 className="text-xl font-semibold">Company Information</h2>
										<p className="text-sm text-muted-foreground">Tell candidates who is hiring.</p>
									</div>
								</div>
								<div>
									<Label htmlFor="company">Company Name *</Label>
									<Input
										id="company"
										required
										className="mt-2 h-11 bg-card/70"
										placeholder="e.g. Atlas Systems"
										{...register("company", {
											required: {
												value: true,
												message: "Company name is required",
											},
										})}
										helperText={errors.company?.message}
									/>
								</div>
							</fieldset>

							<fieldset className="glass surface-glow rounded-2xl border border-white/65 p-5 sm:p-6">
								<legend className="sr-only">Job Details</legend>
								<div className="mb-5 flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
										<BriefcaseBusiness className="h-5 w-5" />
									</div>
									<div>
										<h2 className="text-xl font-semibold">Job Details</h2>
										<p className="text-sm text-muted-foreground">Define role type, category, and seniority.</p>
									</div>
								</div>

								<div>
									<Label htmlFor="title">Job Title *</Label>
									<Input
										id="title"
										required
										className="mt-2 h-11 bg-card/70"
										placeholder="e.g. Senior Frontend Engineer"
										{...register("title", {
											required: {
												value: true,
												message: "Job title is required",
											},
										})}
										helperText={errors.title?.message}
									/>
								</div>

								<div className="mt-4 grid gap-4 sm:grid-cols-2">
									<div>
										<Label>Job Type *</Label>
										<Controller
											name="type"
											control={control}
											rules={{ required: "Job type is required" }}
											render={({ field, fieldState }) => (
												<Select required onValueChange={field.onChange} defaultValue={field.value}>
													<SelectTrigger className="mt-2 h-11 bg-card/70" helperText={fieldState.error?.message}>
														<SelectValue placeholder="Select job type" className="capitalize" />
													</SelectTrigger>
													<SelectContent>
														{Object.values(JobType).map((type) => (
															<SelectItem key={type} value={type} className="capitalize">
																{type.replace("-", " ").toLowerCase()}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											)}
										/>
									</div>

									<div>
										<Label>Category *</Label>
										<Controller
											name="categoryId"
											control={control}
											rules={{ required: "Job category is required" }}
											render={({ field, fieldState }) => (
												<Select required onValueChange={field.onChange} defaultValue={field.value}>
													<SelectTrigger isLoading={isCategoriesPending} className="mt-2 h-11 bg-card/70" helperText={fieldState.error?.message}>
														<SelectValue placeholder="Select job category" className="capitalize" />
													</SelectTrigger>
													<SelectContent>
														{categories?.map((category) => (
															<SelectItem key={category._id} value={category._id} className="capitalize">
																{category.name}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											)}
										/>
									</div>
								</div>

								<div className="mt-4 grid gap-4 sm:grid-cols-2">
									<div>
										<Label htmlFor="location">Location *</Label>
										<Input
											id="location"
											required
											className="mt-2 h-11 bg-card/70"
											placeholder="e.g. Lagos, Nigeria"
											{...register("location", {
												required: {
													value: true,
													message: "Job location is required",
												},
											})}
											helperText={errors.location?.message}
										/>
									</div>

									<div>
										<Label htmlFor="salary">Salary Range</Label>
										<Input
											id="salary"
											placeholder="e.g. NGN 500,000 - 700,000/month"
											className="mt-2 h-11 bg-card/70"
											{...register("salaryRange", {
												required: false,
											})}
											helperText={errors.salaryRange?.message}
										/>
									</div>
								</div>

								<div className="mt-4">
									<Label>Job Level *</Label>
									<Controller
										name="level"
										control={control}
										rules={{ required: "Job level is required" }}
										render={({ field, fieldState }) => (
											<Select required onValueChange={field.onChange} defaultValue={field.value}>
												<SelectTrigger className="mt-2 h-11 bg-card/70" helperText={fieldState.error?.message}>
													<SelectValue placeholder="Select job level" className="capitalize" />
												</SelectTrigger>
												<SelectContent>
													{Object.values(JobLevel).map((level) => (
														<SelectItem key={level} value={level} className="capitalize">
															{level.replace("-", " ").toLowerCase()}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										)}
									/>
								</div>
							</fieldset>

							<fieldset className="glass surface-glow rounded-2xl border border-white/65 p-5 sm:p-6">
								<legend className="sr-only">Job Description</legend>
								<div className="mb-5 flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
										<ClipboardList className="h-5 w-5" />
									</div>
									<div>
										<h2 className="text-xl font-semibold">Job Description</h2>
										<p className="text-sm text-muted-foreground">Set expectations with responsibilities and must-haves.</p>
									</div>
								</div>
								<div>
									<Label htmlFor="desc">Description *</Label>
									<Textarea
										id="desc"
										required
										rows={8}
										className="mt-2 bg-card/70"
										placeholder="Describe the role, key responsibilities, must-have skills, and any benefits or culture details..."
										{...register("description", {
											required: {
												value: true,
												message: "Job description is required",
											},
										})}
										helperText={errors.description?.message}
									/>
									{/* <div className="mt-2 flex items-center justify-between text-xs">
										<p className="text-muted-foreground">Aim for at least 250 characters for better candidate clarity.</p>
										<p className={descriptionLength >= 250 ? "font-medium text-success" : "text-muted-foreground"}>{descriptionLength}/250</p>
									</div> */}
								</div>
							</fieldset>

							<fieldset className="glass surface-glow rounded-2xl border border-white/65 p-5 sm:p-6">
								<legend className="sr-only">Application Method</legend>
								<div className="mb-5 flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
										<Globe className="h-5 w-5" />
									</div>
									<div>
										<h2 className="text-xl font-semibold">Application Method</h2>
										<p className="text-sm text-muted-foreground">Where should candidates send applications?</p>
									</div>
								</div>

								<div>
									<Label htmlFor="apply">Application Link or Email *</Label>
									<Input
										id="apply"
										required
										className="mt-2 h-11 bg-card/70"
										placeholder="https://company.com/careers/frontend or hiring@company.com"
										{...register("url", {
											required: {
												value: true,
												message: "Job application link or email is required",
											},
										})}
										helperText={errors.url?.message}
									/>
								</div>
							</fieldset>

							<Button
								type="submit"
								disabled={jobPostPending}
								size="lg"
								className="h-12 w-full rounded-xl bg-accent text-base font-semibold text-accent-foreground shadow-lg shadow-accent/20 transition hover:bg-accent/90 cursor-pointer"
							>
								{jobPostPending ? "Publishing job..." : "Publish Job Listing"}
							</Button>
						</form>

						<aside className="glass-strong h-fit space-y-4 rounded-2xl border border-white/65 p-5 lg:sticky lg:top-24">
							<div className="rounded-xl border border-border/70 bg-card/80 p-4">
								<p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Listing health</p>
								<p className="mt-1 text-lg font-semibold">
									{completedSteps}/{requiredChecks.length} required fields completed
								</p>
								<div className="mt-3 h-2 rounded-full bg-muted/80">
									<div className="h-full rounded-full bg-accent transition-all duration-300" style={{ width: `${completionPercent}%` }} />
								</div>
							</div>

							<div>
								<h2 className="text-xl font-semibold">Posting Checklist</h2>
								<p className="mt-1 text-sm text-muted-foreground">Track your progress in real-time while completing the form.</p>
								<ul className="mt-4 space-y-2.5 text-sm">
									{requiredChecks.map((item) => (
										<li key={item.label} className="flex items-start gap-2">
											{item.done ? (
												<CircleCheckBig className="mt-0.5 h-4 w-4 shrink-0 text-success" />
											) : (
												<Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
											)}
											<span className={item.done ? "text-foreground" : "text-muted-foreground"}>{item.label}</span>
										</li>
									))}
								</ul>
							</div>

							<div className="rounded-xl border border-border/70 bg-card/80 p-4">
								<p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Live Preview</p>
								<p className="mt-2 line-clamp-2 text-base font-semibold">{formValues.title?.trim() || "Your job title appears here"}</p>
								<div className="mt-3 space-y-2 text-sm text-muted-foreground">
									<p>
										<span className="font-medium text-foreground">Company:</span> {formValues.company?.trim() || "Not set"}
									</p>
									<p>
										<span className="font-medium text-foreground">Category:</span> {selectedCategory || "Not set"}
									</p>
									<p>
										<span className="font-medium text-foreground">Location:</span> {formValues.location?.trim() || "Not set"}
									</p>
									<p>
										<span className="font-medium text-foreground">Application:</span> {formValues.url?.trim() || "Not set"}
									</p>
								</div>
							</div>

							<div className="rounded-xl border border-border/70 bg-card/80 p-4">
								<p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Best practice</p>
								<p className="mt-1 text-sm">Mention your hiring process timeline. It improves completion rate for qualified candidates.</p>
							</div>
						</aside>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default PostJob;
