import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchStreamLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { ReactNode } from "react";
import { toast } from "sonner";
import superjson from "superjson";
import { TRPCProvider } from "#/integrations/trpc/react";
import type { TRPCRouter } from "#/integrations/trpc/router";

function getUrl() {
	const base = (() => {
		if (typeof window !== "undefined") return "";
		return `http://localhost:${process.env.PORT ?? 3000}`;
	})();
	return `${base}/api/trpc`;
}

export const trpcClient = createTRPCClient<TRPCRouter>({
	links: [
		httpBatchStreamLink({
			transformer: superjson,
			url: getUrl(),
		}),
	],
});

function showApiError(error: unknown, fallback: string) {
	if (typeof window === "undefined") return;
	const message = error instanceof Error ? error.message : fallback;
	toast.error(message);
}

export function getContext() {
	const queryClient = new QueryClient({
		defaultOptions: {
			dehydrate: { serializeData: superjson.serialize },
			hydrate: { deserializeData: superjson.deserialize },
		},
		queryCache: new QueryCache({
			onError: (error, query) => {
				if (query.meta?.skipGlobalError) return;
				showApiError(error, "Falha ao carregar dados");
			},
		}),
		mutationCache: new MutationCache({
			onError: (error, _vars, _ctx, mutation) => {
				if (mutation.meta?.skipGlobalError) return;
				showApiError(error, "Falha ao salvar");
			},
		}),
	});

	const serverHelpers = createTRPCOptionsProxy({
		client: trpcClient,
		queryClient: queryClient,
	});
	const context = {
		queryClient,
		trpc: serverHelpers,
	};

	return context;
}

export default function TanstackQueryProvider({
	children,
	context,
}: {
	children: ReactNode;
	context: ReturnType<typeof getContext>;
}) {
	const { queryClient } = context;

	return (
		<TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
			{children}
		</TRPCProvider>
	);
}

declare module "@tanstack/react-query" {
	interface Register {
		queryMeta: { skipGlobalError?: boolean };
		mutationMeta: { skipGlobalError?: boolean };
	}
}
