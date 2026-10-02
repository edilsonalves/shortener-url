import type { App } from '#presentation/_types.ts'
import * as schemas from '#presentation/controllers/_schemas.ts'
import type { ShortenerController } from '#presentation/controllers/shortener.controller.ts'
import type { UserController } from '#presentation/controllers/user.controller.ts'
import type { IRouter } from '#presentation/routers/_types.ts'

export class ApiRouter implements IRouter {
  private userController: UserController
  private shortenerController: ShortenerController

  constructor(userController: UserController, shortenerController: ShortenerController) {
    this.userController = userController
    this.shortenerController = shortenerController
  }

  public registerRoutes = (app: App): void => {
    app.post('/users', { handler: this.userController.create, schema: schemas.create })
    app.get('/users/:id', { handler: this.userController.show, schema: schemas.show })
    app.post('/shorten', { handler: this.shortenerController.create, schema: schemas.shorten })
    app.get('/:code', { handler: this.shortenerController.redirect, schema: schemas.redirect })
  }
}
