import type { Metadata } from "next";
import { manrope } from "@/lib/utils/fonts";
import "./globals.css";
import Providers from "@/lib/providers/providers";
import { Suspense } from "react";
import AppEffects from "@/components/AppEffects";

export const metadata: Metadata = {
	title: "MyJobFeed",
	description: "Your Dream Job Awaits. Discover thousands of opportunities from country's top companies. Start your career journey today.",
};

export const viewport = {
	width: "device-width",
	initialScale: 1,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${manrope.className} antialiased selection:bg-primary/20 selection:text-foreground`}>
				<Providers>
					<div className="site-chrome relative min-h-dvh overflow-x-clip">
						<div className="site-nebula pointer-events-none absolute inset-x-0 -top-72 h-136" />
						<div className="site-stars pointer-events-none absolute inset-0 -z-10" />
						<div className="site-parallax site-parallax--near pointer-events-none absolute inset-0 -z-10" />
						<div className="site-parallax site-parallax--far pointer-events-none absolute inset-0 -z-20" />
						<div className="cursor-spotlight pointer-events-none absolute inset-0 z-0" />
						<Suspense>
							<div className="page-stage relative z-10">
								<AppEffects>{children}</AppEffects>
							</div>
						</Suspense>
					</div>
				</Providers>
			</body>
		</html>
	);
}
