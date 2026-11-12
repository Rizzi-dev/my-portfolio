export type Locale = 'pt' | 'en'

export type AppId =
  | 'sobre'
  | 'fervo'
  | 'fittrack'
  | 'experiencia'
  | 'stack'
  | 'acessibilidade'
  | 'formacao'
  | 'contato'

export type Link = { label: string; href: string; external: boolean }

export type Block =
  | { type: 'heading'; text: string }
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'chips'; items: string[] }
  | { type: 'badge'; text: string }
  | { type: 'links'; links: Link[] }
  | {
      type: 'timeline'
      entries: { period: string; role: string; org: string; text: string }[]
    }
  | { type: 'table'; caption: string; head: string[]; rows: string[][] }

export type AppContent = {
  iconLabel: string
  windowTitle: string
  heading: string
  blocks: Block[]
}

export type UiStrings = {
  skipToContent: string
  menuFile: string
  menuProjects: string
  menuContact: string
  listVersion: string
  backToDesktop: string
  close: string
  minimize: string
  back: string
  opensNewSite: string
  themeToggle: string
  themeLight: string
  themeDark: string
  localeLabel: string
  desktopIconsLabel: string
  dockLabel: string
  appsLabel: string
  shortcutsHelp: string
  contentsLabel: string
}

export type SiteContent = {
  locale: Locale
  meta: { title: string; description: string }
  profile: { name: string; role: string; company: string }
  ui: UiStrings
  apps: Record<AppId, AppContent>
}
