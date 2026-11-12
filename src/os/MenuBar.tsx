import { useCallback, useEffect, useId, useRef, useState } from 'react'
import type { FocusEvent, KeyboardEvent, MouseEvent } from 'react'
import { APP_ORDER, type AppContent, type AppId, type Locale, type UiStrings } from '@/content'
import type { Theme } from '@/theme/detectTheme'
import { Clock } from './Clock'
import { LocaleToggle } from './LocaleToggle'
import { ThemeToggle } from './ThemeToggle'
import { barRing, openBarRing, skipLink } from './focusStyles'

type MenuBarProps = {
  ui: UiStrings
  apps: Record<AppId, AppContent>
  locale: Locale
  onLocale(l: Locale): void
  theme: Theme
  onToggleTheme(): void
  onOpen(id: AppId, opener: HTMLElement): void
  onList(): void
}

type MenuItem = { key: string; label: string; onSelect(el: HTMLElement): void }

// Menu items sit on the surface (theme ring); hover paints them yellow, so the ring turns ink.
const itemRing =
  'focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-focus hover:focus-visible:outline-ink'
const barBase = 'h-7 cursor-pointer px-2 leading-none hover:bg-menubar-fg hover:text-menubar'
const barButton = `${barBase} ${barRing}`

export function MenuBar({
  ui,
  apps,
  locale,
  onLocale,
  theme,
  onToggleTheme,
  onOpen,
  onList,
}: MenuBarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const dismiss = useCallback(() => setOpenMenu(null), [])

  const appItem = (id: AppId): MenuItem => ({
    key: id,
    label: apps[id].windowTitle,
    onSelect: (el) => onOpen(id, el),
  })
  const fileItems: MenuItem[] = [
    ...APP_ORDER.map(appItem),
    { key: 'list', label: ui.listVersion, onSelect: () => onList() },
  ]
  const projectItems: MenuItem[] = [appItem('fervo'), appItem('fittrack')]

  function skipToList(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault()
    onList()
  }

  const menuProps = (name: string) => ({
    open: openMenu === name,
    onToggle: () => setOpenMenu((m) => (m === name ? null : name)),
    onDismiss: dismiss,
  })

  return (
    <header className="absolute inset-x-0 top-0 z-20 flex h-7 items-center gap-1 bg-menubar px-2 font-os text-[18px] text-menubar-fg">
      {/* Spec 6.4: second skip link, right after "Pular para o conteúdo" (kept in the banner landmark). */}
      <a href="#/lista" data-skip-link onClick={skipToList} className={skipLink}>
        {ui.listVersion}
      </a>
      <h1 className="mr-2 bg-yellow px-1.5 leading-7 font-normal text-ink">RizziOS</h1>
      <Menu label={ui.menuFile} items={fileItems} {...menuProps('file')} />
      <Menu label={ui.menuProjects} items={projectItems} {...menuProps('projects')} />
      <button
        type="button"
        className={barButton}
        onClick={(e) => onOpen('contato', e.currentTarget)}
      >
        {ui.menuContact}
      </button>
      {/* D2: the list version is as prominent as the other top-level options. */}
      <button type="button" className={barButton} onClick={() => onList()}>
        {ui.listVersion}
      </button>

      <div className="ml-auto flex items-center gap-2">
        <LocaleToggle
          label={ui.localeLabel}
          locale={locale}
          onLocale={onLocale}
          separator
          buttonClassName={`${barButton} min-w-7`}
          activeClassName="underline underline-offset-4"
          inactiveClassName="opacity-80"
        />
        <ThemeToggle
          ui={ui}
          theme={theme}
          onToggle={onToggleTheme}
          className={`${barButton} min-w-7`}
        />
        <Clock />
      </div>
    </header>
  )
}

function Menu({
  label,
  items,
  open,
  onToggle,
  onDismiss,
}: {
  label: string
  items: MenuItem[]
  open: boolean
  onToggle(): void
  onDismiss(): void
}) {
  const listId = useId()
  const wrapRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) onDismiss()
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open, onDismiss])

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'Escape' || !open) return
    e.stopPropagation()
    onDismiss()
    buttonRef.current?.focus()
  }

  // Close when focus moves to another element outside the menu. A null
  // relatedTarget (click on nothing focusable) is left to the pointerdown handler,
  // so a click on an item still lands in browsers that do not focus buttons.
  function handleBlur(e: FocusEvent<HTMLDivElement>) {
    const next = e.relatedTarget
    if (open && next instanceof Node && !e.currentTarget.contains(next)) onDismiss()
  }

  function select(item: MenuItem, e: MouseEvent<HTMLButtonElement>) {
    item.onSelect(e.currentTarget)
    onDismiss()
  }

  return (
    <div ref={wrapRef} className="relative" onKeyDown={handleKeyDown} onBlur={handleBlur}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={onToggle}
        className={open ? `${barBase} bg-menubar-fg text-menubar ${openBarRing}` : barButton}
      >
        {label}
      </button>
      <ul
        id={listId}
        hidden={!open}
        className="absolute top-full left-0 min-w-48 rounded-b-[8px] border-2 border-line bg-surface py-1 text-text shadow-[4px_4px_0_var(--shadow-color)]"
      >
        {items.map((item) => (
          <li key={item.key}>
            <button
              type="button"
              onClick={(e) => select(item, e)}
              className={`block min-h-7 w-full cursor-pointer px-3 text-left whitespace-nowrap hover:bg-accent hover:text-ink ${itemRing}`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
