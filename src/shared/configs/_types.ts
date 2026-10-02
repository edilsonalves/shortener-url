import type { FastifyDynamicSwaggerOptions } from '@fastify/swagger'
import type { FastifySwaggerUiOptions } from '@fastify/swagger-ui'
import type z from 'zod'

import type * as schemas from '#shared/configs/_schemas.ts'

export type NodeConfig = z.infer<typeof schemas.nodeConfig>

export type AppConfig = z.infer<typeof schemas.appConfig>

export type DbConfig = z.infer<typeof schemas.dbConfig>

export type LogConfig = z.infer<typeof schemas.logConfig>

export type SwaggerConfig = FastifyDynamicSwaggerOptions

export type SwaggerUiConfig = FastifySwaggerUiOptions
