import type { IShortenerRepository } from '#domain/ports/repositories/shortener/shortener.repository.ts'
import type { IUserRepository } from '#domain/ports/repositories/user/user.repository.ts'
import type { CreateShortenerUrl } from '#domain/use-cases/shortener/create-shortener-url.ts'
import type { RedirectShortenerUrl } from '#domain/use-cases/shortener/redirect-shortener-url.ts'
import type { ShortenerController } from '#presentation/controllers/shortener.controller.ts'
import type { UserController } from '#presentation/controllers/user.controller.ts'
import type { IRouter } from '#presentation/routers/_types.ts'

export type IocContainer = {
  apiRouter: IRouter
  userController: UserController
  shortenerController: ShortenerController
  createShortenerUrl: CreateShortenerUrl
  redirectShortenerUrl: RedirectShortenerUrl
  userRepository: IUserRepository
  shortenerRepository: IShortenerRepository
}
