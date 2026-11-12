import { describe, expect, it, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { ThemeProvider, useTheme } from './theme'
import { detectTheme } from './detectTheme'
import { setMatchMedia } from '../test/setup'

describe('detectTheme', () => {
  it('uses system dark', () => expect(detectTheme(null, true)).toBe('dark'))
  it('defaults light', () => expect(detectTheme(null, false)).toBe('light'))
  it('stored wins', () => expect(detectTheme('light', true)).toBe('light'))
  it('ignores invalid stored', () => expect(detectTheme('x', false)).toBe('light'))
})

function Probe() {
  const { theme, toggleTheme } = useTheme()
  return <button onClick={toggleTheme}>{theme}</button>
}

describe('ThemeProvider', () => {
  it('reads prefers-color-scheme', () => {
    setMatchMedia((q) => q.includes('prefers-color-scheme: dark'))
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
  it('toggles and survives throwing storage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )
    expect(document.documentElement.dataset.theme).toBe('light')
    act(() => screen.getByRole('button').click())
    expect(document.documentElement.dataset.theme).toBe('dark')
    vi.restoreAllMocks()
  })
})
