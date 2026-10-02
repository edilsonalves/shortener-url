import process from 'node:process'

import { dbConfig as schema } from '#shared/configs/_schemas.ts'
import type { DbConfig } from '#shared/configs/_types.ts'

export const dbConfig: DbConfig = schema.parse({
  url: process.env.DB_URL,
})
