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

const futureDateTime = z.iso
  .datetime({ offset: true })
  .refine((value) => new Date(value).getTime() > Date.now(), { message: 'expiresAt must be in the future' })

const shortenUrl = z.object({
  id: z.uuidv7(),
  shortCode: z.string(),
  shortUrl: z.url(),
  originalUrl: z.url(),
  createdAt: z.iso.datetime({ offset: true }),
  expiresAt: z.iso.datetime({ offset: true }).nullable(),
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

export const shorten = {
  tags: ['shortener'],
  summary: 'Create a shortened url',

  body: z.object({
    url: z.url(),
    expiresAt: futureDateTime.optional(),
  }),

  response: {
    200: shortenUrl,
    201: shortenUrl,
  },
}

export const redirect = {
  tags: ['shortener'],
  summary: 'Redirect to the original url',

  params: z.object({
    code: z.string().trim().nonempty(),
  }),

  response: {
    404: error,
    410: error,
  },
}
