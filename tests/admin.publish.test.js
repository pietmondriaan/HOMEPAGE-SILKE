// tests/admin.publish.test.js
import { describe, it, expect } from 'vitest'
import { makeMockKV, makeEnv } from './helpers/mock-env.js'
import { DEFAULT_CONTENT } from '../src/content-schema.js'
import { handlePublish } from '../functions/admin/publish.js'
import { handleDiscard } from '../functions/admin/discard.js'

const MODIFIED = { ...DEFAULT_CONTENT, hero: { ...DEFAULT_CONTENT.hero, title: 'Modified' } }

describe('POST /admin/publish', () => {
  it('copies draft to published content', async () => {
    const kv = makeMockKV({
      'content-silke': JSON.stringify(DEFAULT_CONTENT),
      'draft-silke': JSON.stringify(MODIFIED),
    })
    const env = makeEnv({ CONTENT_KV: kv })
    const req = new Request('https://example.com/admin/publish', { method: 'POST' })

    const res = await handlePublish({ request: req, env, data: { session: { customerId: 'silke', isMaster: false } } })
    expect(res.status).toBe(200)

    const published = await kv.get('content-silke', 'json')
    expect(published.hero.title).toBe('Modified')
  })

  it('blocks publish at daily limit', async () => {
    const today = new Date().toISOString().split('T')[0]
    const kv = makeMockKV({
      [`limit-silke-${today}-publish`]: '10',
      'content-silke': JSON.stringify(DEFAULT_CONTENT),
      'draft-silke': JSON.stringify(MODIFIED),
    })
    const env = makeEnv({ CONTENT_KV: kv })
    const req = new Request('https://example.com/admin/publish', { method: 'POST' })
    const res = await handlePublish({ request: req, env, data: { session: { customerId: 'silke', isMaster: false } } })
    expect(res.status).toBe(429)
  })
})

describe('POST /admin/discard', () => {
  it('resets draft to published content', async () => {
    const kv = makeMockKV({
      'content-silke': JSON.stringify(DEFAULT_CONTENT),
      'draft-silke': JSON.stringify(MODIFIED),
    })
    const env = makeEnv({ CONTENT_KV: kv })
    const req = new Request('https://example.com/admin/discard', { method: 'POST' })
    await handleDiscard({ request: req, env, data: { session: { customerId: 'silke', isMaster: false } } })

    const draft = await kv.get('draft-silke', 'json')
    expect(draft.hero.title).toBe(DEFAULT_CONTENT.hero.title)
  })
})
