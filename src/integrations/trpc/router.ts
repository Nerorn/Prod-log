import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { prisma } from "#/db";
import { hashPassword } from "#/lib/auth";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "./init";

const authRouter = {
	me: publicProcedure.query(({ ctx }) => ctx.user),
} satisfies TRPCRouterRecord;

const productCreateInput = z.object({
	sku: z.string().trim().min(1, "SKU obrigatório").max(64),
	name: z.string().trim().min(1, "Nome obrigatório").max(120),
	description: z.string().trim().max(500).optional().nullable(),
	priceCents: z.number().int().min(0),
	stock: z.number().int().min(0),
});

const productsRouter = {
	list: protectedProcedure.query(() =>
		prisma.product.findMany({ orderBy: { createdAt: "desc" } }),
	),
	create: protectedProcedure.input(productCreateInput).mutation(({ input }) =>
		prisma.product.create({
			data: {
				sku: input.sku,
				name: input.name,
				description: input.description ?? null,
				priceCents: input.priceCents,
				stock: input.stock,
			},
		}),
	),
	update: protectedProcedure
		.input(productCreateInput.extend({ id: z.string().min(1) }))
		.mutation(({ input }) =>
			prisma.product.update({
				where: { id: input.id },
				data: {
					sku: input.sku,
					name: input.name,
					description: input.description ?? null,
					priceCents: input.priceCents,
					stock: input.stock,
				},
			}),
		),
	delete: protectedProcedure
		.input(z.object({ id: z.string().min(1) }))
		.mutation(({ input }) =>
			prisma.product.delete({ where: { id: input.id } }),
		),
} satisfies TRPCRouterRecord;

const userBaseInput = z.object({
	email: z.string().email("E-mail inválido").max(120),
	name: z.string().trim().min(1, "Nome obrigatório").max(120),
	role: z.enum(["admin", "user"]).default("user"),
});

const usersRouter = {
	list: protectedProcedure.query(() =>
		prisma.user.findMany({
			orderBy: { createdAt: "desc" },
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
				createdAt: true,
				updatedAt: true,
			},
		}),
	),
	create: protectedProcedure
		.input(
			userBaseInput.extend({
				password: z.string().min(6, "Senha mínima de 6 caracteres"),
			}),
		)
		.mutation(async ({ input }) => {
			const passwordHash = await hashPassword(input.password);
			return prisma.user.create({
				data: {
					email: input.email,
					name: input.name,
					role: input.role,
					passwordHash,
				},
				select: {
					id: true,
					email: true,
					name: true,
					role: true,
					createdAt: true,
					updatedAt: true,
				},
			});
		}),
	update: protectedProcedure
		.input(
			userBaseInput.extend({
				id: z.string().min(1),
				password: z.string().min(6).optional().or(z.literal("")),
			}),
		)
		.mutation(async ({ input }) => {
			const data: {
				email: string;
				name: string;
				role: string;
				passwordHash?: string;
			} = {
				email: input.email,
				name: input.name,
				role: input.role,
			};
			if (input.password && input.password.length > 0) {
				data.passwordHash = await hashPassword(input.password);
			}
			return prisma.user.update({
				where: { id: input.id },
				data,
				select: {
					id: true,
					email: true,
					name: true,
					role: true,
					createdAt: true,
					updatedAt: true,
				},
			});
		}),
	delete: protectedProcedure
		.input(z.object({ id: z.string().min(1) }))
		.mutation(({ input, ctx }) => {
			if (input.id === ctx.user.id) {
				throw new Error("Você não pode excluir o próprio usuário logado");
			}
			return prisma.user.delete({ where: { id: input.id } });
		}),
} satisfies TRPCRouterRecord;

export const trpcRouter = createTRPCRouter({
	auth: authRouter,
	products: productsRouter,
	users: usersRouter,
});
export type TRPCRouter = typeof trpcRouter;
