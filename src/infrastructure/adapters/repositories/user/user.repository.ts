import type * as dt from '#domain/ports/repositories/user/_types.ts'
import type { IUserRepository } from '#domain/ports/repositories/user/user.repository.ts'
import { prismaClient } from '#infrastructure/clients/prisma.client.ts'

export class UserRepository implements IUserRepository {
  public async create(input: dt.CreateInput): Promise<dt.CreateOutput> {
    const output = await prismaClient.user.create({
      data: input,
    })

    return output
  }

  public async findById(input: dt.FindByIdInput): Promise<dt.FindByIdOutput> {
    const output = await prismaClient.user.findUnique({
      where: { id: input.id },
      include: { posts: true },
    })

    return output
  }
}
