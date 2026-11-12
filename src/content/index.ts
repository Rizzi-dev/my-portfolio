import { pt } from './pt'
import { en } from './en'
import type { AppId, Locale, SiteContent } from './types'

export * from './types'
export { CONTACT, FERVO_URL, FITTRACK_URL } from './config'

export const APP_ORDER: AppId[] = [
  'sobre',
  'fervo',
  'fittrack',
  'experiencia',
  'stack',
  'acessibilidade',
  'formacao',
  'contato',
]

const CONTENT: Record<Locale, SiteContent> = { pt, en }

export function getContent(locale: Locale): SiteContent {
  return CONTENT[locale]
}
