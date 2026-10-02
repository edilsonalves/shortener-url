import * as awilix from 'awilix'

import { UserRepository } from '#infrastructure/adapters/repositories/user/user.repository.ts'
import { iocContainer } from '#infrastructure/bootstraps/ioc/ioc-container.ts'
import { UserController } from '#presentation/controllers/user.controller.ts'
import { ApiRouter } from '#presentation/routers/api.router.ts'

export const iocBootstrap = (): void => {
  // routers
  iocContainer.register({ apiRouter: awilix.asClass(ApiRouter) })

  // controllers
  iocContainer.register({ userController: awilix.asClass(UserController) })

  // repositories
  iocContainer.register({ userRepository: awilix.asClass(UserRepository) })
}
