import type { IUserRepository } from '#domain/ports/repositories/user/user.repository.ts'
import type * as t from '#presentation/controllers/_types.ts'

export class UserController {
  private userRepository: IUserRepository

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  public create = async (req: t.CreateRequest, res: t.CreateResponse) => {
    const { name, email } = req.body
    const input = { name, email }

    const user = await this.userRepository.create(input)

    res.status(201).send(user)
  }

  public show = async (req: t.ShowRequest, res: t.ShowResponse) => {
    const { id } = req.params
    const input = { id }

    const user = await this.userRepository.findById(input)

    user ? res.status(200).send(user) : res.status(404).send({ message: 'Not Found' })
  }
}
