import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { setMatchMedia } from '@/test/setup'
import { pt } from '@/content/pt'
import { LocaleProvider } from '@/i18n/locale'
import { ThemeProvider } from '@/theme/theme'
import { Desktop } from './Desktop'
import { useHashRoute } from './useHashRoute'

const ui = pt.ui

/** Owns the route like App's Root does (R17: one useHashRoute instance). */
function DesktopHarness() {
  const [route, navigate] = useHashRoute()
  return <Desktop route={route} navigate={navigate} />
}

function renderDesktop() {
  return render(
    <LocaleProvider>
      <ThemeProvider>
        <DesktopHarness />
      </ThemeProvider>
    </LocaleProvider>,
  )
}

const icons = () => within(screen.getByRole('navigation', { name: ui.desktopIconsLabel }))
const dock = () => within(screen.getByRole('navigation', { name: ui.dockLabel }))
const title = (name: string) => screen.getByRole('heading', { level: 2, name })

beforeEach(() => {
  window.history.replaceState(null, '', '/')
})

type VTDoc = { startViewTransition?: (cb: () => void) => unknown }

/** jsdom has no View Transitions: install a synchronous stand-in. */
function stubViewTransition() {
  const start = vi.fn((cb: () => void) => {
    cb()
    return { finished: Promise.resolve(), ready: Promise.resolve() }
  })
  ;(document as unknown as VTDoc).startViewTransition = start
  return start
}

afterEach(() => {
  delete (document as unknown as VTDoc).startViewTransition
})

