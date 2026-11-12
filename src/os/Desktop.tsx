import { useEffect, useReducer, useRef } from 'react'
import { flushSync } from 'react-dom'
import type { MouseEvent } from 'react'
import type { AppId } from '@/content'
import { useLocale } from '@/i18n/locale'
import { useTheme } from '@/theme/theme'
import { DesktopIcons } from './DesktopIcons'
import { skipLink } from './focusStyles'
import { Dock } from './Dock'
import { MenuBar } from './MenuBar'
import { toHash, type Route } from './route'
import { Window } from './Window'
import { activeWindow, initialWM, wmReducer, type WMAction, type WMState } from './windowManager'

const viewport = () => ({ width: window.innerWidth, height: window.innerHeight })

/** First visit opens `sobre` (R4: without touching the hash); `#/app/X` opens X instead. */
function initWM(route: Route): WMState {
  const id = route.view === 'os' && route.app ? route.app : 'sobre'
  return wmReducer(initialWM, { type: 'open', id, viewport: viewport() })
}

type PendingFocus = { title: AppId } | { activeTitle: true } | { el: HTMLElement }

/** Typing targets keep their own Alt+Shift+Arrow (word selection). */
const isEditable = (t: EventTarget | null) =>
  t instanceof HTMLElement &&
  (t.isContentEditable || !!t.closest('input, textarea, select, [contenteditable="true"]'))

/**
 * Run `update` (which removes the window `id`) inside a view transition so the
 * window can fade/scale out (index.css). Instant without support or with reduced motion.
 */
function leaveWithTransition(id: AppId, update: () => void) {
  const el = document.querySelector<HTMLElement>(`[data-window="${id}"]`)
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (typeof document.startViewTransition !== 'function' || reduce || !el) return update()
  el.style.setProperty('view-transition-name', 'rz-window-out')
  document.startViewTransition(() => flushSync(update))
}

const isUsable = (el: HTMLElement | undefined): el is HTMLElement =>
  !!el && el.isConnected && !el.closest('[hidden]')

type DesktopProps = {
  /** Route and navigate from App's single useHashRoute instance (R17). */
  route: Route
  navigate(r: Route, opts?: { replace?: boolean }): void
}

