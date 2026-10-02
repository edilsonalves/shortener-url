import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import * as tp from 'fastify-type-provider-zod'

import { iocBootstrap } from '#infrastructure/bootstraps/ioc/ioc.bootstrap.ts'
import { iocContainer } from '#infrastructure/bootstraps/ioc/ioc-container.ts'
import type { App } from '#presentation/_types.ts'
import { swaggerConfig } from '#shared/configs/swagger.config.ts'
import { swaggerUiConfig } from '#shared/configs/swagger-ui.config.ts'

export class HttpApp {
  private readonly app: App

  constructor() {
    this.app = fastify().withTypeProvider<tp.ZodTypeProvider>()

    this.setupBootstraps()
    this.setupMiddlewares()
    this.setupPlugins()
    this.setupRouters()
  }

  private setupBootstraps(): void {
    iocBootstrap()
  }

  private setupMiddlewares(): void {
    this.app.setSerializerCompiler(tp.serializerCompiler)
    this.app.setValidatorCompiler(tp.validatorCompiler)
  }

  private setupPlugins(): void {
    this.app.register(fastifySwagger, swaggerConfig)
    this.app.register(fastifySwaggerUi, swaggerUiConfig)
  }

  private setupRouters(): void {
    const apiRouter = iocContainer.resolve('apiRouter')

    this.app.register(apiRouter.registerRoutes, { prefix: '/api' })
  }

  public getInstance(): App {
    return this.app
  }
}
