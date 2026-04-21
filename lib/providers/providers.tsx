"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as SonnerToaster } from "sonner";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 60 * 1000,
			gcTime: 2 * 60 * 1000,
			refetchOnWindowFocus: false,
			refetchOnReconnect: false,
			retry: 1,
		},
	},
});

const Providers = ({ children }: React.PropsWithChildren) => {
	return (
		<QueryClientProvider client={queryClient}>
			<SonnerToaster position="top-right" />
			{children}
		</QueryClientProvider>
	);
};

export default Providers;
