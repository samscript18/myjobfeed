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
import { useRouter } from "next/navigation";

const PostJob = () => {
	const router = useRouter();
	const [submitted, setSubmitted] = useState(false);
	const {
		handleSubmit,
		register,
		formState: { errors },
		control,
	} = useForm<PostJobType>({});

	const { data: categories, isPending: isCategoriesPending } = useQuery({
		queryFn: () => getJobCategories(),
		queryKey: ["get-categories"],
	});

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
		if (!data.salaryRange?.length) {
			data.salaryRange = undefined;
		}

		await _postJob(data);
	};

	if (submitted) {
		return (
			<Layout>
				<div className="container py-20 text-center">
					<div className="mx-auto max-w-md">
						<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success text-3xl">✓</div>
						<h1 className="mt-6 font-display text-2xl font-bold">Job Submitted!</h1>
						<p className="mt-2 text-muted-foreground">Your job posting is live. Await applications from job seekers.</p>
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

					<form onSubmit={handleSubmit(submit)} className="mt-8 space-y-8">
						<fieldset className="space-y-4 rounded-lg border bg-card p-6">
							<legend className="font-display text-lg font-semibold px-1">Company Information</legend>
							<div className="w-full">
								<div>
									<Label htmlFor="company">Company Name *</Label>
									<Input
										id="company"
										required
										className="mt-1.5"
										{...register("company", {
											required: {
												value: true,
												message: "Company name is required",
											},
										})}
										helperText={errors.company?.message}
									/>
								</div>
							</div>
						</fieldset>

						<fieldset className="space-y-4 rounded-lg border bg-card p-6">
							<legend className="font-display text-lg font-semibold px-1">Job Details</legend>
							<div>
								<Label htmlFor="title">Job Title *</Label>
								<Input
									id="title"
									required
									className="mt-1.5"
									{...register("title", {
										required: {
											value: true,
											message: "Job title is required",
										},
									})}
									helperText={errors.title?.message}
								/>
							</div>
							<div className="grid gap-4 sm:grid-cols-2">
								<div>
									<Label>Job Type *</Label>
									<Controller
										name="type"
										control={control}
										render={({ field, fieldState }) => (
											<Select required onValueChange={field.onChange} defaultValue={field.value}>
												<SelectTrigger className="mt-1.5" helperText={fieldState.error?.message}>
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
										render={({ field, fieldState }) => (
											<Select required onValueChange={field.onChange} defaultValue={field.value}>
												<SelectTrigger isLoading={isCategoriesPending} className="mt-1.5" helperText={fieldState.error?.message}>
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
							<div className="grid gap-4 sm:grid-cols-2">
								<div>
									<Label htmlFor="location">Location *</Label>
									<Input
										id="location"
										required
										className="mt-1.5"
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
										placeholder="e.g. ₦500,000 - ₦700,000/mo"
										className="mt-1.5"
										{...register("salaryRange", {
											required: false,
										})}
										helperText={errors.salaryRange?.message}
									/>
								</div>
							</div>
							<div>
								<Label>Job Level *</Label>
								<Controller
									name="level"
									control={control}
									render={({ field, fieldState }) => (
										<Select required onValueChange={field.onChange} defaultValue={field.value}>
											<SelectTrigger className="mt-1.5" helperText={fieldState.error?.message}>
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

						<fieldset className="space-y-4 rounded-lg border bg-card p-6">
							<legend className="font-display text-lg font-semibold px-1">Job Description</legend>
							<div>
								<Label htmlFor="desc">Description *</Label>
								<Textarea
									id="desc"
									required
									rows={6}
									className="mt-1.5"
									placeholder="Describe the role, responsibilities, and ideal candidate..."
									{...register("description", {
										required: {
											value: true,
											message: "Job description is required",
										},
									})}
									helperText={errors.description?.message}
								/>
							</div>
						</fieldset>

						<fieldset className="space-y-4 rounded-lg border bg-card p-6">
							<legend className="font-display text-lg font-semibold px-1">Application Method</legend>
							<div>
								<Label htmlFor="apply">Application Link or Email *</Label>
								<Input
									id="apply"
									required
									className="mt-1.5"
									placeholder="https://... or email@company.com"
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

						<Button type="submit" disabled={jobPostPending} size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
							{jobPostPending ? "Posting" : "Post Job"}
						</Button>
					</form>
				</div>
			</div>
		</Layout>
	);
};

export default PostJob;
