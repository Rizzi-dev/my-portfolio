import type { AppId } from '../content/types'

export type Viewport = { width: number; height: number }
export type Win = { id: AppId; x: number; y: number; z: number; minimized: boolean }
export type WMState = { windows: Win[]; nextZ: number }
export type WMAction =
  | { type: 'open'; id: AppId; viewport: Viewport }
  | { type: 'close'; id: AppId }
  | { type: 'focus'; id: AppId }
  | { type: 'minimize'; id: AppId }
  | { type: 'move'; id: AppId; x: number; y: number; viewport: Viewport }
  | { type: 'cycle'; direction: 1 | -1 }

/** Default window size; the height is a maximum, see windowHeight(). */
export const WINDOW_SIZE = { width: 520, height: 600 }
export const MENU_BAR_H = 28
export const DOCK_RESERVE = 72
export const CASCADE = 28
/** Space kept between a window and the menu bar / dock. */
export const WINDOW_GAP = 8
export const MIN_WINDOW_H = 120

const TITLE_VISIBLE_W = 120
const TITLE_BAR_H = 32

/**
 * Height of a window whose top is at `y`: up to WINDOW_SIZE.height, never
 * reaching into the dock area. Window.tsx mirrors this in CSS with 100dvh.
 */
export function windowHeight(vp: Viewport, y: number): number {
  const room = vp.height - y - DOCK_RESERVE - WINDOW_GAP
  return Math.min(WINDOW_SIZE.height, Math.max(MIN_WINDOW_H, room))
}

export const initialWM: WMState = { windows: [], nextZ: 1 }

function clamp(x: number, y: number, vp: Viewport) {
  const maxX = Math.max(0, vp.width - TITLE_VISIBLE_W)
  const maxY = Math.max(MENU_BAR_H, vp.height - DOCK_RESERVE - TITLE_BAR_H)
  return {
    x: Math.round(Math.min(Math.max(x, 0), maxX)),
    y: Math.round(Math.min(Math.max(y, MENU_BAR_H), maxY)),
  }
}

export function activeWindow(s: WMState): Win | undefined {
  let best: Win | undefined
  for (const w of s.windows) {
    if (!w.minimized && (!best || w.z > best.z)) best = w
  }
  return best
}

function raise(s: WMState, id: AppId): WMState {
  return {
    windows: s.windows.map((w) => (w.id === id ? { ...w, z: s.nextZ, minimized: false } : w)),
    nextZ: s.nextZ + 1,
  }
}

export function wmReducer(s: WMState, a: WMAction): WMState {
  const exists = (id: AppId) => s.windows.some((w) => w.id === id)
  switch (a.type) {
    case 'open': {
      if (exists(a.id)) return raise(s, a.id)
      const last = s.windows[s.windows.length - 1] // last opened (array keeps open order)
      const { width, height } = a.viewport
      // Free area between menu bar and dock; the first window is centered in it.
      const free = height - MENU_BAR_H - DOCK_RESERVE - 2 * WINDOW_GAP
      const h = Math.min(WINDOW_SIZE.height, free)
      const raw = last
        ? { x: last.x + CASCADE, y: last.y + CASCADE }
        : {
            x: (width - WINDOW_SIZE.width) / 2,
            y: MENU_BAR_H + WINDOW_GAP + Math.max(0, (free - h) / 2),
          }
      const pos = clamp(raw.x, raw.y, a.viewport)
      return {
        windows: [...s.windows, { id: a.id, ...pos, z: s.nextZ, minimized: false }],
        nextZ: s.nextZ + 1,
      }
    }
    case 'close':
      return exists(a.id) ? { ...s, windows: s.windows.filter((w) => w.id !== a.id) } : s
    case 'focus':
      return exists(a.id) ? raise(s, a.id) : s
    case 'minimize':
      return exists(a.id)
        ? { ...s, windows: s.windows.map((w) => (w.id === a.id ? { ...w, minimized: true } : w)) }
        : s
    case 'move': {
      if (!exists(a.id)) return s
      const pos = clamp(a.x, a.y, a.viewport)
      return { ...s, windows: s.windows.map((w) => (w.id === a.id ? { ...w, ...pos } : w)) }
    }
    case 'cycle': {
      // Rotate through visible windows in stable (open) order, starting from the active one.
      const visible = s.windows.filter((w) => !w.minimized)
      const n = visible.length
      if (n < 2) return s
      const cur = visible.findIndex((w) => w.id === activeWindow(s)?.id)
      const target = visible[(((cur + a.direction) % n) + n) % n]
      return raise(s, target.id)
    }
  }
}
