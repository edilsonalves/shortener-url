import type { CreateShortenerUrl } from '#domain/use-cases/shortener/create-shortener-url.ts'
import type { RedirectShortenerUrl } from '#domain/use-cases/shortener/redirect-shortener-url.ts'
import type * as t from '#presentation/controllers/_types.ts'

export class ShortenerController {
  private createShortenerUrl: CreateShortenerUrl
  private redirectShortenerUrl: RedirectShortenerUrl

  constructor(createShortenerUrl: CreateShortenerUrl, redirectShortenerUrl: RedirectShortenerUrl) {
    this.createShortenerUrl = createShortenerUrl
    this.redirectShortenerUrl = redirectShortenerUrl
  }

  public create = async (req: t.ShortenRequest, res: t.ShortenResponse) => {
    const { url, expiresAt } = req.body
    const input = {
      originalUrl: url,
      expiresAt,
      baseUrl: `${this.resolveBaseUrl(req)}/api`,
    }

    const { created, shortenUrl } = await this.createShortenerUrl.execute(input)

    created ? res.status(201).send(shortenUrl) : res.status(200).send(shortenUrl)
  }

  public redirect = async (req: t.RedirectRequest, res: t.RedirectResponse) => {
    const result = await this.redirectShortenerUrl.execute({
      shortCode: req.params.code,
      referrer: req.headers.referer ?? null,
      userAgent: req.headers['user-agent'] ?? null,
      ip: req.ip || null,
    })

    if (result.outcome === 'not_found') {
      res.status(404).send({ message: 'Not Found' })
      return
    }

    if (result.outcome === 'expired') {
      res.status(410).send({ message: 'Gone' })
      return
    }

    res.redirect(result.originalUrl, 301)
  }

  private resolveBaseUrl(req: t.ShortenRequest): string {
    const { protocol, hostname, port } = req
    const isDefaultPort = (protocol === 'https' && port === 443) || (protocol === 'http' && port === 80)
    const host = isDefaultPort ? hostname : `${hostname}:${port}`

    return `${protocol}://${host}`
  }
}