export function Desktop({ route, navigate }: DesktopProps) {
  const { locale, setLocale, content } = useLocale()
  const { theme, toggleTheme } = useTheme()
  const [wm, dispatch] = useReducer(wmReducer, route, initWM)

  const wmRef = useRef(wm)
  const titles = useRef(new Map<AppId, HTMLHeadingElement>())
  const openers = useRef(new Map<AppId, HTMLElement>())
  const pendingFocus = useRef<PendingFocus | null>(null)
  // Windows whose close transition has not run yet (a held Esc repeats closeApp).
  const closing = useRef(new Set<AppId>())
  const { ui, apps } = content
  const active = activeWindow(wm)

  useEffect(() => {
    wmRef.current = wm
  })

  // Move focus once the DOM reflects the last window-manager change.
  useEffect(() => {
    const p = pendingFocus.current
    if (!p) return
    pendingFocus.current = null
    if ('el' in p) p.el.focus()
    else {
      const id = 'title' in p ? p.title : activeWindow(wm)?.id
      if (id) titles.current.get(id)?.focus()
    }
  })

  const dockButton = (id: AppId) =>
    document.querySelector<HTMLElement>(`[data-dock-app="${id}"]`) ?? undefined

  /** Keep the hash pointing at the active window after a change (R4). */
  function syncHash(next: WMState, replace: boolean) {
    const r: Route = { view: 'os', app: activeWindow(next)?.id ?? null }
    if (toHash(r) !== window.location.hash) navigate(r, { replace })
  }

  /** Reads wmRef (not the render-time `wm`) so deferred callers see the current state. */
  function apply(action: WMAction, opts: { hash?: 'push' | 'replace'; focus?: PendingFocus }) {
    const next = wmReducer(wmRef.current, action)
    wmRef.current = next
    dispatch(action)
    if (opts.focus) pendingFocus.current = opts.focus
    if (opts.hash) syncHash(next, opts.hash === 'replace')
  }

  function openApp(id: AppId, opener?: HTMLElement) {
    if (opener && !wm.windows.some((w) => w.id === id)) openers.current.set(id, opener)
    apply({ type: 'open', id, viewport: viewport() }, { hash: 'push', focus: { title: id } })
  }

  function closeApp(id: AppId) {
    if (closing.current.has(id)) return
    closing.current.add(id)
    const opener = openers.current.get(id)
    openers.current.delete(id)
    const back = isUsable(opener) ? opener : dockButton(id)
    leaveWithTransition(id, () => {
      closing.current.delete(id)
      // Runs later (view transition): decide from the state at that moment.
      const wasActive = activeWindow(wmRef.current)?.id === id
      apply(
        { type: 'close', id },
        { hash: wasActive ? 'replace' : undefined, focus: back && { el: back } },
      )
    })
  }

  function minimizeApp(id: AppId) {
    const dockBtn = dockButton(id)
    apply(
      { type: 'minimize', id },
      { hash: active?.id === id ? 'replace' : undefined, focus: dockBtn && { el: dockBtn } },
    )
  }

  /** Pointer focus is a deliberate switch (push); Tab between windows must not grow history. */
  function focusApp(id: AppId, via: 'pointer' | 'keyboard') {
    if (active?.id === id) return
    apply({ type: 'focus', id }, { hash: via === 'pointer' ? 'push' : 'replace' })
  }

  // Latest handlers for document/window listeners registered once.
  const handlers = useRef<{ cycle(d: 1 | -1): void; openFromHash(id: AppId): void }>({
    cycle: () => {},
    openFromHash: () => {},
  })
  useEffect(() => {
    handlers.current = {
      cycle: (direction) =>
        apply({ type: 'cycle', direction }, { hash: 'replace', focus: { activeTitle: true } }),
      openFromHash: (id) => {
        if (activeWindow(wmRef.current)?.id === id) return
        pendingFocus.current = { title: id }
        dispatch({ type: 'open', id, viewport: viewport() })
      },
    }
  })

  // Back/forward or a typed hash to #/app/X opens/focuses X; '' leaves windows alone.
  const routeApp = route.view === 'os' ? route.app : null
  useEffect(() => {
    if (routeApp) handlers.current.openFromHash(routeApp)
  }, [routeApp])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Alt+Shift+Arrow: Ctrl+Option+Arrow is VoiceOver's own navigation command.
      if (!e.altKey || !e.shiftKey || e.ctrlKey || e.metaKey) return
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
      if (isEditable(e.target)) return
      e.preventDefault()
      handlers.current.cycle(e.key === 'ArrowRight' ? 1 : -1)
    }
    const onResize = () => {
      for (const w of wmRef.current.windows) {
        dispatch({ type: 'move', id: w.id, x: w.x, y: w.y, viewport: viewport() })
      }
    }
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onResize)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  function skipToContent(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault()
    const target =
      (active && titles.current.get(active.id)) ||
      document.querySelector<HTMLElement>('[data-desktop-icon]')
    target?.focus()
  }

  return (
    <div className="desktop-grid relative h-dvh w-full overflow-hidden text-text">
      <a href="#conteudo" data-skip-link onClick={skipToContent} className={skipLink}>
        {ui.skipToContent}
      </a>
      <MenuBar
        ui={ui}
        apps={apps}
        locale={locale}
        onLocale={setLocale}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpen={openApp}
        onList={() => navigate({ view: 'list' })}
      />
      <main id="conteudo" className="absolute inset-0 isolate">
        <DesktopIcons ui={ui} apps={apps} onOpen={openApp} />
        {wm.windows.map((w) => (
          <Window
            key={w.id}
            win={w}
            app={apps[w.id]}
            ui={ui}
            active={active?.id === w.id}
            onClose={() => closeApp(w.id)}
            onMinimize={() => minimizeApp(w.id)}
            onFocus={(via) => focusApp(w.id, via)}
            onMove={(x, y) => dispatch({ type: 'move', id: w.id, x, y, viewport: viewport() })}
            titleRef={(el) => {
              if (el) titles.current.set(w.id, el)
              else titles.current.delete(w.id)
            }}
          />
        ))}
      </main>
      <Dock ui={ui} apps={apps} windows={wm.windows} onOpen={openApp} />
    </div>
  )
}
