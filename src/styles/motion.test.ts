/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Vitest blanks CSS imports, so read the stylesheet directly.
const css = readFileSync(resolve(__dirname, '../index.css'), 'utf8')
const ms = (s: string) => [...s.matchAll(/(\d+)ms/g)].map((m) => Number(m[1]))

describe('motion', () => {
  it('window open/close/minimize animations last at most 150 ms', () => {
    const motion = css.slice(css.indexOf('/* motion'))
    expect(motion).toContain('.rz-window')
    expect(motion).toContain('@starting-style')
    expect(motion).toContain('::view-transition-old(rz-window-out)')
    expect(ms(motion).length).toBeGreaterThan(0)
    for (const d of ms(motion)) expect(d).toBeLessThanOrEqual(150)
  })

  it('removes every transition and animation under prefers-reduced-motion', () => {
    const i = css.indexOf('@media (prefers-reduced-motion: reduce)')
    expect(i).toBeGreaterThan(-1)
    const block = css.slice(i)
    expect(block).toMatch(/transition:\s*none\s*!important/)
    expect(block).toMatch(/animation:\s*none\s*!important/)
    expect(block).toContain('::view-transition-group(*)')
  })

  it('nothing blinks', () => {
    expect(css).not.toMatch(/blink|infinite/)
  })
})
