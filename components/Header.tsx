"use client";

import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const navLinks = [
	{ href: "/jobs", label: "Find Jobs" },
	{ href: "/category", label: "Categories" },
	// { href: "/blog", label: "Blog" },
	{ href: "/about", label: "About" },
	{ href: "/contact", label: "Contact" },
];

const Header = () => {
	const [mobileOpen, setMobileOpen] = useState(false);
	const pathname = usePathname() ?? "";

	return (
		<header className="sticky top-0 z-50 w-full">
			<div className="container flex h-16 items-center justify-between">
				<div className="glass-strong mt-3 flex h-14 w-full items-center justify-between rounded-2xl px-3 sm:px-5">
					<Logo />

					<nav className="hidden items-center gap-4 md:flex lg:gap-8">
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className={`rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-white/60 ${pathname.startsWith(link.href) ? "bg-white/70 text-primary" : "text-muted-foreground"}`}
							>
								{link.label}
							</Link>
						))}
					</nav>

					<div className="hidden items-center gap-3 md:flex">
						<Link href="/post-job">
							<Button className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg shadow-primary/30 cursor-pointer">Post a Job</Button>
						</Link>
					</div>

					<button type="button" className="rounded-xl bg-white/60 p-2 md:hidden" aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}>
						{mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
					</button>
				</div>
			</div>

			{mobileOpen && (
				<div className="glass-strong mx-4 mt-3 rounded-2xl p-4 md:hidden">
					<nav className="flex flex-col gap-2">
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								onClick={() => setMobileOpen(false)}
								className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-white/70 ${pathname.startsWith(link.href) ? "text-primary" : "text-muted-foreground"}`}
							>
								{link.label}
							</Link>
						))}
						<Link href="/post-job" onClick={() => setMobileOpen(false)}>
							<Button className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold cursor-pointer">Post a Job</Button>
						</Link>
					</nav>
				</div>
			)}
		</header>
	);
};

export default Header;
