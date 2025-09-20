const { PrismaClient } = require('@prisma/client');

// Ensure single PrismaClient instance across hot-reloads in dev
let prismaClient;

if (process.env.NODE_ENV === 'production') {
  prismaClient = new PrismaClient();
} else {
  if (!global.__prisma__) {
    global.__prisma__ = new PrismaClient();
  }
  prismaClient = global.__prisma__;
}

module.exports = prismaClient;



