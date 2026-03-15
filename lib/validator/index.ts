import { z } from "zod";
import { JobLevel, JobType } from "../enums";

export const CreateJobSchema = z.object({
	title: z.string().trim().min(3, "Title is too short"),
	description: z.string().trim(),
	company: z.string().trim(),
	url: z
		.string()
		.trim()
		.refine(
			(val) => {
				const isUrl = z.string().url().safeParse(val).success;
				const isEmail = z.string().email().safeParse(val).success;
				return isUrl || isEmail;
			},
			{
				message: "Must be a valid URL or email address",
			},
		),
	location: z.string().trim(),
	salaryRange: z
		.string()
		.trim()
		.nullish()
		.transform((val) => val ?? undefined)
		.optional(),
	categoryId: z.string().trim(),
	type: z.nativeEnum(JobType),
	level: z.nativeEnum(JobLevel),
});
