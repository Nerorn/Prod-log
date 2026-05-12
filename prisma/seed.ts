import { PrismaLibSql } from "@prisma/adapter-libsql"
import bcrypt from "bcryptjs"
import { PrismaClient } from "../src/generated/prisma/client.js"

const adapter = new PrismaLibSql({
	url: process.env.DATABASE_URL ?? "file:./dev.db",
})
const prisma = new PrismaClient({ adapter })

async function main() {
	console.log("🌱 Limpando banco…")
	await prisma.session.deleteMany()
	await prisma.product.deleteMany()
	await prisma.user.deleteMany()

	console.log("👤 Criando usuários…")
	const adminHash = await bcrypt.hash("admin123", 10)
	const userHash = await bcrypt.hash("user123", 10)
	await prisma.user.create({
		data: {
			email: "admin@example.com",
			name: "Administrador",
			passwordHash: adminHash,
			role: "admin",
		},
	})
	await prisma.user.create({
		data: {
			email: "maria@example.com",
			name: "Maria Souza",
			passwordHash: userHash,
			role: "user",
		},
	})
	await prisma.user.create({
		data: {
			email: "joao@example.com",
			name: "João Lima",
			passwordHash: userHash,
			role: "user",
		},
	})

	console.log("📦 Criando produtos…")
	await prisma.product.createMany({
		data: [
			{
				sku: "TEC-001",
				name: "Teclado mecânico ABNT2",
				description: "Switch marrom, RGB",
				priceCents: 34990,
				stock: 12,
			},
			{
				sku: "MOU-002",
				name: "Mouse sem fio",
				description: "6 botões, bateria recarregável",
				priceCents: 14990,
				stock: 30,
			},
			{
				sku: "MON-003",
				name: 'Monitor 27" 144Hz',
				description: "IPS, 1ms",
				priceCents: 189900,
				stock: 5,
			},
			{
				sku: "CAD-004",
				name: "Cadeira gamer",
				description: null,
				priceCents: 129900,
				stock: 0,
			},
			{
				sku: "HEA-005",
				name: "Headset USB",
				description: "Drivers 50mm, mic com cancelamento",
				priceCents: 24990,
				stock: 18,
			},
		],
	})

	const userCount = await prisma.user.count()
	const productCount = await prisma.product.count()
	console.log(`✅ Criados ${userCount} usuários e ${productCount} produtos`)
}

main()
	.catch((e) => {
		console.error("❌ Erro no seed:", e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
