import { describe, expect, it } from 'vitest'
import {
  CASCADE,
  DOCK_RESERVE,
  MENU_BAR_H,
  WINDOW_GAP,
  WINDOW_SIZE,
  activeWindow,
  windowHeight,
  initialWM,
  wmReducer,
  type WMAction,
  type WMState,
} from './windowManager'

const vp = { width: 800, height: 500 }
const run = (actions: WMAction[], s: WMState = initialWM) => actions.reduce(wmReducer, s)
const open = (id: 'sobre' | 'fervo' | 'stack'): WMAction => ({ type: 'open', id, viewport: vp })

describe('wmReducer', () => {
  it('open adds one window with highest z, centered for the first', () => {
    const s = run([open('sobre')])
    expect(s.windows).toHaveLength(1)
    // 500px tall: the window shrinks to fit between menu bar and dock, gap above.
    expect(s.windows[0]).toMatchObject({ x: 140, y: MENU_BAR_H + WINDOW_GAP })
    const s2 = wmReducer(s, open('fervo'))
    expect(s2.windows[1].z).toBeGreaterThan(s2.windows[0].z)
    expect(s2.windows[1].x).toBe(s2.windows[0].x + CASCADE)
  })

  it('windows are min(600px, available height) tall and centered in the free area', () => {
    expect(WINDOW_SIZE.height).toBe(600)
    const big = { width: 1440, height: 900 }
    const [w] = wmReducer(initialWM, { type: 'open', id: 'sobre', viewport: big }).windows
    expect(w).toMatchObject({ x: 460, y: 128 })
    expect(windowHeight(big, w.y)).toBe(600)
    const [small] = run([open('sobre')]).windows
    const h = windowHeight(vp, small.y)
    expect(h).toBe(500 - MENU_BAR_H - DOCK_RESERVE - 2 * WINDOW_GAP)
    expect(small.y + h).toBe(500 - DOCK_RESERVE - WINDOW_GAP) // bottom clears the dock
    expect(windowHeight(vp, 500)).toBe(120) // never collapses below a usable minimum
  })

  it('cascades from the last opened window, not the focused one', () => {
    const s = run([open('sobre'), open('fervo'), { type: 'focus', id: 'sobre' }, open('stack')])
    const by = (id: string) => s.windows.find((w) => w.id === id)!
    expect(by('stack').x).toBe(by('fervo').x + CASCADE)
    expect(by('stack').y).toBe(by('fervo').y + CASCADE)
  })

  it('reopening does not duplicate, unminimizes and raises', () => {
    let s = run([open('sobre'), open('fervo'), { type: 'minimize', id: 'sobre' }])
    s = wmReducer(s, open('sobre'))
    expect(s.windows).toHaveLength(2)
    const w = s.windows.find((x) => x.id === 'sobre')!
    expect(w.minimized).toBe(false)
    expect(activeWindow(s)?.id).toBe('sobre')
  })

  it('close removes', () => {
    const s = run([open('sobre'), open('fervo'), { type: 'close', id: 'sobre' }])
    expect(s.windows.map((w) => w.id)).toEqual(['fervo'])
  })

  it('focus raises z', () => {
    const s = run([open('sobre'), open('fervo'), { type: 'focus', id: 'sobre' }])
    expect(activeWindow(s)?.id).toBe('sobre')
  })

  it('minimize hides and active falls to the next', () => {
    const s = run([open('sobre'), open('fervo'), { type: 'minimize', id: 'fervo' }])
    expect(s.windows.find((w) => w.id === 'fervo')!.minimized).toBe(true)
    expect(activeWindow(s)?.id).toBe('sobre')
  })

  it('unknown ids return the same state', () => {
    const s = run([open('sobre')])
    for (const type of ['close', 'focus', 'minimize'] as const) {
      expect(wmReducer(s, { type, id: 'stack' })).toBe(s)
    }
    expect(wmReducer(s, { type: 'move', id: 'stack', x: 1, y: 1, viewport: vp })).toBe(s)
  })

  it('cycle rotates through all windows and wraps', () => {
    const s0 = run([open('sobre'), open('fervo'), open('stack')])
    expect(activeWindow(s0)?.id).toBe('stack')
    const s1 = wmReducer(s0, { type: 'cycle', direction: 1 })
    const s2 = wmReducer(s1, { type: 'cycle', direction: 1 })
    const s3 = wmReducer(s2, { type: 'cycle', direction: 1 })
    expect([s1, s2, s3].map((s) => activeWindow(s)?.id)).toEqual(['sobre', 'fervo', 'stack'])
    expect(activeWindow(wmReducer(s0, { type: 'cycle', direction: -1 }))?.id).toBe('fervo')
  })

  it('cycle is a no-op with 0 or 1 visible windows and skips minimized', () => {
    expect(wmReducer(initialWM, { type: 'cycle', direction: 1 })).toBe(initialWM)
    const s = run([open('sobre'), open('fervo'), { type: 'minimize', id: 'fervo' }])
    expect(wmReducer(s, { type: 'cycle', direction: 1 })).toBe(s)
  })

  it('keeps the title bar inside the viewport and clamps move', () => {
    let s = run([open('sobre'), open('fervo'), open('stack')])
    for (const w of s.windows) {
      expect(w.x).toBeGreaterThanOrEqual(0)
      expect(w.x).toBeLessThanOrEqual(800 - 120)
      expect(w.y).toBeGreaterThanOrEqual(MENU_BAR_H)
      expect(w.y).toBeLessThanOrEqual(500 - DOCK_RESERVE - 32)
    }
    s = wmReducer(s, { type: 'move', id: 'sobre', x: -500, y: -500, viewport: vp })
    expect(s.windows.find((w) => w.id === 'sobre')).toMatchObject({ x: 0, y: MENU_BAR_H })
    s = wmReducer(s, { type: 'move', id: 'sobre', x: 5000, y: 5000, viewport: vp })
    expect(s.windows.find((w) => w.id === 'sobre')).toMatchObject({
      x: 800 - 120,
      y: 500 - DOCK_RESERVE - 32,
    })
  })

  it('does not mutate previous state', () => {
    const s = run([open('sobre')])
    const snap = JSON.stringify(s)
    wmReducer(s, open('fervo'))
    wmReducer(s, { type: 'focus', id: 'sobre' })
    expect(JSON.stringify(s)).toBe(snap)
  })
})
