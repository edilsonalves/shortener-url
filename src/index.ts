import type { App } from '#presentation/_types.ts'
import { HttpApp } from '#presentation/app.ts'
import { appConfig } from '#shared/configs/app.config.ts'
import { nodeConfig } from '#shared/configs/node.config.ts'

class HttpServer {
  private readonly app: App

  constructor(httpApp: HttpApp) {
    this.app = httpApp.getInstance()
  }

  public async listen(): Promise<void> {
    const { host, port } = appConfig

    await this.app.ready()

    this.app.listen({ host, port }, () => {
      console.log(`Server running on ${host}:${port} (${nodeConfig.env})`)
    })
  }
}

const httpApp = new HttpApp()
const httpServer = new HttpServer(httpApp)

httpServer.listen().catch((err: Error) => {
  console.error(err)
})
