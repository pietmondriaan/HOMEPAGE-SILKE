// src/hooks/useContent.js
// Modulweite Singleton-Promise: /api/content wird genau EINMAL pro Pageload
// geholt, egal wie viele Komponenten den Hook nutzen. Der Fetch läuft lazy
// beim ersten Hook-Aufruf — der Preview-Fetch-Override (functions/preview)
// greift am window.fetch selbst und bleibt damit wirksam.
import { useState, useEffect } from 'react'
import { DEFAULT_CONTENT, mergeContent } from '../content-schema.js'

let contentPromise = null
let cachedContent = null

export function loadContent() {
  if (!contentPromise) {
    contentPromise = fetch('/api/content')
      .then((r) => r.json())
      .then((data) => {
        cachedContent = mergeContent(data)
        return cachedContent
      })
      .catch(() => {
        // bei Fehler: Defaults behalten
        cachedContent = DEFAULT_CONTENT
        return cachedContent
      })
  }
  return contentPromise
}

export function useContent() {
  const [content, setContent] = useState(() => cachedContent ?? DEFAULT_CONTENT)

  useEffect(() => {
    let active = true
    loadContent().then((c) => {
      if (active) setContent(c)
    })
    return () => { active = false }
  }, [])

  return content
}
