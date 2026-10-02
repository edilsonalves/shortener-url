import type { User } from '#domain/entities/user.ts'
import type { Nullable } from '#shared/utils/type.util.ts'

export type CreateInput = { name: string; email: string }
export type CreateOutput = User

export type FindByIdInput = { id: string }
export type FindByIdOutput = Nullable<User>
