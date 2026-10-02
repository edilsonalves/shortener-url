import assert from 'node:assert/strict'
import { after, before, beforeEach, describe, it } from 'node:test'

import { prismaClient } from '#infrastructure/clients/prisma.client.ts'
import { HttpApp } from '#presentation/app.ts'
import { disconnectDatabase, truncateTables } from '#tests/helpers/database.ts'

type ShortenBody = {
  id: string
  shortCode: string
  originalUrl: string
}

type ErrorBody = {
  message: string
}

type ClickHeaders = {
  referrer?: string
  userAgent?: string
  ip?: string
}

describe('GET /api/:code', { concurrency: 1 }, () => {
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

  const getShorten = (code: string, headers: ClickHeaders = {}) => {
    return app.inject({
      method: 'GET',
      url: `/api/${code}`,
      headers: {
        ...(headers.referrer ? { referer: headers.referrer } : {}),
        'user-agent': headers.userAgent,
      },
      ...(headers.ip ? { remoteAddress: headers.ip } : {}),
    })
  }

  const createShorten = async (originalUrl: string, expiresAt?: string) => {
    const response = await postShorten({ url: originalUrl, ...(expiresAt ? { expiresAt } : {}) })
    assert.equal(response.statusCode, 201)

    return response.json() as ShortenBody
  }

  describe('happy path', () => {
    it('redirects to the original url and records the click', async () => {
      const originalUrl = 'https://example.com/docs'
      const created = await createShorten(originalUrl)
      const referrer = 'https://news.example/story'
      const userAgent = 'integration-test'
      const ip = '203.0.113.10'

      const response = await getShorten(created.shortCode, { referrer, userAgent, ip })

      assert.equal(response.statusCode, 301)
      assert.equal(response.headers.location, originalUrl)

      assert.equal(await prismaClient.shortenUrlClick.count(), 1)
      const click = await prismaClient.shortenUrlClick.findFirstOrThrow()
      assert.equal(click.shortenUrlId, created.id)
      assert.equal(click.referrer, referrer)
      assert.equal(click.userAgent, userAgent)
      assert.equal(click.ip, ip)
      assert.ok(Date.now() - click.createdAt.getTime() < 5000)
    })

    it('redirects when the shortened url has no expiration date', async () => {
      const originalUrl = 'https://example.com/permanent'
      const created = await createShorten(originalUrl)

      const response = await getShorten(created.shortCode)

      assert.equal(response.statusCode, 301)
      assert.equal(response.headers.location, originalUrl)

      const click = await prismaClient.shortenUrlClick.findFirstOrThrow()
      assert.equal(click.referrer, null)
      assert.equal(click.userAgent, null)
      assert.ok(click.ip)
    })

    it('records a click for every access', async () => {
      const created = await createShorten('https://example.com/repeat')

      assert.equal((await getShorten(created.shortCode)).statusCode, 301)
      assert.equal((await getShorten(created.shortCode)).statusCode, 301)
      assert.equal(await prismaClient.shortenUrlClick.count(), 2)
    })
  })

  describe('schema validation', () => {
    it('rejects a blank code', async () => {
      const response = await getShorten(encodeURIComponent('   '))

      assert.equal(response.statusCode, 400)
      assert.equal(
        (response.json() as ErrorBody).message,
        'params/code Too small: expected string to have >=1 characters',
      )
      assert.equal(await prismaClient.shortenUrlClick.count(), 0)
    })
  })

  describe('business rules', () => {
    it('returns 404 when the code does not exist', async () => {
      const response = await getShorten('missing')

      assert.equal(response.statusCode, 404)
      assert.deepEqual(response.json(), { message: 'Not Found' })
      assert.equal(await prismaClient.shortenUrlClick.count(), 0)
    })

    it('returns 410 when the shortened url expired and records the click', async () => {
      const originalUrl = 'https://example.com/expired'
      const created = await createShorten(originalUrl, '2099-01-01T00:00:00.000Z')
      const referrer = 'https://referrer.example'
      const userAgent = 'integration-test'
      const ip = '203.0.113.20'

      await prismaClient.shortenUrl.update({
        where: { id: created.id },
        data: { expiresAt: new Date('2000-01-01T00:00:00.000Z') },
      })

      const response = await getShorten(created.shortCode, { referrer, userAgent, ip })

      assert.equal(response.statusCode, 410)
      assert.deepEqual(response.json(), { message: 'Gone' })

      assert.equal(await prismaClient.shortenUrlClick.count(), 1)
      const click = await prismaClient.shortenUrlClick.findFirstOrThrow()
      assert.equal(click.shortenUrlId, created.id)
      assert.equal(click.referrer, referrer)
      assert.equal(click.userAgent, userAgent)
      assert.equal(click.ip, ip)
      assert.ok(Date.now() - click.createdAt.getTime() < 5000)
    })
  })
})
