import type { IUserRepository } from '#domain/ports/repositories/user/user.repository.ts'
import type { UserController } from '#presentation/controllers/user.controller.ts'
import type { IRouter } from '#presentation/routers/_types.ts'

export type IocContainer = {
  apiRouter: IRouter
  userController: UserController
  userRepository: IUserRepository
}
