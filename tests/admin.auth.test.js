// tests/admin.auth.test.js
import { describe, it, expect } from 'vitest'
import { makeEnv } from './helpers/mock-env.js'
import { createSession, verifySession } from '../functions/_lib/session.js'
import { handleLogin } from '../functions/admin/login.js'
import { onRequestPost as handleLogout } from '../functions/admin/logout.js'

describe('session', () => {
  it('creates and verifies a session token', async () => {
    const secret = 'test-secret-32-chars-xxxxxxxxxxxx'
    const token = await createSession({ customerId: 'silke', isMaster: false }, secret)
    expect(typeof token).toBe('string')

    const payload = await verifySession(token, secret)
    expect(payload.customerId).toBe('silke')
    expect(payload.isMaster).toBe(false)
  })

  it('returns null for invalid token', async () => {
    const payload = await verifySession('bad-token', 'secret')
    expect(payload).toBeNull()
  })
})

describe('POST /admin/login', () => {
  it('sets session cookie on correct customer password', async () => {
    const env = makeEnv()
    const req = new Request('https://example.com/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'test-customer-pw' }),
    })

    const res = await handleLogin({ request: req, env })
    expect(res.status).toBe(200)
    expect(res.headers.get('Set-Cookie')).toContain('vas_session=')

    const body = await res.json()
    expect(body.isMaster).toBe(false)
  })

  it('sets isMaster=true on correct master password', async () => {
    const env = makeEnv()
    const req = new Request('https://example.com/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'test-master-pw' }),
    })

    const res = await handleLogin({ request: req, env })
    const body = await res.json()
    expect(body.isMaster).toBe(true)
  })

  it('returns 401 on wrong password', async () => {
    const env = makeEnv()
    const req = new Request('https://example.com/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'wrong' }),
    })

    const res = await handleLogin({ request: req, env })
    expect(res.status).toBe(401)
  })
})

describe('POST /admin/logout', () => {
  it('clears session cookie', async () => {
    const res = await handleLogout()
    expect(res.status).toBe(200)
    const cookie = res.headers.get('Set-Cookie')
    expect(cookie).toContain('vas_session=')
    expect(cookie).toContain('Max-Age=0')
  })
})
