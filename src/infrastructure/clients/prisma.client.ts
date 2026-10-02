import { PrismaPg } from '@prisma/adapter-pg'

import { PrismaClient } from '#prisma/generated/client.ts'
import { dbConfig } from '#shared/configs/db.config.ts'

const { url: connectionString } = dbConfig
const adapter = new PrismaPg({ connectionString })

export const prismaClient = new PrismaClient({ adapter })
