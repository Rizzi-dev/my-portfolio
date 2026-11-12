import { useEffect, useRef } from 'react'
import { AppBody } from '@/apps/AppBody'
import type { AppId } from '@/content'
import { useLocale } from '@/i18n/locale'
import { inkFocusRing, quietFocus } from '@/os/focusStyles'

type MobileAppProps = { id: AppId; onBack(): void }

/** An app opened full screen on the RizziOS phone. Focus lands on its title; Esc goes back. */
export function MobileApp({ id, onBack }: MobileAppProps) {
  const { content } = useLocale()
  const { ui } = content
  const app = content.apps[id]
  const titleRef = useRef<HTMLHeadingElement>(null)
  const backRef = useRef(onBack)

  useEffect(() => {
    backRef.current = onBack
  })

  // Esc goes back like the Back button (D5: "Esc fecha a janela" holds on the phone too).
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return
      e.preventDefault()
      backRef.current()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    // Start each app at its top (the home screen may have been scrolled).
    document.documentElement.scrollTop = 0
    titleRef.current?.focus()
  }, [id])

  return (
    <main id="conteudo" className="flex min-h-dvh flex-col bg-surface text-text">
      <div className="sticky top-0 z-10 flex min-h-12 items-center gap-3 border-b-2 border-line bg-accent px-2 text-ink">
        {/* R10: everything on the yellow bar is ink in both themes, focus ring included. */}
        <button
          type="button"
          onClick={onBack}
          className={`inline-flex min-h-11 min-w-11 cursor-pointer items-center gap-1 rounded-[6px] border-2 border-ink bg-white px-2.5 font-ui text-sm font-semibold text-ink hover:bg-ink hover:text-yellow ${inkFocusRing}`}
        >
          <span aria-hidden="true" className="font-os text-2xl leading-none">
            ‹
          </span>
          {ui.back}
        </button>
        <h1
          ref={titleRef}
          tabIndex={-1}
          className={`min-w-0 flex-1 truncate font-os text-[22px] leading-none font-normal ${quietFocus}`}
        >
          {app.windowTitle}
        </h1>
      </div>
      <div className="px-4 pt-5 pb-10">
        <p className="mb-4 font-ui text-xl font-semibold tracking-tight">{app.heading}</p>
        <AppBody blocks={app.blocks} ui={ui} headingLevel={2} />
      </div>
    </main>
  )
}
