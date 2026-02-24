import { Briefcase } from "lucide-react";
import Link from "next/link";

const Footer = () => (
  <footer className="border-t bg-card">
    <div className="container py-12">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold text-primary">
            <Briefcase className="h-5 w-5" />
            JobNest
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            Your gateway to finding the best career opportunities across Nigeria and beyond.
          </p>
        </div>
        <div>
          <h4 className="font-display font-semibold">For Job Seekers</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/jobs" className="hover:text-primary transition-colors">Browse Jobs</Link></li>
            <li><Link href="/category/technology" className="hover:text-primary transition-colors">Categories</Link></li>
            <li><Link href="/blog" className="hover:text-primary transition-colors">Career Blog</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold">For Employers</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/post-job" className="hover:text-primary transition-colors">Post a Job</Link></li>
            <li><Link href="/about" className="hover:text-primary transition-colors">Why JobNest</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} JobNest. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
