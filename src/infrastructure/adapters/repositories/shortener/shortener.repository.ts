import type { ShortenUrl } from '#domain/entities/shorten-url.ts'
import type { ShortenUrlClick } from '#domain/entities/shorten-url-click.ts'
import type * as dt from '#domain/ports/repositories/shortener/_types.ts'
import type { IShortenerRepository } from '#domain/ports/repositories/shortener/shortener.repository.ts'
import { prismaClient } from '#infrastructure/clients/prisma.client.ts'

type ShortenUrlRecord = {
  id: string
  shortCode: string
  shortUrl: string
  originalUrl: string
  createdAt: Date
  expiresAt: Date | null
}

type ShortenUrlClickRecord = {
  id: string
  shortenUrlId: string
  referrer: string | null
  userAgent: string | null
  ip: string | null
  createdAt: Date
}

export class ShortenerRepository implements IShortenerRepository {
  public async findByOriginalUrl(input: dt.FindByOriginalUrlInput): Promise<dt.FindByOriginalUrlOutput> {
    const output = await prismaClient.shortenUrl.findFirst({
      where: {
        originalUrl: input.originalUrl,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      orderBy: { createdAt: 'desc' },
    })

    return output ? this.toEntity(output) : null
  }

  public async findByShortCode(input: dt.FindByShortCodeInput): Promise<dt.FindByShortCodeOutput> {
    const output = await prismaClient.shortenUrl.findUnique({
      where: { shortCode: input.shortCode },
    })

    return output ? this.toEntity(output) : null
  }

  public async create(input: dt.CreateInput): Promise<dt.CreateOutput> {
    const output = await prismaClient.shortenUrl.create({
      data: {
        originalUrl: input.originalUrl,
        shortCode: input.shortCode,
        shortUrl: input.shortUrl,
        expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
      },
    })

    return this.toEntity(output)
  }

  public async createClick(input: dt.CreateClickInput): Promise<dt.CreateClickOutput> {
    const output = await prismaClient.shortenUrlClick.create({
      data: {
        shortenUrlId: input.shortenUrlId,
        referrer: input.referrer,
        userAgent: input.userAgent,
        ip: input.ip,
      },
    })

    return this.toClick(output)
  }

  private toEntity(record: ShortenUrlRecord): ShortenUrl {
    return {
      id: record.id,
      shortCode: record.shortCode,
      shortUrl: record.shortUrl,
      originalUrl: record.originalUrl,
      createdAt: record.createdAt.toISOString(),
      expiresAt: record.expiresAt?.toISOString() ?? null,
    }
  }

  private toClick(record: ShortenUrlClickRecord): ShortenUrlClick {
    return {
      id: record.id,
      shortenUrlId: record.shortenUrlId,
      referrer: record.referrer,
      userAgent: record.userAgent,
      ip: record.ip,
      createdAt: record.createdAt.toISOString(),
    }
  }
}
