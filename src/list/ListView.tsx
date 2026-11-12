import type { MouseEvent } from 'react'
import { AppBody } from '@/apps/AppBody'
import { APP_ORDER, type AppId } from '@/content'
import { useLocale } from '@/i18n/locale'
import { focusRing, quietFocus, skipLink } from '@/os/focusStyles'
import { LocaleToggle } from '@/os/LocaleToggle'
import { ThemeToggle } from '@/os/ThemeToggle'
import { useTheme } from '@/theme/theme'

// Ring sits outside (offset 2) on the paper page, whatever the button's own fill.
const controlBase = `inline-flex min-h-8 min-w-8 cursor-pointer items-center justify-center rounded-[6px] border-2 border-line px-3 py-1 font-ui text-sm font-semibold ${focusRing}`
const idle = 'bg-surface text-text hover:bg-accent hover:text-ink'
const control = `${controlBase} ${idle}`

const sectionId = (id: AppId) => `lista-${id}`
const headingId = (id: AppId) => `lista-${id}-titulo`

/** Scroll to an app's section and focus its heading (contents nav and in-app links). */
function goTo(id: AppId) {
  const section = document.getElementById(sectionId(id))
  section?.scrollIntoView?.()
  document.getElementById(headingId(id))?.focus()
}

export function ListView({ onBack }: { onBack(): void }) {
  const { locale, setLocale, content } = useLocale()
  const { theme, toggleTheme } = useTheme()
  const { ui, apps, profile } = content

  function skip(e: MouseEvent) {
    e.preventDefault()
    document.querySelector<HTMLElement>('main h2')?.focus()
  }

  return (
    <div className="min-h-dvh bg-paper text-text">
      <a
        href="#conteudo"
        onClick={skip}
        className={skipLink}
      >
        {ui.skipToContent}
      </a>
      <div className="mx-auto max-w-[70ch] px-5 py-10 sm:py-14">
        <header className="space-y-4 border-b-2 border-line pb-8">
          <h1 className="font-ui text-4xl font-extrabold tracking-tight">{profile.name}</h1>
          <p className="font-body text-lg">
            {profile.role} · {profile.company}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={onBack} className={control}>
              {ui.backToDesktop}
            </button>
            <LocaleToggle
              label={ui.localeLabel}
              locale={locale}
              onLocale={setLocale}
              className="gap-1"
              buttonClassName={controlBase}
              activeClassName="bg-accent text-ink underline decoration-2 underline-offset-4"
              inactiveClassName={idle}
            />
            <ThemeToggle ui={ui} theme={theme} onToggle={toggleTheme} className={control} />
          </div>
        </header>

        <nav aria-label={ui.contentsLabel} className="border-b-2 border-line py-6">
          <ul role="list" className="flex flex-wrap gap-2">
            {APP_ORDER.map((id) => (
              <li key={id}>
                <a
                  href="#/lista"
                  onClick={(e) => {
                    e.preventDefault()
                    goTo(id)
                  }}
                  className={control}
                >
                  {apps[id].heading}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <main id="conteudo">
          {APP_ORDER.map((id) => (
            <section
              key={id}
              id={sectionId(id)}
              aria-labelledby={headingId(id)}
              className="border-b-2 border-line py-10 last:border-b-0"
            >
              <div className="mb-5 flex flex-wrap items-baseline gap-x-3">
                <h2
                  id={headingId(id)}
                  tabIndex={-1}
                  className={`font-ui text-2xl font-extrabold tracking-tight ${quietFocus}`}
                >
                  {apps[id].heading}
                </h2>
                <span aria-hidden="true" className="font-os text-lg opacity-70">
                  {apps[id].windowTitle}
                </span>
              </div>
              <AppBody blocks={apps[id].blocks} ui={ui} headingLevel={3} onInternalLink={goTo} />
            </section>
          ))}
        </main>
      </div>
    </div>
  )
}
