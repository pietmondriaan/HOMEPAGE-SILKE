// tests/helpers/mock-env.test.js
import { describe, it, expect } from 'vitest'
import { makeMockKV, makeMockR2, makeEnv } from './mock-env.js'

describe('makeMockKV', () => {
  it('returns null for missing keys', async () => {
    const kv = makeMockKV()
    expect(await kv.get('missing')).toBe(null)
  })

  it('stores and retrieves string values', async () => {
    const kv = makeMockKV()
    await kv.put('key', 'value')
    expect(await kv.get('key')).toBe('value')
  })

  it('parses JSON when type is json', async () => {
    const kv = makeMockKV()
    await kv.put('obj', JSON.stringify({ a: 1 }))
    expect(await kv.get('obj', 'json')).toEqual({ a: 1 })
  })

  it('initializes with provided values', async () => {
    const kv = makeMockKV({ foo: 'bar' })
    expect(await kv.get('foo')).toBe('bar')
  })

  it('deletes keys', async () => {
    const kv = makeMockKV({ del: 'me' })
    await kv.delete('del')
    expect(await kv.get('del')).toBe(null)
  })
})

describe('makeMockR2', () => {
  it('returns null for missing keys', async () => {
    const r2 = makeMockR2()
    expect(await r2.get('missing')).toBe(null)
  })

  it('stores and retrieves objects', async () => {
    const r2 = makeMockR2()
    await r2.put('file.txt', 'content')
    const result = await r2.get('file.txt')
    expect(result).not.toBe(null)
    expect(result.body).toBe('content')
  })
})

describe('makeEnv', () => {
  it('returns default env with all required fields', () => {
    const env = makeEnv()
    expect(env.CUSTOMER_ID).toBe('silke')
    expect(env.CUSTOMER_PASSWORD).toBe('test-customer-pw')
    expect(env.MASTER_PASSWORD).toBe('test-master-pw')
    expect(env.SESSION_SECRET).toBe('test-session-secret-32-chars-long')
    expect(env.GEMINI_API_KEY).toBe('fake-gemini-key')
    expect(env.PREVIEW_LIMIT_PER_DAY).toBe('20')
    expect(env.PUBLISH_LIMIT_PER_DAY).toBe('10')
    expect(env.CONTENT_KV).toBeDefined()
    expect(env.UPLOADS_R2).toBeDefined()
  })

  it('applies overrides', () => {
    const env = makeEnv({ CUSTOMER_ID: 'other' })
    expect(env.CUSTOMER_ID).toBe('other')
  })
})