describe('Desktop', () => {
  it('animates close through a view transition when motion is allowed', async () => {
    const start = stubViewTransition()
    const user = userEvent.setup()
    renderDesktop()
    const dialog = screen.getByRole('dialog', { name: 'sobre.txt' })
    await user.click(within(dialog).getByRole('button', { name: ui.close }))
    expect(start).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('dialog', { name: 'sobre.txt' })).not.toBeInTheDocument()
  })

  it('closes without any transition under prefers-reduced-motion', async () => {
    setMatchMedia((q) => q === '(prefers-reduced-motion: reduce)')
    const start = stubViewTransition()
    const user = userEvent.setup()
    renderDesktop()
    const dialog = screen.getByRole('dialog', { name: 'sobre.txt' })
    await user.click(within(dialog).getByRole('button', { name: ui.close }))
    expect(start).not.toHaveBeenCalled()
    expect(screen.queryByRole('dialog', { name: 'sobre.txt' })).not.toBeInTheDocument()
  })

  it('auto-opens sobre.txt on entry without changing the hash', () => {
    renderDesktop()
    expect(screen.getByRole('dialog', { name: 'sobre.txt' })).toBeInTheDocument()
    expect(window.location.hash).toBe('')
  })

  it('opens the app named in the initial hash instead of sobre', () => {
    window.history.replaceState(null, '', '/#/app/fervo')
    renderDesktop()
    expect(screen.getByRole('dialog', { name: 'fervo.app' })).toBeInTheDocument()
    expect(screen.queryByRole('dialog', { name: 'sobre.txt' })).not.toBeInTheDocument()
  })

  it('opens an app from a desktop icon with the keyboard and focuses its title', async () => {
    const user = userEvent.setup()
    renderDesktop()
    const fervo = icons().getByRole('button', { name: 'fervo' })
    while (document.activeElement !== fervo) await user.tab()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('dialog', { name: 'fervo.app' })).toBeInTheDocument()
    expect(title('fervo.app')).toHaveFocus()
    expect(window.location.hash).toBe('#/app/fervo')
  })

  it('Esc closes the window and returns focus to the icon that opened it', async () => {
    const user = userEvent.setup()
    renderDesktop()
    const fervo = icons().getByRole('button', { name: 'fervo' })
    await user.click(fervo)
    expect(title('fervo.app')).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog', { name: 'fervo.app' })).not.toBeInTheDocument()
    expect(fervo).toHaveFocus()
    // closing the active window replaces the hash with the next active one
    expect(window.location.hash).toBe('#/app/sobre')
  })

  it('minimize hides the window, keeps the dock button pressed and the dock restores it', async () => {
    const user = userEvent.setup()
    renderDesktop()
    await user.click(icons().getByRole('button', { name: 'fervo' }))
    const dialog = screen.getByRole('dialog', { name: 'fervo.app' })
    await user.click(within(dialog).getByRole('button', { name: ui.minimize }))
    expect(screen.queryByRole('dialog', { name: 'fervo.app' })).not.toBeInTheDocument()
    const dockFervo = dock().getByRole('button', { name: 'fervo' })
    expect(dockFervo).toHaveAttribute('aria-pressed', 'true')
    expect(dockFervo).toHaveFocus()
    expect(dock().getByRole('button', { name: 'fittrack' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    await user.click(dockFervo)
    expect(screen.getByRole('dialog', { name: 'fervo.app' })).toBeInTheDocument()
    expect(title('fervo.app')).toHaveFocus()
  })

  it('Alt+Shift+ArrowRight cycles focus through window titles and wraps', async () => {
    const user = userEvent.setup()
    renderDesktop()
    await user.click(icons().getByRole('button', { name: 'fervo' }))
    await user.click(icons().getByRole('button', { name: 'fittrack' }))
    expect(title('fittrack.app')).toHaveFocus()
    const visited: string[] = []
    for (let i = 0; i < 3; i++) {
      await user.keyboard('{Alt>}{Shift>}{ArrowRight}{/Shift}{/Alt}')
      visited.push(document.activeElement?.textContent ?? '')
    }
    expect(visited).toEqual(['sobre.txt', 'fervo.app', 'fittrack.app'])
    await user.keyboard('{Alt>}{Shift>}{ArrowLeft}{/Shift}{/Alt}')
    expect(title('fervo.app')).toHaveFocus()
  })

  it('Ctrl+Alt+Arrow (VoiceOver) no longer cycles windows', async () => {
    const user = userEvent.setup()
    renderDesktop()
    await user.click(icons().getByRole('button', { name: 'fervo' }))
    await user.keyboard('{Control>}{Alt>}{ArrowRight}{/Alt}{/Control}')
    expect(title('fervo.app')).toHaveFocus()
  })

  it('ignores the cycle shortcut while typing in an editable field', () => {
    renderDesktop()
    act(() => title('sobre.txt').focus())
    for (const make of [
      () => document.createElement('input'),
      () => document.createElement('textarea'),
      () => document.createElement('select'),
      () => {
        const d = document.createElement('div')
        d.setAttribute('contenteditable', 'true') // jsdom has no contentEditable IDL
        return d
      },
    ]) {
      const el = make()
      document.body.append(el)
      const e = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        altKey: true,
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      })
      act(() => {
        el.dispatchEvent(e)
      })
      expect(e.defaultPrevented).toBe(false)
      el.remove()
    }
  })

  it('switching locale keeps windows open in place and updates <html lang>', async () => {
    const user = userEvent.setup()
    renderDesktop()
    await user.click(icons().getByRole('button', { name: 'fervo' }))
    const pos = (name: string) => {
      const d = screen.getByRole('dialog', { name })
      return [d.style.left, d.style.top]
    }
    const sobreBefore = pos('sobre.txt')
    const fervoBefore = pos('fervo.app')
    const group = screen.getByRole('group', { name: ui.localeLabel })
    expect(within(group).getByRole('button', { name: 'PT – Português' })).toHaveAttribute(
      'lang',
      'pt-BR',
    )
    expect(within(group).getByRole('button', { name: 'EN – English' })).toHaveAttribute('lang', 'en')
    expect(within(group).getByRole('button', { name: 'PT – Português' })).toHaveTextContent('PT')
    // WCAG 2.5.3: each accessible name starts with the visible label.
    for (const b of within(group).getAllByRole('button'))
      expect(b.getAttribute('aria-label')!.startsWith(b.textContent!)).toBe(true)
    expect(within(group).getByRole('button', { name: 'PT – Português' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await user.click(within(group).getByRole('button', { name: 'EN – English' }))
    expect(pos('about.txt')).toEqual(sobreBefore)
    expect(pos('fervo.app')).toEqual(fervoBefore)
    expect(document.documentElement.lang).toBe('en')
    expect(within(group).getByRole('button', { name: 'EN – English' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('menu Arquivo → Versão em lista sets the list hash', async () => {
    const user = userEvent.setup()
    renderDesktop()
    const file = screen.getByRole('button', { name: ui.menuFile })
    expect(file).toHaveAttribute('aria-expanded', 'false')
    await user.click(file)
    expect(file).toHaveAttribute('aria-expanded', 'true')
    await user.click(within(file.parentElement!).getByRole('button', { name: ui.listVersion }))
    expect(window.location.hash).toBe('#/lista')
  })

  it('Versão em lista is also a top-level menu-bar button, visible without opening a menu', async () => {
    const user = userEvent.setup()
    renderDesktop()
    const bar = within(screen.getByRole('banner'))
    expect(bar.getByRole('button', { name: ui.menuFile })).toHaveAttribute('aria-expanded', 'false')
    const list = bar.getByRole('button', { name: ui.listVersion })
    expect(list).toBeVisible()
    expect(list).not.toHaveAttribute('aria-expanded')
    await user.click(list)
    expect(window.location.hash).toBe('#/lista')
  })

  it('a second skip link, right after the first, goes to the list version', async () => {
    const user = userEvent.setup()
    renderDesktop()
    await user.tab()
    expect(screen.getByRole('link', { name: ui.skipToContent })).toHaveFocus()
    await user.tab()
    const skipList = screen.getByRole('link', { name: ui.listVersion })
    expect(skipList).toHaveFocus()
    expect(skipList.className).toContain('focus-visible:outline-ink')
    await user.keyboard('{Enter}')
    expect(window.location.hash).toBe('#/lista')
  })

  it('Esc closes an open menu and returns focus to its button; outside click closes it', async () => {
    const user = userEvent.setup()
    renderDesktop()
    const projects = screen.getByRole('button', { name: ui.menuProjects })
    await user.click(projects)
    await user.tab()
    await user.keyboard('{Escape}')
    expect(projects).toHaveAttribute('aria-expanded', 'false')
    expect(projects).toHaveFocus()
    // Esc in the menu must not close the window behind it
    expect(screen.getByRole('dialog', { name: 'sobre.txt' })).toBeInTheDocument()
    await user.click(projects)
    expect(projects).toHaveAttribute('aria-expanded', 'true')
    await user.click(document.body)
    expect(projects).toHaveAttribute('aria-expanded', 'false')
  })

  it('a menu closes when keyboard focus leaves it', async () => {
    const user = userEvent.setup()
    renderDesktop()
    const projects = screen.getByRole('button', { name: ui.menuProjects })
    await user.click(projects)
    await user.tab() // fervo.app
    await user.tab() // fittrack.app
    expect(projects).toHaveAttribute('aria-expanded', 'true')
    await user.tab() // leaves the menu: Contato
    expect(screen.getByRole('button', { name: ui.menuContact })).toHaveFocus()
    expect(projects).toHaveAttribute('aria-expanded', 'false')
  })

  it('keyboard focus into an inactive window replaces the hash; pointer focus pushes', async () => {
    const user = userEvent.setup()
    renderDesktop()
    await user.click(icons().getByRole('button', { name: 'fervo' }))
    expect(window.location.hash).toBe('#/app/fervo')
    const sobre = screen.getByRole('dialog', { name: 'sobre.txt' })
    const before = window.history.length
    act(() => within(sobre).getByRole('button', { name: ui.close }).focus())
    expect(sobre).toHaveAttribute('data-active', 'true')
    expect(window.location.hash).toBe('#/app/sobre')
    expect(window.history.length).toBe(before)
    const fervo = screen.getByRole('dialog', { name: 'fervo.app' })
    await user.click(within(fervo).getByText(pt.apps.fervo.heading, { selector: 'p' }))
    expect(fervo).toHaveAttribute('data-active', 'true')
    expect(window.location.hash).toBe('#/app/fervo')
    expect(window.history.length).toBe(before + 1)
  })

  it('a project menu item opens the app; closing falls back to the dock button', async () => {
    const user = userEvent.setup()
    renderDesktop()
    await user.click(screen.getByRole('button', { name: ui.menuProjects }))
    await user.click(screen.getByRole('button', { name: 'fittrack.app' }))
    expect(title('fittrack.app')).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(dock().getByRole('button', { name: 'fittrack' })).toHaveFocus()
  })

  it('Contato opens the contact window', async () => {
    const user = userEvent.setup()
    renderDesktop()
    await user.click(screen.getByRole('button', { name: ui.menuContact }))
    expect(title('contato.vcf')).toHaveFocus()
    expect(window.location.hash).toBe('#/app/contato')
  })

  it('opens an app when the hash changes to #/app/X', () => {
    renderDesktop()
    act(() => {
      window.history.pushState(null, '', '/#/app/stack')
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    })
    expect(screen.getByRole('dialog', { name: 'stack.cfg' })).toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: 'sobre.txt' })).toBeInTheDocument()
  })

  it('theme toggle is a pressed-state button', async () => {
    const user = userEvent.setup()
    renderDesktop()
    // Named after the state it turns on (D1), pressed while that state is on.
    const toggle = screen.getByRole('button', { name: ui.themeDark })
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('shows a HH:MM clock in a <time> element', () => {
    const { container } = renderDesktop()
    const time = container.querySelector('header time')
    expect(time?.textContent).toMatch(/^\d{2}:\d{2}$/)
  })

  it('skip link is first in tab order and moves focus to the active window title', async () => {
    const user = userEvent.setup()
    renderDesktop()
    await user.tab()
    const skip = screen.getByRole('link', { name: ui.skipToContent })
    expect(skip).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(title('sobre.txt')).toHaveFocus()
    expect(window.location.hash).toBe('')
  })

  it('skip link falls back to the first desktop icon when no window is open', async () => {
    const user = userEvent.setup()
    renderDesktop()
    await user.keyboard('{Escape}') // nothing focused: no-op
    const dialog = screen.getByRole('dialog', { name: 'sobre.txt' })
    await user.click(within(dialog).getByRole('button', { name: ui.close }))
    await user.click(screen.getByRole('link', { name: ui.skipToContent }))
    expect(icons().getAllByRole('button')[0]).toHaveFocus()
  })

  it('Tab order: skip link → menu bar → desktop icons → windows → dock', async () => {
    const user = userEvent.setup()
    renderDesktop()
    const zone = (el: Element | null) => {
      if (!el || el === document.body) return 'body'
      if (el.matches('a[data-skip-link]')) return 'skip'
      if (el.closest('header')) return 'menubar'
      if (el.closest(`nav[aria-label="${ui.desktopIconsLabel}"]`)) return 'icons'
      if (el.closest('[role="dialog"]')) return 'window'
      if (el.closest(`nav[aria-label="${ui.dockLabel}"]`)) return 'dock'
      return 'other'
    }
    const zones: string[] = []
    for (let i = 0; i < 60; i++) {
      await user.tab()
      const z = zone(document.activeElement)
      if (z === 'body' || (zones.length > 1 && z === 'skip')) break
      if (zones[zones.length - 1] !== z) zones.push(z)
    }
    expect(zones).toEqual(['skip', 'menubar', 'icons', 'window', 'dock'])
  })

  it('focus rings stay visible on paper/yellow: open or hovered bar buttons, menu items, skip link', async () => {
    const user = userEvent.setup()
    renderDesktop()
    const file = screen.getByRole('button', { name: ui.menuFile })
    // closed: yellow ring on the bar, ink ring once hover paints the button paper
    expect(file.className).toContain('focus-visible:outline-yellow')
    expect(file.className).toContain('hover:focus-visible:outline-ink')
    for (const name of ['PT – Português', 'EN – English', ui.menuContact, ui.listVersion, ui.themeDark])
      expect(screen.getByRole('button', { name }).className).toContain(
        'hover:focus-visible:outline-ink',
      )
    await user.click(file)
    // open: the button is paper, so the ring is ink
    expect(file.className).toContain('focus-visible:outline-ink')
    expect(file.className).not.toContain('outline-yellow')
    const item = within(file.parentElement!).getByRole('button', { name: ui.listVersion })
    expect(item.className).toContain('hover:focus-visible:outline-ink')
    const skip = screen.getByRole('link', { name: ui.skipToContent })
    expect(skip.className).toContain('focus-visible:outline-ink')
    expect(skip.className).not.toContain('outline-focus')
  })

  it('a held Esc (second close while the first is animating) still returns focus to the opener', async () => {
    const pending: (() => void)[] = []
    const start = vi.fn((cb: () => void) => {
      pending.push(cb)
      return { finished: Promise.resolve(), ready: Promise.resolve() }
    })
    ;(document as unknown as VTDoc).startViewTransition = start
    const user = userEvent.setup()
    renderDesktop()
    const fervo = icons().getByRole('button', { name: 'fervo' })
    await user.click(fervo)
    const dialog = screen.getByRole('dialog', { name: 'fervo.app' })
    const close = within(dialog).getByRole('button', { name: ui.close })
    await user.click(close)
    await user.click(close)
    expect(start).toHaveBeenCalledTimes(1)
    act(() => pending.splice(0).forEach((cb) => cb()))
    expect(screen.queryByRole('dialog', { name: 'fervo.app' })).not.toBeInTheDocument()
    expect(fervo).toHaveFocus()
  })

  it('has no axe violations with two windows open', async () => {
    const user = userEvent.setup()
    renderDesktop()
    await user.click(icons().getByRole('button', { name: 'fervo' }))
    expect(await axe(document.body)).toHaveNoViolations()
  })
})
