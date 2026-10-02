import fs from 'node:fs'

import type { SwaggerUiConfig } from '#shared/configs/_types.ts'

export const swaggerUiConfig: SwaggerUiConfig = {
  routePrefix: '/docs',
  theme: {
    title: 'Backend Template',
  },
  logo: {
    type: 'image/png',
    content: fs.readFileSync('./public/logo.png'),
  },
}
