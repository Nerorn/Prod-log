import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "./generated/prisma/client.js";

declare global {
	var __prisma: PrismaClient | undefined;
}

function makeClient() {
	const adapter = new PrismaLibSql({
		url: process.env.DATABASE_URL ?? "file:./dev.db",
	});
	return new PrismaClient({ adapter });
}

export const prisma = globalThis.__prisma ?? makeClient();

if (process.env.NODE_ENV !== "production") {
	globalThis.__prisma = prisma;
}
