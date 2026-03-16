import { APP_URL } from "@/lib/constants/env";

export default function robots() {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
		},
		sitemap: `${APP_URL}/sitemap.xml`,
	};
}
