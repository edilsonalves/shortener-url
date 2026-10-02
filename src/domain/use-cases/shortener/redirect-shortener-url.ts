import type { IShortenerRepository } from '#domain/ports/repositories/shortener/shortener.repository.ts'

export type RedirectShortenerUrlInput = {
  shortCode: string
  referrer: string | null
  userAgent: string | null
  ip: string | null
}

export type RedirectShortenerUrlOutput =
  | { outcome: 'not_found' }
  | { outcome: 'expired' }
  | { outcome: 'redirect'; originalUrl: string }

export class RedirectShortenerUrl {
  private shortenerRepository: IShortenerRepository

  constructor(shortenerRepository: IShortenerRepository) {
    this.shortenerRepository = shortenerRepository
  }

  public async execute(input: RedirectShortenerUrlInput): Promise<RedirectShortenerUrlOutput> {
    const shortenUrl = await this.shortenerRepository.findByShortCode({ shortCode: input.shortCode })

    if (!shortenUrl) {
      return { outcome: 'not_found' }
    }

    await this.shortenerRepository.createClick({
      shortenUrlId: shortenUrl.id,
      referrer: input.referrer,
      userAgent: input.userAgent,
      ip: input.ip,
    })

    if (this.isExpired(shortenUrl.expiresAt)) {
      return { outcome: 'expired' }
    }

    return { outcome: 'redirect', originalUrl: shortenUrl.originalUrl }
  }

  private isExpired(expiresAt: string | null): boolean {
    return expiresAt !== null && new Date(expiresAt).getTime() <= Date.now()
  }
}
