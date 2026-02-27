import { JobSource } from '@/lib/enums';
import { Schema, Types, model, models } from 'mongoose';

const JobSchema = new Schema(
	{
		sourceId: { type: String, required: true, unique: true },
		source: {
			type: String,
			enum: JobSource,
			default: JobSource.MYJOBFEED,
			required: true,
		},
		slug: { type: String, required: true },
		title: { type: String, required: true },
		company: { type: String, required: true },
		description: { type: String, required: true, default: 'No description provided.' },
		level: { type: String, required: false, default: 'Not Specified' },
		categoryId: { type: Types.ObjectId, required: false },
		location: { type: String, default: 'Remote' },
		url: { type: String, required: true },
		postedAt: { type: Date, required: true },
		lastSyncedAt: { type: Date, default: Date.now },
	},
	{
		timestamps: true,
	},
);

const Job = models.Job || model('Job', JobSchema);
export default Job;
