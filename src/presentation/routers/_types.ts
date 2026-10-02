import type { App } from '#presentation/_types.ts'

export interface IRouter {
  registerRoutes(app: App): void
}
