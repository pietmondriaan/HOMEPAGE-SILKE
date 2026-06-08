// scripts/seed-content.js
// Run once to seed initial content into Cloudflare KV.
// Usage: node scripts/seed-content.js
// Requires: wrangler login + KV namespace created in wrangler.toml

import { execSync } from 'child_process'
import { DEFAULT_CONTENT } from '../src/content-schema.js'

const CUSTOMER_ID = process.env.CUSTOMER_ID ?? 'silke'
const json = JSON.stringify(DEFAULT_CONTENT)

// Write published content
execSync(
  `npx wrangler kv key put --binding=CONTENT_KV "content-${CUSTOMER_ID}" '${json}'`,
  { stdio: 'inherit' }
)

// Write draft (same as published initially)
execSync(
  `npx wrangler kv key put --binding=CONTENT_KV "draft-${CUSTOMER_ID}" '${json}'`,
  { stdio: 'inherit' }
)

console.log(`✓ Seeded content-${CUSTOMER_ID} and draft-${CUSTOMER_ID}`)
