/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Vitest blanks CSS imports (even ?raw), so read the file directly.
const tokens = readFileSync(resolve(__dirname, 'tokens.css'), 'utf8')

describe('tokens.css', () => {
  it('no @theme variable references itself (would be a cyclic custom property)', () => {
    const theme = tokens.slice(tokens.indexOf('@theme inline'))
    const pairs = [...theme.matchAll(/(--[\w-]+):\s*var\((--[\w-]+)\)/g)]
    expect(pairs.length).toBeGreaterThan(10)
    for (const [, name, ref] of pairs) expect(ref).not.toBe(name)
  })
})
