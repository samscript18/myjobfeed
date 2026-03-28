import { Zap } from "lucide-react";
import Link from "next/link";

export default function Logo({ isLoading }: { isLoading?: boolean }) {
	return isLoading ? (
		<div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 transition-transform group-hover:scale-105 animate-spin">
			<Zap className="h-5 w-5 fill-white text-white" />
			<div className="absolute -inset-1 rounded-xl border border-primary/20 scale-110 group-hover:scale-125 transition-transform duration-500" />
		</div>
	) : (
		<Link href="/" className="group flex items-center gap-2.5">
			<div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
				<Zap className="h-5 w-5 fill-white text-white" />
				<div className="absolute -inset-1 rounded-xl border border-primary/20 scale-110 group-hover:scale-125 transition-transform duration-500" />
			</div>
			<span className="text-xl font-bold tracking-tight">
				<span className="text-foreground">MyJob</span>
				<span className="text-primary">Feed</span>
			</span>
		</Link>
	);
}