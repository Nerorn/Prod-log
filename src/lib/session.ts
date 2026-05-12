import { createServerFn } from "@tanstack/react-start";
import {
	deleteCookie,
	getCookie,
	setCookie,
} from "@tanstack/react-start/server";
import { z } from "zod";

import { prisma } from "#/db";
import {
	generateSessionToken,
	SESSION_COOKIE,
	SESSION_DURATION_MS,
	verifyPassword,
} from "./auth";

async function readSessionUser() {
	const token = getCookie(SESSION_COOKIE);
	if (!token) return null;
	const session = await prisma.session.findUnique({
		where: { id: token },
		include: { user: true },
	});
	if (!session) return null;
	if (session.expiresAt.getTime() < Date.now()) {
		await prisma.session.delete({ where: { id: token } }).catch(() => {});
		return null;
	}
	return {
		id: session.user.id,
		email: session.user.email,
		name: session.user.name,
		role: session.user.role,
	};
}

export const getCurrentUserFn = createServerFn({ method: "GET" }).handler(
	async () => {
		return await readSessionUser();
	},
);

const loginInput = z.object({
	email: z.string().email(),
	password: z.string().min(1),
});

export const loginFn = createServerFn({ method: "POST" })
	.inputValidator((data: unknown) => loginInput.parse(data))
	.handler(async ({ data }) => {
		const user = await prisma.user.findUnique({ where: { email: data.email } });
		if (!user) throw new Error("Credenciais inválidas");
		const ok = await verifyPassword(data.password, user.passwordHash);
		if (!ok) throw new Error("Credenciais inválidas");

		const token = generateSessionToken();
		const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
		await prisma.session.create({
			data: { id: token, userId: user.id, expiresAt },
		});
		setCookie(SESSION_COOKIE, token, {
			path: "/",
			httpOnly: true,
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production",
			expires: expiresAt,
		});
		return { id: user.id, email: user.email, name: user.name, role: user.role };
	});

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
	const token = getCookie(SESSION_COOKIE);
	if (token) {
		await prisma.session.delete({ where: { id: token } }).catch(() => {});
	}
	deleteCookie(SESSION_COOKIE, { path: "/" });
	return { ok: true };
});
