/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pt } from './content/pt'

const html = readFileSync(resolve(__dirname, '../index.html'), 'utf8')
const doc = new DOMParser().parseFromString(html, 'text/html')
const meta = (sel: string) => doc.querySelector(sel)?.getAttribute('content')

describe('index.html metadata', () => {
  it('defaults to pt-BR with the PT title and description', () => {
    expect(doc.documentElement.lang).toBe('pt-BR')
    expect(doc.title).toBe(pt.meta.title)
    expect(doc.title).toBe('Gabriel Rizzi · RizziOS')
    expect(meta('meta[name="description"]')).toBe(pt.meta.description)
  })

  it('has Open Graph title/description and no og:image yet', () => {
    expect(meta('meta[property="og:title"]')).toBe(pt.meta.title)
    expect(meta('meta[property="og:description"]')).toBe(pt.meta.description)
    expect(meta('meta[property="og:type"]')).toBe('website')
    expect(doc.querySelector('meta[property="og:image"]')).toBeNull()
  })

  it('has theme-color for the light and dark paper', () => {
    const colors = [...doc.querySelectorAll('meta[name="theme-color"]')].map((m) => [
      m.getAttribute('media'),
      m.getAttribute('content'),
    ])
    expect(colors).toEqual([
      ['(prefers-color-scheme: light)', '#f1ede4'],
      ['(prefers-color-scheme: dark)', '#141625'],
    ])
  })
})
