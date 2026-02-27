import { z } from 'zod';

export const CreateJobSchema = z.object({
	title: z.string(),
  company: z.string(),
	url: z.string().url(),
	location: z.string().optional(),
	categoryId: z.string().optional(),
	level: z.string().optional(),
	description: z.string().optional(),
});
