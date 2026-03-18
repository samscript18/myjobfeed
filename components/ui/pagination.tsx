import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPagination } from "@/lib/utils";

type PaginationProps = {
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	className?: string;
};

export const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange, className = "" }) => {
	if (totalPages <= 1) return null;

	const handleChange = (newPage: number) => {
		onPageChange(newPage);
		window.scrollTo(0, 0);
	};

	return (
		<div className={`flex flex-wrap justify-center items-center gap-2 my-10 ${className}`}>
			<Button variant="outline" size="icon" disabled={page === 1} onClick={() => handleChange(page - 1)}>
				<ChevronLeft className="h-4 w-4" />
			</Button>

			{getPagination(page, totalPages).map((item, index) =>
				item === "..." ? (
					<span key={`ellipsis-${index}`} className="px-2 text-gray-500">
						...
					</span>
				) : (
					<Button key={`page-${item}-${index}`} variant={page === item ? "default" : "outline"} className="h-9 w-9 cursor-pointer" onClick={() => handleChange(item as number)}>
						{item}
					</Button>
				),
			)}

			<Button variant="outline" size="icon" disabled={page === totalPages} onClick={() => handleChange(page + 1)}>
				<ChevronRight className="h-4 w-4" />
			</Button>
		</div>
	);
};
