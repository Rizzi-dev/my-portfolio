import { useEffect, useRef } from 'react'
import type { MouseEvent } from 'react'
import { AppIcon } from '@/apps/AppIcon'
import { APP_ORDER, type AppId } from '@/content'
import { useLocale } from '@/i18n/locale'
import { Clock } from '@/os/Clock'
import { LocaleToggle } from '@/os/LocaleToggle'
import { ThemeToggle } from '@/os/ThemeToggle'
import { useTheme } from '@/theme/theme'
import { barRing, focusRing } from '@/os/focusStyles'

type MobileHomeProps = {
  onOpen(id: AppId): void
  onList(): void
  /** App whose button should get focus when the home screen mounts (returning from it). */
  takeReturnFocus(): AppId | null
}

const barButton = `grid min-h-11 min-w-11 cursor-pointer place-items-center px-1 leading-none hover:bg-menubar-fg hover:text-menubar ${barRing}`

/** RizziOS phone home screen: status bar, identity card, app grid and the list link. */
export function MobileHome({ onOpen, onList, takeReturnFocus }: MobileHomeProps) {
  const { locale, setLocale, content } = useLocale()
  const { theme, toggleTheme } = useTheme()
  const { ui, apps, profile } = content
  const buttons = useRef(new Map<AppId, HTMLButtonElement>())

  useEffect(() => {
    const id = takeReturnFocus()
    if (id) buttons.current.get(id)?.focus()
  }, [takeReturnFocus])

  function list(e: MouseEvent) {
    e.preventDefault()
    onList()
  }

  return (
    <div className="desktop-grid flex min-h-dvh flex-col text-text">
      <header className="sticky top-0 z-10 flex h-11 items-center gap-1 bg-menubar px-2 font-os text-[18px] text-menubar-fg">
        <span className="bg-yellow px-1.5 leading-7 text-ink">RizziOS</span>
        <Clock className="ml-1" />
        <div className="ml-auto flex items-center">
          <LocaleToggle
            label={ui.localeLabel}
            locale={locale}
            onLocale={setLocale}
            separator
            buttonClassName={barButton}
            activeClassName="underline underline-offset-4"
            inactiveClassName="opacity-80"
          />
          <ThemeToggle ui={ui} theme={theme} onToggle={toggleTheme} className={barButton} />
        </div>
      </header>

      <main id="conteudo" className="flex flex-1 flex-col px-4 pt-6 pb-8">
        <section
          aria-labelledby="mobile-identidade"
          className="overflow-hidden rounded-[10px] border-2 border-line bg-surface shadow-[6px_6px_0_var(--shadow-color)]"
        >
          <div
            aria-hidden="true"
            className="flex h-8 items-center gap-2 border-b-2 border-line bg-accent px-2.5 text-ink"
          >
            <span className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <i key={i} className="block size-3 rounded-full border-2 border-current bg-white" />
              ))}
            </span>
            <span className="font-os text-[19px] leading-none">{apps.sobre.windowTitle}</span>
          </div>
          <div className="space-y-1.5 px-4 pt-3.5 pb-4">
            <h1
              id="mobile-identidade"
              className="font-ui text-3xl font-extrabold tracking-tight"
            >
              {profile.name}
            </h1>
            <p className="font-body text-base">{profile.role}</p>
            <p className="font-body text-base font-bold">{profile.company}</p>
          </div>
        </section>

        <nav aria-label={ui.appsLabel} className="mt-8">
          <ul role="list" className="grid grid-cols-3 gap-x-1 gap-y-5 min-[520px]:grid-cols-4">
            {APP_ORDER.map((id) => (
              <li key={id} className="flex justify-center">
                <button
                  type="button"
                  ref={(el) => {
                    if (el) buttons.current.set(id, el)
                    else buttons.current.delete(id)
                  }}
                  onClick={() => onOpen(id)}
                  className={`group flex min-h-11 w-full min-w-11 cursor-pointer flex-col items-center gap-1.5 rounded-[10px] py-1.5 ${focusRing}`}
                >
                  <AppIcon id={id} size={56} />
                  {/* Whole words only: 17px VT323 fits "acessibilidade" in a 360px-wide grid cell. */}
                  <span className="rounded-[3px] bg-paper px-0.5 text-center font-os text-[17px] leading-none whitespace-nowrap group-hover:bg-accent group-hover:text-ink">
                    {apps[id].iconLabel}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <p className="mt-auto pt-10 text-center">
          <a
            href="#/lista"
            onClick={list}
            className={`inline-flex min-h-11 items-center rounded-[6px] border-2 border-line bg-surface px-4 font-ui text-sm font-semibold text-text underline decoration-2 underline-offset-2 shadow-[3px_3px_0_var(--shadow-color)] hover:bg-accent hover:text-ink ${focusRing}`}
          >
            {ui.listVersion}
          </a>
        </p>
      </main>
    </div>
  )
}
