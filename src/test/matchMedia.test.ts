import { describe, expect, it, vi } from 'vitest'
import { setMatchMedia } from './setup'

describe('matchMedia test mock', () => {
  it('notifies addEventListener and legacy addListener listeners when the result flips', () => {
    const q = '(max-width: 767px)'
    const modern = vi.fn()
    const legacy = vi.fn()
    const mql = window.matchMedia(q)
    mql.addEventListener('change', modern)
    window.matchMedia(q).addListener(legacy)
    expect(mql.matches).toBe(false)

    setMatchMedia((query) => query === q)
    expect(mql.matches).toBe(true)
    expect(modern).toHaveBeenCalledWith(expect.objectContaining({ matches: true, media: q }))
    expect(legacy).toHaveBeenCalledTimes(1)

    setMatchMedia((query) => query === q) // no flip, no event
    expect(modern).toHaveBeenCalledTimes(1)

    mql.removeEventListener('change', modern)
    setMatchMedia(() => false)
    expect(modern).toHaveBeenCalledTimes(1)
    expect(legacy).toHaveBeenCalledTimes(2)
  })
})
