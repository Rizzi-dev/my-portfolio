import type { UiStrings } from '@/content'
import type { Theme } from '@/theme/detectTheme'

type ThemeToggleProps = {
  ui: UiStrings
  theme: Theme
  onToggle(): void
  className: string
}

/**
 * Light/dark switch: one toggle button named after the state it turns on
 * ("Tema escuro"), pressed while that state is on (D1: the label says what happens).
 */
export function ThemeToggle({ ui, theme, onToggle, className }: ThemeToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={theme === 'dark'}
      aria-label={ui.themeDark}
      title={ui.themeDark}
      onClick={onToggle}
      className={className}
    >
      <span aria-hidden="true">{theme === 'dark' ? '☾' : '☼'}</span>
    </button>
  )
}
