export interface Job {
	id: string;
	slug: string;
	title: string;
	company: string;
	companyLogo: string;
	location: string;
	type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Internship';
	salary: string;
	category: string;
	experience: string;
	description: string;
	responsibilities: string[];
	requirements: string[];
	benefits: string[];
	postedAt: string;
	featured: boolean;
}

export const categories = [
	{ name: 'Technology', count: 342, icon: '💻' },
	{ name: 'Marketing', count: 187, icon: '📣' },
	{ name: 'Design', count: 124, icon: '🎨' },
	{ name: 'Finance', count: 98, icon: '💰' },
	{ name: 'Healthcare', count: 156, icon: '🏥' },
	{ name: 'Education', count: 89, icon: '📚' },
	{ name: 'Engineering', count: 213, icon: '⚙️' },
	{ name: 'Sales', count: 145, icon: '🤝' },
];

export const mockJobs: Job[] = [
	{
		id: '1',
		slug: 'senior-frontend-developer-techcorp',
		title: 'Senior Frontend Developer',
		company: 'TechCorp Nigeria',
		companyLogo: 'TC',
		location: 'Lagos, Nigeria',
		type: 'Full-time',
		salary: '₦650,000 - ₦900,000/mo',
		category: 'Technology',
		experience: '5+ years',
		description:
			'We are looking for a Senior Frontend Developer to join our growing team. You will be responsible for building and maintaining our web applications using modern technologies.',
		responsibilities: [
			'Lead frontend architecture decisions',
			'Build responsive, accessible UIs',
			'Mentor junior developers',
			'Collaborate with design and backend teams',
		],
		requirements: [
			'5+ years experience with React/TypeScript',
			'Strong CSS/Tailwind skills',
			'Experience with state management',
			'Excellent problem-solving skills',
		],
		benefits: ['Competitive salary', 'Remote work options', 'Health insurance', 'Annual bonus'],
		postedAt: '2 days ago',
		featured: true,
	},
	{
		id: '2',
		slug: 'product-designer-finova',
		title: 'Product Designer',
		company: 'Finova',
		companyLogo: 'FN',
		location: 'Abuja, Nigeria',
		type: 'Remote',
		salary: '₦500,000 - ₦700,000/mo',
		category: 'Design',
		experience: '3+ years',
		description:
			'Join our design team to create beautiful, user-centered financial products that impact millions of users across Africa.',
		responsibilities: [
			'Design end-to-end user experiences',
			'Create wireframes and prototypes',
			'Conduct user research',
			'Build and maintain design systems',
		],
		requirements: [
			'3+ years product design experience',
			'Proficiency in Figma',
			'Understanding of design systems',
			'Portfolio demonstrating UX skills',
		],
		benefits: ['Fully remote', 'Stock options', 'Learning budget', 'Flexible hours'],
		postedAt: '5 hours ago',
		featured: true,
	},
	{
		id: '3',
		slug: 'marketing-manager-growthbase',
		title: 'Marketing Manager',
		company: 'GrowthBase',
		companyLogo: 'GB',
		location: 'Lagos, Nigeria',
		type: 'Full-time',
		salary: '₦450,000 - ₦600,000/mo',
		category: 'Marketing',
		experience: '4+ years',
		description: 'Drive our marketing strategy and brand growth across digital channels.',
		responsibilities: [
			'Develop marketing strategies',
			'Manage social media presence',
			'Oversee content creation',
			'Analyze campaign performance',
		],
		requirements: [
			'4+ years marketing experience',
			'Digital marketing expertise',
			'Strong analytical skills',
			'Excellent communication',
		],
		benefits: ['Health insurance', 'Performance bonus', 'Team retreats', 'Career growth'],
		postedAt: '1 day ago',
		featured: false,
	},
	{
		id: '4',
		slug: 'backend-engineer-paystack',
		title: 'Backend Engineer',
		company: 'PayFlow',
		companyLogo: 'PF',
		location: 'Remote',
		type: 'Remote',
		salary: '₦800,000 - ₦1,200,000/mo',
		category: 'Technology',
		experience: '4+ years',
		description:
			'Build scalable payment infrastructure serving millions of transactions daily across Africa.',
		responsibilities: [
			'Design and build APIs',
			'Optimize database performance',
			'Implement security best practices',
			'Write comprehensive tests',
		],
		requirements: [
			'4+ years backend development',
			'Experience with Node.js or Go',
			'Database design skills',
			'Understanding of payment systems',
		],
		benefits: ['Top-tier salary', 'Remote-first', 'Equity', 'Home office budget'],
		postedAt: '3 days ago',
		featured: true,
	},
	{
		id: '5',
		slug: 'data-analyst-insight-labs',
		title: 'Data Analyst',
		company: 'Insight Labs',
		companyLogo: 'IL',
		location: 'Port Harcourt, Nigeria',
		type: 'Full-time',
		salary: '₦350,000 - ₦500,000/mo',
		category: 'Technology',
		experience: '2+ years',
		description: 'Transform raw data into actionable insights that drive business decisions.',
		responsibilities: [
			'Analyze large datasets',
			'Create dashboards and reports',
			'Identify trends and patterns',
			'Present findings to stakeholders',
		],
		requirements: [
			'Proficiency in SQL and Python',
			'Experience with BI tools',
			'Strong statistical knowledge',
			'Communication skills',
		],
		benefits: ['Learning opportunities', 'Flexible schedule', 'Health coverage', 'Team events'],
		postedAt: '1 week ago',
		featured: false,
	},
	{
		id: '6',
		slug: 'nurse-practitioner-medplus',
		title: 'Nurse Practitioner',
		company: 'MedPlus Healthcare',
		companyLogo: 'MP',
		location: 'Ibadan, Nigeria',
		type: 'Full-time',
		salary: '₦300,000 - ₦450,000/mo',
		category: 'Healthcare',
		experience: '3+ years',
		description: 'Provide quality healthcare services in a modern, patient-centered environment.',
		responsibilities: [
			'Patient assessment and care',
			'Administer treatments',
			'Maintain medical records',
			'Collaborate with medical team',
		],
		requirements: [
			'Valid nursing license',
			'3+ years clinical experience',
			'Strong interpersonal skills',
			'Attention to detail',
		],
		benefits: ['Medical coverage', 'Pension plan', 'Professional development', 'Shift allowances'],
		postedAt: '4 days ago',
		featured: false,
	},
];
