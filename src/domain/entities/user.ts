import type { Post } from './post.ts'

export type User = {
  id: string
  name: string
  email: string
  posts?: Post[]
}
