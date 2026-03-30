import { JobSource } from "@/lib/enums";
import { Schema, model, models } from "mongoose";
import "./category";

const JobSchema = new Schema(
	{
		sourceId: { type: String, required: true, unique: true },
		source: {
			type: String,
			enum: JobSource,
			default: JobSource.MYJOBFEED,
			required: true,
		},
		slug: { type: String, required: true, unique: true, index: true },
		title: { type: String, required: true },
		company: { type: String, required: true },
		companySlug: { type: String, index: true },
		description: {
			type: String,
			required: false,
			default: "No description provided.",
		},
		level: {
			type: String,
			required: false,
			default: "Not Specified",
		},
		type: {
			type: String,
			required: false,
			default: "Not Specified",
		},
		categoryId: {
			type: Schema.Types.ObjectId,
			ref: "Category",
			required: false,
		},
		location: { type: String, default: "Remote" },
		locationSlug: { type: String, index: true },
		url: { type: String, required: true },
		salaryRange: {
			type: String,
			required: false,
			default: "Not Specified",
		},
		postedAt: { type: Date, required: true, default: Date.now },
		lastSyncedAt: { type: Date, default: Date.now },
	},
	{
		timestamps: true,
	},
);

const Job = models.Job || model("Job", JobSchema);
export default Job;
