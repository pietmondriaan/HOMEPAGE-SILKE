// tests/api.content.test.js
import { describe, it, expect } from 'vitest'
import { makeMockKV, makeEnv } from './helpers/mock-env.js'
import { DEFAULT_CONTENT } from '../src/content-schema.js'

// Import the handler function (we export it for testing)
import { handleContentRequest } from '../functions/api/content.js'

describe('GET /api/content', () => {
  it('returns published content from KV', async () => {
    const env = makeEnv({
      CONTENT_KV: makeMockKV({
        'content-silke': JSON.stringify(DEFAULT_CONTENT),
      }),
    })

    const req = new Request('https://example.com/api/content')
    const res = await handleContentRequest({ request: req, env })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.meta.business_name).toBe('Mag. Silke Burkhardt')
  })

  it('returns default content when KV is empty', async () => {
    const env = makeEnv({ CONTENT_KV: makeMockKV({}) })
    const req = new Request('https://example.com/api/content')
    const res = await handleContentRequest({ request: req, env })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.meta).toBeDefined()
  })
})
