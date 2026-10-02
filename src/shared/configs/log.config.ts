import process from 'node:process'

import { logConfig as schema } from '#shared/configs/_schemas.ts'
import type { LogConfig } from '#shared/configs/_types.ts'

export const logConfig: LogConfig = schema.parse({
  enabled: process.env.LOG_ENABLED,
  level: process.env.LOG_LEVEL,
})
