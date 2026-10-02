import * as awilix from 'awilix'

import { CreateShortenerUrl } from '#domain/use-cases/shortener/create-shortener-url.ts'
import { RedirectShortenerUrl } from '#domain/use-cases/shortener/redirect-shortener-url.ts'
import { ShortenerRepository } from '#infrastructure/adapters/repositories/shortener/shortener.repository.ts'
import { UserRepository } from '#infrastructure/adapters/repositories/user/user.repository.ts'
import { iocContainer } from '#infrastructure/bootstraps/ioc/ioc-container.ts'
import { ShortenerController } from '#presentation/controllers/shortener.controller.ts'
import { UserController } from '#presentation/controllers/user.controller.ts'
import { ApiRouter } from '#presentation/routers/api.router.ts'

export const iocBootstrap = (): void => {
  // routers
  iocContainer.register({ apiRouter: awilix.asClass(ApiRouter) })

  // controllers
  iocContainer.register({ userController: awilix.asClass(UserController) })
  iocContainer.register({ shortenerController: awilix.asClass(ShortenerController) })

  // use cases
  iocContainer.register({ createShortenerUrl: awilix.asClass(CreateShortenerUrl) })
  iocContainer.register({ redirectShortenerUrl: awilix.asClass(RedirectShortenerUrl) })

  // repositories
  iocContainer.register({ userRepository: awilix.asClass(UserRepository) })
  iocContainer.register({ shortenerRepository: awilix.asClass(ShortenerRepository) })
}
