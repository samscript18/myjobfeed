import Link from "next/link";
import Logo from "./Logo";

const Footer = () => (
	<footer className="mt-12">
		<div className="container glass rounded-3xl px-5 pt-10 pb-6 sm:px-8">
			<div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				<div>
					<Logo />
					<p className="mt-3 text-sm text-muted-foreground">Your gateway to finding the best career opportunities across your country and beyond.</p>
				</div>
				<div>
					<h4 className="font-display font-semibold">For Job Seekers</h4>
					<ul className="mt-3 space-y-2 text-sm text-muted-foreground">
						<li>
							<Link href="/jobs" className="hover:text-primary transition-colors">
								Browse Jobs
							</Link>
						</li>
						<li>
							<Link href="/category" className="hover:text-primary transition-colors">
								Categories
							</Link>
						</li>
						{/* <li><Link href="/blog" className="hover:text-primary transition-colors">Career Blog</Link></li> */}
					</ul>
				</div>
				<div>
					<h4 className="font-display font-semibold">For Employers</h4>
					<ul className="mt-3 space-y-2 text-sm text-muted-foreground">
						<li>
							<Link href="/post-job" className="hover:text-primary transition-colors">
								Post a Job
							</Link>
						</li>
						<li>
							<Link href="/about" className="hover:text-primary transition-colors">
								Why MyJobFeed
							</Link>
						</li>
					</ul>
				</div>
				<div>
					<h4 className="font-display font-semibold">Company</h4>
					<ul className="mt-3 space-y-2 text-sm text-muted-foreground">
						<li>
							<Link href="/about" className="hover:text-primary transition-colors">
								About Us
							</Link>
						</li>
						<li>
							<Link href="/contact" className="hover:text-primary transition-colors">
								Contact
							</Link>
						</li>
						<li>
							<Link href="/privacy-policy" className="hover:text-primary transition-colors">
								Privacy Policy
							</Link>
						</li>
						<li>
							<Link href="/terms" className="hover:text-primary transition-colors">
								Terms of Service
							</Link>
						</li>
					</ul>
				</div>
			</div>
			<div className="mt-10 border-t border-white/60 pt-6 text-center text-sm text-muted-foreground">© {new Date().getFullYear()} MyJobFeed. All rights reserved.</div>
		</div>
	</footer>
);

export default Footer;
