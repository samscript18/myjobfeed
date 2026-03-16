import type { Metadata } from "next";
import { manrope } from "@/lib/utils/fonts";
import "./globals.css";
import Providers from "@/lib/providers/providers";
import { Suspense } from "react";

export const metadata: Metadata = {
	title: "MyJobFeed",
	description: "Your Dream Job Awaits. Discover thousands of opportunities from country's top companies. Start your career journey today.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${manrope.className} antialiased`}>
				<Providers>
					<Suspense>{children}</Suspense>
				</Providers>
			</body>
		</html>
	);
}
