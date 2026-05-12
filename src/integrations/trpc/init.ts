import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

import { prisma } from "#/db";

export type AppContext = {
	user: { id: string; email: string; name: string; role: string } | null;
};

export async function createContext({
	req,
}: {
	req: Request;
}): Promise<AppContext> {
	const cookie = req.headers.get("cookie") ?? "";
	const match = cookie
		.split(";")
		.map((p) => p.trim())
		.find((p) => p.startsWith("prod_log_session="));
	const token = match ? match.slice("prod_log_session=".length) : null;
	if (!token) return { user: null };

	const session = await prisma.session.findUnique({
		where: { id: token },
		include: { user: true },
	});
	if (!session || session.expiresAt.getTime() < Date.now())
		return { user: null };

	return {
		user: {
			id: session.user.id,
			email: session.user.email,
			name: session.user.name,
			role: session.user.role,
		},
	};
}

const t = initTRPC.context<AppContext>().create({
	transformer: superjson,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
	if (!ctx.user) {
		throw new TRPCError({ code: "UNAUTHORIZED", message: "Não autenticado" });
	}
	return next({ ctx: { ...ctx, user: ctx.user } });
});
