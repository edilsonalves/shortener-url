import assert from 'node:assert/strict'
import { after, before, beforeEach, describe, it } from 'node:test'

import { prismaClient } from '#infrastructure/clients/prisma.client.ts'
import { HttpApp } from '#presentation/app.ts'
import { disconnectDatabase, truncateTables } from '#tests/helpers/database.ts'

const SHORT_CODE = /^[0-9A-Za-z]{7}$/

type ShortenBody = {
  id: string
  shortCode: string
  shortUrl: string
  originalUrl: string
  createdAt: string
  expiresAt: string | null
}

type ErrorBody = {
  message: string
}

describe('POST /api/shorten', { concurrency: 1 }, () => {
  const app = new HttpApp().getInstance()

  before(async () => {
    await app.ready()
  })

  beforeEach(async () => {
    await truncateTables()
  })

  after(async () => {
    await app.close()
    await disconnectDatabase()
  })

  const postShorten = (payload: Record<string, unknown>) => {
    return app.inject({
      method: 'POST',
      url: '/api/shorten',
      headers: { 'content-type': 'application/json' },
      payload,
    })
  }

  const assertShortenBody = (body: ShortenBody, originalUrl: string) => {
    assert.equal(typeof body.id, 'string')
    assert.ok(body.id.length > 0)
    assert.match(body.shortCode, SHORT_CODE)
    assert.equal(body.originalUrl, originalUrl)
    assert.equal(new URL(body.shortUrl).pathname, `/api/${body.shortCode}`)
    assert.equal(Number.isNaN(Date.parse(body.createdAt)), false)
  }

  describe('happy path', () => {
    it('creates a shortened url without an expiration date', async () => {
      const originalUrl = 'https://example.com/docs'

      const response = await postShorten({ url: originalUrl })

      assert.equal(response.statusCode, 201)

      const body = response.json() as ShortenBody
      assertShortenBody(body, originalUrl)
      assert.equal(body.expiresAt, null)

      const stored = await prismaClient.shortenUrl.findUniqueOrThrow({ where: { id: body.id } })
      assert.equal(stored.originalUrl, originalUrl)
      assert.equal(stored.shortCode, body.shortCode)
      assert.equal(stored.shortUrl, body.shortUrl)
      assert.equal(stored.expiresAt, null)
      assert.equal(await prismaClient.shortenUrl.count(), 1)
    })

    it('creates a shortened url with a future expiration date', async () => {
      const originalUrl = 'https://example.com/campaign'
      const expiresAt = '2099-01-01T00:00:00.000Z'

      const response = await postShorten({ url: originalUrl, expiresAt })

      assert.equal(response.statusCode, 201)

      const body = response.json() as ShortenBody
      assertShortenBody(body, originalUrl)
      assert.equal(body.expiresAt, expiresAt)

      const stored = await prismaClient.shortenUrl.findUniqueOrThrow({ where: { id: body.id } })
      assert.equal(stored.expiresAt?.toISOString(), expiresAt)
    })

    it('accepts an expiration date with a timezone offset', async () => {
      const originalUrl = 'https://example.com/offset'

      const response = await postShorten({
        url: originalUrl,
        expiresAt: '2099-01-01T00:00:00.000-03:00',
      })

      assert.equal(response.statusCode, 201)

      const body = response.json() as ShortenBody
      assertShortenBody(body, originalUrl)
      assert.equal(body.expiresAt, '2099-01-01T03:00:00.000Z')
    })
  })

  describe('schema validation', () => {
    it('rejects a body without url', async () => {
      const response = await postShorten({})

      assert.equal(response.statusCode, 400)
      assert.equal(
        (response.json() as ErrorBody).message,
        'body/url Invalid input: expected string, received undefined',
      )
      assert.equal(await prismaClient.shortenUrl.count(), 0)
    })

    it('rejects an invalid url', async () => {
      const response = await postShorten({ url: 'not-a-url' })

      assert.equal(response.statusCode, 400)
      assert.equal((response.json() as ErrorBody).message, 'body/url Invalid URL')
      assert.equal(await prismaClient.shortenUrl.count(), 0)
    })

    it('rejects an expiration date that is not an ISO datetime', async () => {
      const response = await postShorten({ url: 'https://example.com', expiresAt: '2099-01-01' })

      assert.equal(response.statusCode, 400)
      assert.equal((response.json() as ErrorBody).message, 'body/expiresAt Invalid ISO datetime')
      assert.equal(await prismaClient.shortenUrl.count(), 0)
    })

    it('rejects an expiration date in the past', async () => {
      const response = await postShorten({
        url: 'https://example.com',
        expiresAt: '2000-01-01T00:00:00.000Z',
      })

      assert.equal(response.statusCode, 400)
      assert.equal((response.json() as ErrorBody).message, 'body/expiresAt expiresAt must be in the future')
      assert.equal(await prismaClient.shortenUrl.count(), 0)
    })

    it('rejects a null expiration date', async () => {
      const response = await postShorten({ url: 'https://example.com', expiresAt: null })

      assert.equal(response.statusCode, 400)
      assert.equal(
        (response.json() as ErrorBody).message,
        'body/expiresAt Invalid input: expected string, received null',
      )
      assert.equal(await prismaClient.shortenUrl.count(), 0)
    })
  })

  describe('business rules', () => {
    it('reuses the active shortened url and ignores a new expiration date', async () => {
      const originalUrl = 'https://example.com/reuse'
      const expiresAt = '2099-01-01T00:00:00.000Z'

      const created = await postShorten({ url: originalUrl, expiresAt })
      assert.equal(created.statusCode, 201)
      const first = created.json() as ShortenBody

      const reused = await postShorten({ url: originalUrl, expiresAt: '2099-06-01T00:00:00.000Z' })
      assert.equal(reused.statusCode, 200)

      const second = reused.json() as ShortenBody
      assert.deepEqual(second, first)
      assert.equal(await prismaClient.shortenUrl.count(), 1)
    })

    it('creates another shortened url when the previous one expired', async () => {
      const originalUrl = 'https://example.com/expired'
      const expiresAt = '2099-06-01T00:00:00.000Z'

      const created = await postShorten({ url: originalUrl, expiresAt: '2099-01-01T00:00:00.000Z' })
      assert.equal(created.statusCode, 201)
      const first = created.json() as ShortenBody

      await prismaClient.shortenUrl.update({
        where: { id: first.id },
        data: { expiresAt: new Date('2000-01-01T00:00:00.000Z') },
      })

      const response = await postShorten({ url: originalUrl, expiresAt })
      assert.equal(response.statusCode, 201)

      const second = response.json() as ShortenBody
      assertShortenBody(second, originalUrl)
      assert.notEqual(second.id, first.id)
      assert.notEqual(second.shortCode, first.shortCode)
      assert.equal(second.expiresAt, expiresAt)
      assert.equal(await prismaClient.shortenUrl.count(), 2)
    })
  })
})
