import { Schema, model, models } from 'mongoose';

const JobSchema = new Schema(
	{
		sourceId: { type: String, required: true, unique: true },
		source: { type: String, enum: ['themuse', 'arbeitnow'], required: true },
		slug: { type: String, required: true },
		title: { type: String, required: true },
		company: { type: String, required: true },
		level: { type: String, required: false, default: 'Not Specified' },
		category: { type: String, required: false },
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
