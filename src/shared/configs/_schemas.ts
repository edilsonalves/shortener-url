import z from 'zod'

import { EnvironmentEnum } from '#shared/enums/environment.enum.ts'
import { LogLevelEnum } from '#shared/enums/log-level.enum.ts'

export const nodeConfig = z.object({
  env: z.enum(EnvironmentEnum),
})

export const appConfig = z.object({
  host: z.literal('0.0.0.0'),
  port: z.coerce.number().positive(),
})

export const dbConfig = z.object({
  url: z.url(),
})

export const logConfig = z.object({
  enabled: z.coerce.boolean(),
  level: z.enum(LogLevelEnum),
})
