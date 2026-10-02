import type * as t from './_types.ts'

export interface IUserRepository {
  create(input: t.CreateInput): Promise<t.CreateOutput>
  findById(input: t.FindByIdInput): Promise<t.FindByIdOutput>
}
