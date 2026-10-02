import type { App } from '#presentation/_types.ts'
import * as schemas from '#presentation/controllers/_schemas.ts'
import type { UserController } from '#presentation/controllers/user.controller.ts'
import type { IRouter } from '#presentation/routers/_types.ts'

export class ApiRouter implements IRouter {
  private controller: UserController

  constructor(userController: UserController) {
    this.controller = userController
  }

  public registerRoutes = (app: App): void => {
    app.post('/users', { handler: this.controller.create, schema: schemas.create })
    app.get('/users/:id', { handler: this.controller.show, schema: schemas.show })
  }
}
