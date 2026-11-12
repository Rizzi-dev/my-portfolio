import { APP_ORDER, type AppContent, type AppId, type UiStrings } from '@/content'
import { AppIcon } from '@/apps/AppIcon'
import { focusRing } from './focusStyles'

type DesktopIconsProps = {
  ui: UiStrings
  apps: Record<AppId, AppContent>
  onOpen(id: AppId, opener: HTMLElement): void
}


/** Column of app icons on the desktop. A single click, Enter or Space opens the app. */
export function DesktopIcons({ ui, apps, onOpen }: DesktopIconsProps) {
  return (
    <nav aria-label={ui.desktopIconsLabel} className="absolute top-11 left-4">
      <ul className="flex max-h-[calc(100dvh-140px)] flex-col flex-wrap gap-x-2 gap-y-1">
        {APP_ORDER.map((id) => (
          <li key={id}>
            <button
              type="button"
              data-desktop-icon={id}
              onClick={(e) => onOpen(id, e.currentTarget)}
              className={`group flex w-[88px] cursor-pointer flex-col items-center gap-1 rounded-[8px] px-1 py-1.5 ${focusRing}`}
            >
              <AppIcon id={id} size={44} />
              <span className="rounded-[3px] px-1 font-os text-[18px] leading-none text-text group-hover:bg-accent group-hover:text-ink">
                {apps[id].iconLabel}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
