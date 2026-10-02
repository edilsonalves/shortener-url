import * as tp from 'fastify-type-provider-zod'

import type { SwaggerConfig } from '#shared/configs/_types.ts'

export const swaggerConfig: SwaggerConfig = {
  openapi: {
    info: {
      title: 'Backend Template',
      description: 'Template for backend projects',
      version: '1.0.0',
      contact: {
        name: 'Edilson Alves',
        email: 'email@edilsonalves.com',
        url: 'https://edilsonalves.com',
      },
    },
  },
  transform: tp.jsonSchemaTransform,
}
