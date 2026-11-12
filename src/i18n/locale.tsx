import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getContent, type Locale, type SiteContent } from '../content'
import { safeGet, safeSet } from '../lib/storage'
import { detectLocale } from './detectLocale'

const KEY = 'rizzios.locale'

interface LocaleValue {
  locale: Locale
  setLocale(l: Locale): void
  content: SiteContent
}

const LocaleContext = createContext<LocaleValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() =>
    detectLocale(safeGet(KEY), navigator.languages ?? [navigator.language]),
  )

  useEffect(() => {
    document.documentElement.lang = locale === 'pt' ? 'pt-BR' : 'en'
  }, [locale])

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    safeSet(KEY, l)
  }, [])

  const value = useMemo(
    () => ({ locale, setLocale, content: getContent(locale) }),
    [locale, setLocale],
  )
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- hook colocated with its provider
export function useLocale(): LocaleValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}
