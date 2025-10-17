import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// DATABASE_URL yoksa Prisma'ya datasources override geçme (Next/Prisma varsayılanı kullanır)
const prismaOptions = process.env.DATABASE_URL
  ? { datasources: { db: { url: process.env.DATABASE_URL } } }
  : undefined;

export const prisma = globalForPrisma.prisma ?? new PrismaClient(prismaOptions as any)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma