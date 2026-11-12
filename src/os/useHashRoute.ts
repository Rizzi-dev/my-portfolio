import { useCallback, useEffect, useState } from 'react'
import { parseHash, toHash, type Route } from './route'

/** Parse the current hash; an unknown one ('#/qualquer', '#/app/xyz') is replaced by '' (no history entry). */
function readRoute(): Route {
  const { hash, pathname, search } = window.location
  const route = parseHash(hash)
  if (hash !== '' && toHash(route) !== hash) {
    window.history.replaceState(window.history.state, '', pathname + search)
  }
  return route
}

export function useHashRoute(): [
  Route,
  (r: Route, opts?: { replace?: boolean }) => void,
] {
  const [route, setRouteState] = useState<Route>(readRoute)

  useEffect(() => {
    const sync = () => setRouteState(readRoute())
    window.addEventListener('hashchange', sync)
    window.addEventListener('popstate', sync)
    sync()
    return () => {
      window.removeEventListener('hashchange', sync)
      window.removeEventListener('popstate', sync)
    }
  }, [])

  const navigate = useCallback(
    (next: Route, opts?: { replace?: boolean }) => {
      const hash = toHash(next)
      const { pathname, search } = window.location
      if (opts?.replace) {
        window.history.replaceState(null, '', pathname + search + hash)
      } else if (hash === '') {
        window.history.pushState(null, '', pathname + search)
      } else {
        window.location.hash = hash
      }
      setRouteState(next)
    },
    [],
  )

  return [route, navigate]
}
