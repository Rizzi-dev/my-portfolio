type Matcher = (query: string) => boolean
type Listener = (e: MediaQueryListEvent) => void

const desktop: Matcher = () => false
let matcher: Matcher = desktop

// Every listener registered on any MediaQueryList, with the query it watches.
const listeners = new Set<{ query: string; fn: Listener }>()

/**
 * Control what window.matchMedia reports. Reset to desktop before each test.
 * Registered `change` listeners (addEventListener and legacy addListener) are
 * notified when their query's result flips; wrap calls after render in act().
 */
export function setMatchMedia(next: Matcher) {
  const prev = matcher
  matcher = next
  for (const { query, fn } of [...listeners]) {
    const matches = next(query)
    if (matches !== prev(query)) {
      fn({ matches, media: query } as MediaQueryListEvent)
    }
  }
}

export function resetMatchMedia() {
  matcher = desktop
  listeners.clear()
}

export function installMatchMedia() {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string): MediaQueryList => {
      const entries = new Map<Listener, { query: string; fn: Listener }>()
      const add = (fn: Listener) => {
        if (entries.has(fn)) return
        const entry = { query, fn }
        entries.set(fn, entry)
        listeners.add(entry)
      }
      const remove = (fn: Listener) => {
        const entry = entries.get(fn)
        if (!entry) return
        entries.delete(fn)
        listeners.delete(entry)
      }
      return {
        get matches() {
          return matcher(query)
        },
        media: query,
        onchange: null,
        addListener: add,
        removeListener: remove,
        addEventListener: (type: string, fn: Listener) => {
          if (type === 'change') add(fn)
        },
        removeEventListener: (type: string, fn: Listener) => {
          if (type === 'change') remove(fn)
        },
        dispatchEvent: () => false,
      } as unknown as MediaQueryList
    },
  })
}
