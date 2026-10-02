import * as tp from 'fastify-type-provider-zod'

import type { Req, Res } from '#presentation/_types.ts'

export const errorHandlerMiddleware = (error: unknown, _: Req, res: Res): void => {
  if (tp.hasZodFastifySchemaValidationErrors(error)) {
    const details = error.validation.map(({ message }) => message)

    res.status(400).send({
      error: 'Bad request error',
      message: 'Invalid request data',
      details,
    })
  }

  if (tp.isResponseSerializationError(error)) {
    res.status(500).send({
      error: 'Internal server error',
      message: 'Invalid response data',
      details: error.cause.issues,
    })
  }

  res.status(500).send({ message: 'Internal server error' })
}
