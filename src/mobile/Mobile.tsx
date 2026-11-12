import { useCallback, useEffect, useRef } from 'react'
import type { AppId } from '@/content'
import type { Route } from '@/os/route'
import { MobileApp } from './MobileApp'
import { MobileHome } from './MobileHome'

type MobileProps = {
  app: AppId | null
  navigate(r: Route, opts?: { replace?: boolean }): void
}

/**
 * RizziOS phone: home screen, or one app full screen. The route comes from the
 * single useHashRoute in App, so browser back (popstate/hashchange) resyncs it.
 */
export function Mobile({ app, navigate }: MobileProps) {
  // App whose history entry we pushed from the home screen (null if none / not current).
  const pushedFromHome = useRef<AppId | null>(null)
  // App to focus on the home grid when we return to it.
  const returnFocus = useRef<AppId | null>(null)

  useEffect(() => {
    if (app) returnFocus.current = app
    // Home, or an app we did not push (external hash change): Back must not history.back().
    if (app !== pushedFromHome.current) pushedFromHome.current = null
  }, [app])

  const takeReturnFocus = useCallback(() => {
    const id = returnFocus.current
    returnFocus.current = null
    return id
  }, [])

  function open(id: AppId) {
    pushedFromHome.current = id
    navigate({ view: 'os', app: id })
  }

  function back() {
    if (app && pushedFromHome.current === app) {
      pushedFromHome.current = null
      window.history.back()
    } else {
      navigate({ view: 'os', app: null }, { replace: true })
    }
  }

  if (app) return <MobileApp key={app} id={app} onBack={back} />
  return (
    <MobileHome
      onOpen={open}
      onList={() => navigate({ view: 'list' })}
      takeReturnFocus={takeReturnFocus}
    />
  )
}
