import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import * as axeMatchers from 'vitest-axe/matchers'
import { afterEach, beforeEach, expect } from 'vitest'
import { installMatchMedia, resetMatchMedia } from './matchMedia'

expect.extend(axeMatchers)

export { setMatchMedia } from './matchMedia'

installMatchMedia()

// jsdom has no canvas; axe probes it. Return null so test output stays clean.
HTMLCanvasElement.prototype.getContext = (() =>
  null) as typeof HTMLCanvasElement.prototype.getContext

beforeEach(() => {
  resetMatchMedia()
  installMatchMedia()
  Object.defineProperty(window.navigator, 'languages', {
    value: ['pt-BR'],
    configurable: true,
  })
  Object.defineProperty(window.navigator, 'language', {
    value: 'pt-BR',
    configurable: true,
  })
  localStorage.clear()
})

afterEach(() => {
  cleanup()
})
