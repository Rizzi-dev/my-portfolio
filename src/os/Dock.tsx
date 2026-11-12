import { APP_ORDER, type AppContent, type AppId, type UiStrings } from '@/content'
import { AppIcon } from '@/apps/AppIcon'
import type { Win } from './windowManager'
import { focusRing } from './focusStyles'

type DockProps = {
  ui: UiStrings
  apps: Record<AppId, AppContent>
  windows: Win[]
  onOpen(id: AppId, opener: HTMLElement): void
}


/**
 * One button per app. Open apps (minimized or not) are pressed and show a dot.
 * A click opens, restores or focuses the app; it never minimizes (predictable, D5).
 */
export function Dock({ ui, apps, windows, onOpen }: DockProps) {
  return (
    <nav
      aria-label={ui.dockLabel}
      className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-[14px] border-2 border-line bg-surface p-1.5 shadow-[4px_4px_0_var(--shadow-color)]"
    >
      <ul className="flex gap-1">
        {APP_ORDER.map((id) => {
          const open = windows.some((w) => w.id === id)
          return (
            <li key={id}>
              <button
                type="button"
                data-dock-app={id}
                aria-label={apps[id].iconLabel}
                title={apps[id].iconLabel}
                aria-pressed={open}
                onClick={(e) => onOpen(id, e.currentTarget)}
                className={`flex cursor-pointer flex-col items-center gap-0.5 rounded-[8px] px-0.5 pt-0.5 transition-transform hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${focusRing}`}
              >
                <AppIcon id={id} size={40} />
                <span
                  aria-hidden="true"
                  data-testid={`dock-dot-${id}`}
                  className={`block size-1.5 rounded-full ${open ? 'bg-text' : 'bg-transparent'}`}
                />
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
