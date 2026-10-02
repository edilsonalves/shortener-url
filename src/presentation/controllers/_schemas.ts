import z from 'zod'

const user = z.object({
  id: z.uuidv7(),
  name: z.string(),
  email: z.email(),
  posts: z.optional(
    z.array(
      z.object({
        id: z.uuidv7(),
        userId: z.uuidv7(),
        title: z.string(),
        content: z.string(),
        published: z.boolean(),
      }),
    ),
  ),
})

const error = z.object({
  message: z.string(),
})

// -----

export const create = {
  tags: ['user'],
  summary: 'Create an user',

  body: z.object({
    name: z.string().trim().nonempty(),
    email: z.email(),
  }),

  response: {
    201: user,
  },
}

export const show = {
  tags: ['user'],
  summary: 'Show an user',

  params: z.object({
    id: z.uuidv7(),
  }),

  response: {
    200: user,
    404: error,
  },
}
