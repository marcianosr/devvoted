import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";

type ProvidersProps = {
	children: React.ReactNode;
	queryClient?: QueryClient;
};

export const createQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
				staleTime: 0,
				refetchOnWindowFocus: false,
			},
			mutations: {
				retry: false,
			},
		},
	});

export const Providers = ({ children, queryClient }: ProvidersProps) => (
	<QueryClientProvider client={queryClient ?? createQueryClient()}>
		{children}
	</QueryClientProvider>
);

type CustomRenderOptions = {
	queryClient?: QueryClient;
} & Omit<RenderOptions, "wrapper">;

export const renderWithProviders = (
	ui: ReactElement,
	options: CustomRenderOptions = {}
) => {
	const { queryClient, ...renderOptions } = options;

	return render(ui, {
		wrapper: ({ children }) => (
			<Providers queryClient={queryClient}>{children}</Providers>
		),
		...renderOptions,
	});
};

// Re-export everything
export * from "@testing-library/react";
