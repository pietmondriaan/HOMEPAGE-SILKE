// tests/admin.upload.test.js
import { describe, it, expect } from 'vitest'
import { makeMockKV, makeMockR2, makeEnv } from './helpers/mock-env.js'
import { handleUpload } from '../functions/vavadmin/upload.js'

function makeImageRequest(filename = 'test.jpg', mimeType = 'image/jpeg') {
  const formData = new FormData()
  const blob = new Blob(['fake-image-bytes'], { type: mimeType })
  formData.append('file', blob, filename)
  return new Request('https://example.com/admin/upload', {
    method: 'POST',
    body: formData,
  })
}

describe('POST /admin/upload', () => {
  it('rejects unsupported file types', async () => {
    const env = makeEnv()
    const formData = new FormData()
    formData.append('file', new Blob(['x'], { type: 'application/zip' }), 'file.zip')
    const req = new Request('https://example.com/admin/upload', { method: 'POST', body: formData })
    const res = await handleUpload({ request: req, env, data: { session: { customerId: 'silke', isMaster: false } } })
    expect(res.status).toBe(400)
  })

  it('stores image in R2 and returns URL', async () => {
    const r2 = makeMockR2()
    const env = makeEnv({ UPLOADS_R2: r2 })
    const req = makeImageRequest('portrait.jpg', 'image/jpeg')
    const res = await handleUpload({ request: req, env, data: { session: { customerId: 'silke', isMaster: false } } })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.url).toContain('portrait')
    expect(r2._store.size).toBe(1)
  })
})
