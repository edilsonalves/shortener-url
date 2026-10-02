import process from 'node:process'

import { nodeConfig as schema } from '#shared/configs/_schemas.ts'
import type { NodeConfig } from '#shared/configs/_types.ts'

export const nodeConfig: NodeConfig = schema.parse({
  env: process.env.NODE_ENV,
})
