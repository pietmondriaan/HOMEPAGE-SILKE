// tests/admin.chat.test.js
import { describe, it, expect, vi } from 'vitest'
import { makeMockKV, makeEnv } from './helpers/mock-env.js'
import { DEFAULT_CONTENT } from '../src/content-schema.js'
import { checkRateLimit } from '../functions/_lib/rate-limit.js'
import { applyJsonDiff } from '../functions/_lib/gemini.js'

describe('checkRateLimit', () => {
  it('allows requests under the limit', async () => {
    const kv = makeMockKV({ 'limit-silke-2026-01-01-preview': '5' })
    const result = await checkRateLimit({ kv, customerId: 'silke', date: '2026-01-01', type: 'preview', max: 20, isMaster: false })
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(14)
  })

  it('blocks requests at the limit', async () => {
    const kv = makeMockKV({ 'limit-silke-2026-01-01-preview': '20' })
    const result = await checkRateLimit({ kv, customerId: 'silke', date: '2026-01-01', type: 'preview', max: 20, isMaster: false })
    expect(result.allowed).toBe(false)
  })

  it('always allows master users', async () => {
    const kv = makeMockKV({ 'limit-silke-2026-01-01-preview': '999' })
    const result = await checkRateLimit({ kv, customerId: 'silke', date: '2026-01-01', type: 'preview', max: 20, isMaster: true })
    expect(result.allowed).toBe(true)
  })
})

describe('applyJsonDiff', () => {
  it('applies a shallow diff to content', () => {
    const base = { ...DEFAULT_CONTENT, hero: { ...DEFAULT_CONTENT.hero, title: 'Old Title' } }
    const diff = { hero: { title: 'New Title' } }
    const result = applyJsonDiff(base, diff)
    expect(result.hero.title).toBe('New Title')
    expect(result.hero.subtitle).toBe(DEFAULT_CONTENT.hero.subtitle) // unchanged
  })

  it('does not overwrite top-level keys not in diff', () => {
    const base = DEFAULT_CONTENT
    const diff = { meta: { business_name: 'New Name' } }
    const result = applyJsonDiff(base, diff)
    expect(result.meta.business_name).toBe('New Name')
    expect(result.about).toEqual(DEFAULT_CONTENT.about) // unchanged
  })
})
