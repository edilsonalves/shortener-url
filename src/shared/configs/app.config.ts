import process from 'node:process'

import { appConfig as schema } from '#shared/configs/_schemas.ts'
import type { AppConfig } from '#shared/configs/_types.ts'

export const appConfig: AppConfig = schema.parse({
  host: process.env.APP_HOST,
  port: process.env.APP_PORT,
})
