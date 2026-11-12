import { APP_ORDER, type AppId } from '../content'

export type Route = { view: 'os'; app: AppId | null } | { view: 'list' }

export function parseHash(hash: string): Route {
  if (hash === '#/lista') return { view: 'list' }
  const m = /^#\/app\/([^/]+)$/.exec(hash)
  if (m) {
    const id = m[1] as AppId
    if (APP_ORDER.includes(id)) return { view: 'os', app: id }
  }
  return { view: 'os', app: null }
}

export function toHash(route: Route): string {
  if (route.view === 'list') return '#/lista'
  return route.app ? `#/app/${route.app}` : ''
}
