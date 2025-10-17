import { PrismaClient, Prisma } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Define the correct type for prismaOptions
const prismaOptions: Prisma.PrismaClientOptions | undefined = process.env.DATABASE_URL
  ? { datasources: { db: { url: process.env.DATABASE_URL } } }
  : undefined;

// Now you can remove "as any" because prismaOptions has a valid type
export const prisma = globalForPrisma.prisma ?? new PrismaClient(prismaOptions)

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}