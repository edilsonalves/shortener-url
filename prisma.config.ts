import { defineConfig } from 'prisma/config'

import { dbConfig } from '#shared/configs/db.config.ts'

export default defineConfig({
  datasource: { url: dbConfig.url },
  schema: 'prisma/',
  migrations: {
    path: 'prisma/migrations',
  },
})
