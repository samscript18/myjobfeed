import JobDetail from "@/components/ui/pages/jobs/JobDetail";
import { Metadata } from "next";
import dbConnect from "@/lib/db/mongodb";
import Job from "@/lib/db/models/job";
import { APP_URL } from "@/lib/constants/env";

interface JobDetailsPageProps {
	params: Promise<{
		jobSlug: string;
	}>;
}

const JobDetailsPage = async ({ params }: JobDetailsPageProps) => {
	const { jobSlug } = await params;
	await dbConnect();

	const job = await Job.findOne({ slug: jobSlug }).select("title description company location createdAt expiryDate type slug").lean();

	if (!job) return <div>Job not found</div>;

	const structuredData = {
		"@context": "https://schema.org",
		"@type": "JobPosting",
		title: job.title,
		description: job.description?.replace(/<[^>]*>/g, ""),
		datePosted: job.createdAt,
		validThrough: job.expiryDate,
		employmentType: job.type,
		hiringOrganization: {
			"@type": "Organization",
			name: job.company,
		},
		jobLocation: {
			"@type": "Place",
			address: {
				"@type": "PostalAddress",
				addressLocality: job.location,
			},
		},
		directApply: true,
		url: `${APP_URL}/jobs/${job.slug}`,
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(structuredData),
				}}
			/>

			<JobDetail jobSlug={jobSlug} />
		</>
	);
};
export default JobDetailsPage;

export async function generateMetadata({ params }: JobDetailsPageProps): Promise<Metadata> {
	const { jobSlug } = await params;

	await dbConnect();

	const job = await Job.findOne({ slug: jobSlug }).select("title company description slug").lean();

	if (!job) {
		return {
			title: "Job not found | MyJobFeed",
		};
	}

	const description = job.description?.replace(/<[^>]*>/g, "").slice(0, 160) || `${job.title} job at ${job.company}`;

	return {
		title: `${job.title} at ${job.company} | MyJobFeed`,
		description,
		alternates: {
			canonical: `${APP_URL}/jobs/${job.slug}`,
		},
		openGraph: {
			title: `${job.title} at ${job.company}`,
			description,
			type: "article",
			url: `${APP_URL}/jobs/${job.slug}`,
		},
		twitter: {
			card: "summary_large_image",
			title: `${job.title} at ${job.company}`,
			description,
		},
	};
}
