import he from "he";

export type JobDescriptionBlock =
	| { type: "heading"; level: 1 | 2 | 3 | 4 | 5 | 6; text: string }
	| { type: "paragraph"; text: string }
	| { type: "list"; ordered: boolean; items: string[] };

function normalizeText(text: string) {
	return text
		.replace(/[ \t]+\n/g, "\n")
		.replace(/\n[ \t]+/g, "\n")
		.replace(/[ \t]{2,}/g, " ")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

function stripTags(html: string) {
	// Assumes `<br>` was already normalized to `\n` if you care about line breaks.
	return html.replace(/<[^>]+>/g, "").trim();
}

function stripTagsKeepNewlines(html: string) {
	return html.replace(/<[^>]+>/g, "").replace(/[ \t]+\n/g, "\n").trim();
}

export function parseJobDescriptionHtml(rawHtml?: string | null): JobDescriptionBlock[] {
	if (!rawHtml) return [];

	let decoded = he.decode(rawHtml);
	decoded = decoded.replace(/\r\n/g, "\n");
	decoded = decoded.replace(/<br\s*\/?>/gi, "\n");

	const blocks: JobDescriptionBlock[] = [];

	// Note: job descriptions tend to include simple markup like headings, paragraphs and lists.
	// We only support a small subset of tags to keep output predictable and safe.
	const blockRegex = /<(h[1-6]|p|ul|ol)\b[^>]*>([\s\S]*?)<\/\1>/gi;
	let lastIndex = 0;

	const pushBetweenText = (between: string) => {
		const cleaned = stripTagsKeepNewlines(between);
		if (!cleaned) return;

		const parts = cleaned.split(/\n{2,}/g).map((p) => normalizeText(p)).filter(Boolean);
		for (const part of parts) {
			blocks.push({ type: "paragraph", text: part });
		}
	};

	let match: RegExpExecArray | null;
	while ((match = blockRegex.exec(decoded))) {
		const between = decoded.slice(lastIndex, match.index);
		if (between && between.trim()) pushBetweenText(between);

		const tag = (match[1] as string).toLowerCase(); // h1..h6, p, ul, ol
		const inner = match[2] ?? "";

		if (tag.startsWith("h")) {
			const rawLevel = Number(tag.replace("h", ""));
			const headingLevel = (Number.isFinite(rawLevel) && rawLevel >= 1 && rawLevel <= 6 ? rawLevel : 2) as 1 | 2 | 3 | 4 | 5 | 6;
			blocks.push({ type: "heading", level: headingLevel, text: normalizeText(stripTags(inner)) });
		} else if (tag === "p") {
			blocks.push({ type: "paragraph", text: normalizeText(stripTagsKeepNewlines(inner)) });
		} else if (tag === "ul" || tag === "ol") {
			const ordered = tag === "ol";
			const items: string[] = [];

			const liRegex = /<li\b[^>]*>([\s\S]*?)<\/li>/gi;
			let li: RegExpExecArray | null;
			while ((li = liRegex.exec(inner))) {
				const itemHtml = li[1] ?? "";
				const itemText = normalizeText(stripTagsKeepNewlines(itemHtml));
				if (itemText) items.push(itemText);
			}

			if (items.length) {
				blocks.push({ type: "list", ordered, items });
			} else {
				// Fallback if markup isn't exactly what we expect.
				const text = normalizeText(stripTagsKeepNewlines(inner));
				if (text) blocks.push({ type: "paragraph", text });
			}
		}

		lastIndex = blockRegex.lastIndex;
	}

	const tail = decoded.slice(lastIndex);
	if (tail && tail.trim()) pushBetweenText(tail);

	if (!blocks.length) {
		const text = normalizeText(stripTagsKeepNewlines(decoded));
		if (text) blocks.push({ type: "paragraph", text });
	}

	return blocks;
}

