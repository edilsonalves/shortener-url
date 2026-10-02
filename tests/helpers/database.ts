import { prismaClient } from '#infrastructure/clients/prisma.client.ts'

export const truncateTables = async (): Promise<void> => {
  await prismaClient.$executeRawUnsafe(
    'TRUNCATE TABLE "shorten_url_clicks", "shorten_urls", "posts", "users" RESTART IDENTITY CASCADE',
  )
}

export const disconnectDatabase = async (): Promise<void> => {
  await prismaClient.$disconnect()
}
