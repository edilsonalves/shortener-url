import { randomInt } from 'node:crypto'

import type { ShortenUrl } from '#domain/entities/shorten-url.ts'
import type { IShortenerRepository } from '#domain/ports/repositories/shortener/shortener.repository.ts'

const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const CODE_LENGTH = 7
const MAX_ATTEMPTS = 5

export type CreateShortenerUrlInput = {
  originalUrl: string
  expiresAt?: string
  baseUrl: string
}

export type CreateShortenerUrlOutput = {
  created: boolean
  shortenUrl: ShortenUrl
}

export class CreateShortenerUrl {
  private shortenerRepository: IShortenerRepository

  constructor(shortenerRepository: IShortenerRepository) {
    this.shortenerRepository = shortenerRepository
  }

  public async execute(input: CreateShortenerUrlInput): Promise<CreateShortenerUrlOutput> {
    const existing = await this.shortenerRepository.findByOriginalUrl({ originalUrl: input.originalUrl })

    if (existing) {
      return { created: false, shortenUrl: existing }
    }

    const shortenUrl = await this.createWithUniqueCode(input)

    return { created: true, shortenUrl }
  }

  private async createWithUniqueCode(input: CreateShortenerUrlInput): Promise<ShortenUrl> {
    let lastError: unknown

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const shortCode = this.generateShortCode()
      const shortUrl = `${input.baseUrl}/${shortCode}`

      try {
        return await this.shortenerRepository.create({
          originalUrl: input.originalUrl,
          shortCode,
          shortUrl,
          expiresAt: input.expiresAt ?? null,
        })
      } catch (error) {
        lastError = error

        if (!isUniqueConflict(error)) {
          throw error
        }
      }
    }

    throw lastError
  }

  private generateShortCode(): string {
    let code = ''

    for (let index = 0; index < CODE_LENGTH; index++) {
      code += ALPHABET[randomInt(ALPHABET.length)]
    }

    return code
  }
}

const isUniqueConflict = (error: unknown): boolean => {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002'
}
