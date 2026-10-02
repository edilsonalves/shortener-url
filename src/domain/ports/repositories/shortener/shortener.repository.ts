import type * as t from './_types.ts'

export interface IShortenerRepository {
  findByOriginalUrl(input: t.FindByOriginalUrlInput): Promise<t.FindByOriginalUrlOutput>
  findByShortCode(input: t.FindByShortCodeInput): Promise<t.FindByShortCodeOutput>
  create(input: t.CreateInput): Promise<t.CreateOutput>
  createClick(input: t.CreateClickInput): Promise<t.CreateClickOutput>
}
