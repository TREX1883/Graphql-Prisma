import pkg from '@prisma/client'
const { PrismaClient } = pkg

export const prisma = new PrismaClient()

export const context = {
  prisma: prisma,
}
