// tests/helpers/mock-env.js

export function makeMockKV(initial = {}) {
  const store = new Map(Object.entries(initial))
  return {
    async get(key, type) {
      const val = store.get(key) ?? null
      if (val === null) return null
      if (type === 'json') { try { return JSON.parse(val) } catch { return null } }
      return val
    },
    async put(key, value, opts) {
      store.set(key, typeof value === 'string' ? value : JSON.stringify(value))
    },
    async delete(key) { store.delete(key) },
    _store: store,
  }
}

export function makeMockR2() {
  const store = new Map()
  return {
    async put(key, body, opts) { store.set(key, { body, contentType: opts?.httpMetadata?.contentType }) },
    async get(key) { return store.has(key) ? store.get(key) : null },
    _store: store,
  }
}

export function makeEnv(overrides = {}) {
  return {
    CUSTOMER_ID: 'silke',
    CUSTOMER_PASSWORD: 'test-customer-pw',
    MASTER_PASSWORD: 'test-master-pw',
    SESSION_SECRET: 'test-session-secret-32-chars-long',
    GEMINI_API_KEY: 'fake-gemini-key',
    PREVIEW_LIMIT_PER_DAY: '20',
    PUBLISH_LIMIT_PER_DAY: '10',
    CONTENT_KV: makeMockKV(),
    UPLOADS_R2: makeMockR2(),
    ...overrides,
  }
}
