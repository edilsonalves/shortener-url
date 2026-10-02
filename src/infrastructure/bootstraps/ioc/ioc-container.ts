import * as awilix from 'awilix'

import type { IocContainer } from './_types.ts'

export const iocContainer = awilix.createContainer<IocContainer>({
  injectionMode: awilix.InjectionMode.CLASSIC,
  strict: true,
})
