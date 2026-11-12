import { describe, expect, it, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { LocaleProvider, useLocale } from './locale'
import { detectLocale } from './detectLocale'

describe('detectLocale', () => {
  it('uses pt for pt-BR', () => expect(detectLocale(null, ['pt-BR'])).toBe('pt'))
  it('uses pt if any language is pt', () =>
    expect(detectLocale(null, ['en-US', 'pt'])).toBe('pt'))
  it('falls back to en', () => expect(detectLocale(null, ['fr'])).toBe('en'))
  it('stored wins', () => expect(detectLocale('en', ['pt-BR'])).toBe('en'))
  it('ignores invalid stored', () => expect(detectLocale('xx', ['fr'])).toBe('en'))
})

function Probe() {
  const { locale, setLocale } = useLocale()
  return <button onClick={() => setLocale('en')}>{locale}</button>
}

describe('LocaleProvider', () => {
  it('sets html lang and survives throwing storage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    render(
      <LocaleProvider>
        <Probe />
      </LocaleProvider>,
    )
    expect(document.documentElement.lang).toBe('pt-BR')
    act(() => screen.getByRole('button').click())
    expect(document.documentElement.lang).toBe('en')
    vi.restoreAllMocks()
  })
})
