export interface ResolvePaginationQuery {
	page?: string | number | null;
	limit?: string | number | null;
	count: number;
}

export interface ResolvedPagination {
	skip: number;
	page: number;
	limit: number;
	totalPages: number;
	count: number;
}