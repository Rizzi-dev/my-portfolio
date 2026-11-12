import type { Locale } from '@/content'

type LocaleToggleProps = {
  label: string
  locale: Locale
  onLocale(l: Locale): void
  /** Classes for every button. */
  buttonClassName: string
  /** Extra classes for the pressed / unpressed button. */
  activeClassName?: string
  inactiveClassName?: string
  /** Visual "|" between the buttons (menu-bar style). */
  separator?: boolean
  className?: string
}

const LOCALES = ['pt', 'en'] as const

/**
 * Each language is named in itself, so it reads right whatever the page language.
 * The name starts with the visible "PT"/"EN" (WCAG 2.5.3 Label in Name).
 */
const LOCALE_META: Record<Locale, { name: string; lang: string }> = {
  pt: { name: 'PT – Português', lang: 'pt-BR' },
  en: { name: 'EN – English', lang: 'en' },
}

/** PT/EN switch: a labelled group of two toggle buttons (aria-pressed), named "PT – Português"/"EN – English". */
export function LocaleToggle({
  label,
  locale,
  onLocale,
  buttonClassName,
  activeClassName = '',
  inactiveClassName = '',
  separator = false,
  className = '',
}: LocaleToggleProps) {
  return (
    <div role="group" aria-label={label} className={`flex items-center ${className}`}>
      {LOCALES.map((l, i) => (
        <span key={l} className="flex items-center">
          {separator && i > 0 && <span aria-hidden="true">|</span>}
          <button
            type="button"
            aria-pressed={locale === l}
            aria-label={LOCALE_META[l].name}
            lang={LOCALE_META[l].lang}
            onClick={() => onLocale(l)}
            className={`${buttonClassName} ${locale === l ? activeClassName : inactiveClassName}`}
          >
            {l.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  )
}
