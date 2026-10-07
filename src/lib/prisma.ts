import { PrismaPg } from "@prisma/adapter-pg";
import { getDatabaseUrl } from "@/database-url";
import { PrismaClient } from "@/generated/prisma/client";

// Reaproveita a instância entre reloads do Vite em dev para não esgotar conexões.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient() {
	const adapter = new PrismaPg({ connectionString: getDatabaseUrl() });
	return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
