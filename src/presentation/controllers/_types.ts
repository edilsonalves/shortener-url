import type { Req, Res } from '#presentation/_types.ts'
import type * as Schemas from '#presentation/controllers/_schemas.ts'

export type CreateRequest = Req<typeof Schemas.create>
export type CreateResponse = Res<typeof Schemas.create>

export type ShowRequest = Req<typeof Schemas.show>
export type ShowResponse = Res<typeof Schemas.show>
