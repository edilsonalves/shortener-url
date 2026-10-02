import type { ShortenUrl } from '#domain/entities/shorten-url.ts'
import type { ShortenUrlClick } from '#domain/entities/shorten-url-click.ts'
import type { Nullable } from '#shared/utils/type.util.ts'

export type FindByOriginalUrlInput = { originalUrl: string }
export type FindByOriginalUrlOutput = Nullable<ShortenUrl>

export type FindByShortCodeInput = { shortCode: string }
export type FindByShortCodeOutput = Nullable<ShortenUrl>

export type CreateInput = {
  originalUrl: string
  shortCode: string
  shortUrl: string
  expiresAt: string | null
}
export type CreateOutput = ShortenUrl

export type CreateClickInput = {
  shortenUrlId: string
  referrer: string | null
  userAgent: string | null
  ip: string | null
}
export type CreateClickOutput = ShortenUrlClick
