import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { APP_ORDER } from '../content'
import { parseHash, toHash, type Route } from './route'
import { useHashRoute } from './useHashRoute'

describe('route', () => {
  it('round-trips every app id', () => {
    for (const id of APP_ORDER) {
      const r: Route = { view: 'os', app: id }
      expect(toHash(r)).toBe(`#/app/${id}`)
      expect(parseHash(toHash(r))).toEqual(r)
    }
  })

  it('round-trips list and empty', () => {
    expect(parseHash('#/lista')).toEqual({ view: 'list' })
    expect(toHash({ view: 'list' })).toBe('#/lista')
    expect(toHash({ view: 'os', app: null })).toBe('')
  })

  it('falls back to os for unknown input', () => {
    const os = { view: 'os', app: null }
    expect(parseHash('#/app/xyz')).toEqual(os)
    expect(parseHash('#/qualquer')).toEqual(os)
    expect(parseHash('')).toEqual(os)
  })
})

describe('useHashRoute', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/')
  })

  it.each(['#/qualquer', '#/app/xyz'])(
    'replaces an unknown hash (%s) with the empty route, without a history entry',
    (hash) => {
      window.history.replaceState(null, '', `/${hash}`)
      const before = window.history.length
      const { result } = renderHook(() => useHashRoute())
      expect(result.current[0]).toEqual({ view: 'os', app: null })
      expect(window.location.hash).toBe('')
      expect(window.location.href.endsWith('#')).toBe(false)
      expect(window.history.length).toBe(before)
    },
  )

  it('updates on hashchange', () => {
    const { result } = renderHook(() => useHashRoute())
    expect(result.current[0]).toEqual({ view: 'os', app: null })
    act(() => {
      window.location.hash = '#/app/fervo'
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    })
    expect(result.current[0]).toEqual({ view: 'os', app: 'fervo' })
  })

  it('setter pushes, clears and replaces', () => {
    const { result } = renderHook(() => useHashRoute())
    act(() => result.current[1]({ view: 'list' }))
    expect(window.location.hash).toBe('#/lista')
    expect(result.current[0]).toEqual({ view: 'list' })
    act(() => result.current[1]({ view: 'os', app: null }))
    expect(window.location.hash).toBe('')
    expect(window.location.href.endsWith('#')).toBe(false)
    expect(result.current[0]).toEqual({ view: 'os', app: null })
    act(() => result.current[1]({ view: 'os', app: 'stack' }, { replace: true }))
    expect(window.location.hash).toBe('#/app/stack')
    expect(result.current[0]).toEqual({ view: 'os', app: 'stack' })
  })
})
