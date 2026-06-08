// src/hooks/useContent.js
import { useState, useEffect } from 'react'
import { DEFAULT_CONTENT } from '../content-schema.js'

export function useContent() {
  const [content, setContent] = useState(DEFAULT_CONTENT)

  useEffect(() => {
    fetch('/api/content')
      .then(r => r.json())
      .then(data => { if (data?.meta) setContent(data) })
      .catch(() => {}) // keep default on error
  }, [])

  return content
}
