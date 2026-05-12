import { PrismaLibSql } from "@prisma/adapter-libsql"
import bcrypt from "bcryptjs"
import { PrismaClient } from "../src/generated/prisma/client.js"

const adapter = new PrismaLibSql({
	url: process.env.DATABASE_URL ?? "file:./dev.db",
})
const prisma = new PrismaClient({ adapter })

async function main() {
	const [email, password, name, role] = [
		process.argv[2],
		process.argv[3],
		process.argv[4] ?? process.argv[2],
		process.argv[5] ?? "user",
	]

	if (!email || !password) {
		console.error(
			"Uso: tsx prisma/create-user.ts <email> <senha> [nome] [role=admin|user]",
		)
		process.exit(1)
	}

	const passwordHash = await bcrypt.hash(password, 10)
	const user = await prisma.user.upsert({
		where: { email },
		update: { name, role, passwordHash },
		create: { email, name, role, passwordHash },
	})
	console.log(`✅ Usuário pronto: ${user.email} (${user.role})`)
}

main()
	.catch((e) => {
		console.error("❌ Erro:", e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
