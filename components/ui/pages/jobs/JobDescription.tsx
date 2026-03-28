"use client";

import { parseJobDescriptionHtml } from "@/lib/utils/jobDescription";

const JobDescription = ({ rawHtml }: { rawHtml?: string }) => {
	const blocks = parseJobDescriptionHtml(rawHtml);

	if (!blocks.length) return null;

	return (
		<div className="job-description wrap-break-word text-sm leading-relaxed text-muted-foreground">
			{blocks.map((block, idx) => {
				if (block.type === "heading") {
					const mt = idx === 0 ? "mt-0" : "mt-5";
					return (
						<h3 key={idx} className={`${mt} font-display text-sm font-semibold text-foreground md:text-base`}>
							{block.text}
						</h3>
					);
				}

				if (block.type === "list") {
					const ListTag = block.ordered ? "ol" : "ul";
					const listClassName = block.ordered ? "list-decimal" : "list-disc";
					return (
						<ListTag key={idx} className={`mt-3 ${listClassName} space-y-1 pl-5`}>
							{block.items.map((item, i) => (
								<li key={i} className="whitespace-pre-line">
									{item}
								</li>
							))}
						</ListTag>
					);
				}

				return (
					<p key={idx} className="mt-2 whitespace-pre-line">
						{block.text}
					</p>
				);
			})}
		</div>
	);
};

export default JobDescription;
