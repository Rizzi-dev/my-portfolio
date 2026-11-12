import type { Locale } from '../content'

export function detectLocale(
  stored: string | null,
  languages: readonly string[],
): Locale {
  if (stored === 'pt' || stored === 'en') return stored
  return languages.some((l) => l.toLowerCase().startsWith('pt')) ? 'pt' : 'en'
}
