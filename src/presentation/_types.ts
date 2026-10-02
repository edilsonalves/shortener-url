import type fastify from 'fastify'
import type * as tp from 'fastify-type-provider-zod'

export type App = fastify.FastifyInstance<
  fastify.RawServerDefault,
  fastify.RawRequestDefaultExpression,
  fastify.RawReplyDefaultExpression,
  fastify.FastifyBaseLogger,
  tp.ZodTypeProvider
>

export type Req<TSchema extends fastify.FastifySchema = fastify.FastifySchema> = fastify.FastifyRequest<
  fastify.RouteGenericInterface,
  fastify.RawServerDefault,
  fastify.RawRequestDefaultExpression,
  TSchema,
  tp.ZodTypeProvider
>

export type Res<TSchema extends fastify.FastifySchema = fastify.FastifySchema> = fastify.FastifyReply<
  fastify.RouteGenericInterface,
  fastify.RawServerDefault,
  fastify.RawRequestDefaultExpression,
  fastify.RawReplyDefaultExpression,
  fastify.ContextConfigDefault,
  TSchema,
  tp.ZodTypeProvider
>
