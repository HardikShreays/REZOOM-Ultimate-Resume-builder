import { PrismaClient } from '@prisma/client';

// Ensure single PrismaClient instance across hot-reloads in dev
let prismaClient;

if (process.env.NODE_ENV === 'production') {
  prismaClient = new PrismaClient();
} else {
  const globalAny = globalThis;
  if (!globalAny.__prisma__) {
    globalAny.__prisma__ = new PrismaClient();
  }
  prismaClient = globalAny.__prisma__;
}

export default prismaClient;



