import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '@/App'
import { APP_ORDER } from '@/content'
import { pt } from '@/content/pt'
import { setMatchMedia } from '@/test/setup'

const { ui } = pt
const grid = () => within(screen.getByRole('navigation', { name: ui.appsLabel }))

function setHash(hash: string) {
  act(() => {
    window.history.replaceState(null, '', `/${hash}`)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  })
}

beforeEach(() => {
  window.history.replaceState(null, '', '/')
  setMatchMedia((q) => q === '(max-width: 767px)')
})

describe('Mobile home', () => {
  it('shows the identity block without any interaction', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: 'Gabriel Rizzi' })).toBeInTheDocument()
    expect(screen.getByText('Desenvolvedor Fullstack & Mobile')).toBeVisible()
    expect(screen.getByText('Co-Founder & CEO @ Fervo')).toBeVisible()
  })

  it('does not auto-open sobre or render the desktop', () => {
    render(<App />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: ui.dockLabel })).not.toBeInTheDocument()
    expect(window.location.hash).toBe('')
  })

  it('lists one button per app, in order, after the identity block', () => {
    render(<App />)
    const buttons = grid().getAllByRole('button')
    expect(buttons.map((b) => b.textContent)).toEqual(APP_ORDER.map((id) => pt.apps[id].iconLabel))
    const name = screen.getByRole('heading', { level: 1, name: 'Gabriel Rizzi' })
    expect(name.compareDocumentPosition(buttons[0]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('grid labels never break mid-word (whole words, sized to fit 360px)', () => {
    render(<App />)
    const label = grid().getByText(pt.apps.acessibilidade.iconLabel)
    expect(label).toHaveClass('whitespace-nowrap')
    expect(label.className).not.toMatch(/overflow-wrap|break-all|hyphens/)
  })

  it('status-bar buttons switch to an ink ring when hover paints them paper', () => {
    render(<App />)
    for (const b of within(screen.getByRole('banner')).getAllByRole('button')) {
      expect(b.className).toContain('focus-visible:outline-yellow')
      expect(b.className).toContain('hover:focus-visible:outline-ink')
    }
  })

  it('has a status bar with clock, locale and theme toggles', async () => {
    render(<App />)
    const banner = screen.getByRole('banner')
    expect(within(banner).getByText('RizziOS')).toBeInTheDocument()
    expect(banner.querySelector('time')).toHaveTextContent(/^\d\d:\d\d$/)
    await userEvent.click(within(banner).getByRole('button', { name: 'EN – English' }))
    expect(screen.getByRole('navigation', { name: 'Apps' })).toBeInTheDocument()
    await userEvent.click(within(banner).getByRole('button', { name: 'Dark theme' }))
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('links to the list version', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('link', { name: ui.listVersion }))
    expect(window.location.hash).toBe('#/lista')
    expect(document.querySelectorAll('main > section')).toHaveLength(APP_ORDER.length)
  })
})

describe('Mobile full-screen app', () => {
  it('opens an app full screen with its title focused and pushes the hash', async () => {
    render(<App />)
    await userEvent.click(grid().getByRole('button', { name: 'fittrack' }))
    const title = screen.getByRole('heading', { level: 1, name: 'fittrack.app' })
    expect(title).toHaveFocus()
    expect(window.location.hash).toBe('#/app/fittrack')
    expect(screen.getByRole('main')).toContainElement(title)
    expect(screen.getByText(pt.apps.fittrack.heading)).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: ui.appsLabel })).not.toBeInTheDocument()
  })

  it('the focused app title shows no outline box; Back on the yellow bar has an ink ring', async () => {
    render(<App />)
    await userEvent.click(grid().getByRole('button', { name: 'fittrack' }))
    const title = screen.getByRole('heading', { level: 1, name: 'fittrack.app' })
    expect(title.className).toContain('outline-none')
    expect(title.className).not.toMatch(/outline-(3|focus|ink)/)
    expect(screen.getByRole('button', { name: ui.back }).className).toContain(
      'focus-visible:outline-ink',
    )
  })

  it('Esc goes back home like the Back button (D5)', async () => {
    render(<App />)
    await userEvent.click(grid().getByRole('button', { name: 'fittrack' }))
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('heading', { level: 1, name: 'fittrack.app' })).not.toBeInTheDocument()
    await waitFor(() => expect(grid().getByRole('button', { name: 'fittrack' })).toHaveFocus())
    expect(window.location.hash).toBe('')
  })

  it('returns home when the hash goes back to empty (browser back)', async () => {
    render(<App />)
    await userEvent.click(grid().getByRole('button', { name: 'fittrack' }))
    setHash('')
    expect(screen.queryByRole('heading', { level: 1, name: 'fittrack.app' })).not.toBeInTheDocument()
    expect(grid().getByRole('button', { name: 'fittrack' })).toBeInTheDocument()
  })

  it('Back button returns home and focuses the app button', async () => {
    render(<App />)
    await userEvent.click(grid().getByRole('button', { name: 'fittrack' }))
    await userEvent.click(screen.getByRole('button', { name: ui.back }))
    await waitFor(() => expect(grid().getByRole('button', { name: 'fittrack' })).toHaveFocus())
    expect(window.location.hash).toBe('')
  })

  it('opens a deep link full screen; Back replaces it with home', async () => {
    window.history.replaceState(null, '', '/#/app/fittrack')
    const before = window.history.length
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: 'fittrack.app' })).toHaveFocus()
    await userEvent.click(screen.getByRole('button', { name: ui.back }))
    expect(window.location.hash).toBe('')
    expect(window.history.length).toBe(before)
    expect(grid().getByRole('button', { name: 'fittrack' })).toHaveFocus()
  })

  it('Back after an external hash change to another app does not history.back() into the first app', async () => {
    render(<App />)
    await userEvent.click(grid().getByRole('button', { name: 'fittrack' }))
    act(() => {
      window.history.pushState(null, '', '/#/app/fervo')
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    })
    expect(screen.getByRole('heading', { level: 1, name: 'fervo.app' })).toHaveFocus()
    await userEvent.click(screen.getByRole('button', { name: ui.back }))
    expect(window.location.hash).toBe('')
    expect(grid().getByRole('button', { name: 'fervo' })).toHaveFocus()
    expect(screen.queryByRole('heading', { level: 1, name: 'fittrack.app' })).not.toBeInTheDocument()
  })

  it('has no axe violations on home', async () => {
    const { container } = render(<App />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no axe violations on an app', async () => {
    window.history.replaceState(null, '', '/#/app/acessibilidade')
    const { container } = render(<App />)
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('Live viewport switch (one route for the whole app)', () => {
  const mobile = (q: string) => q === '(max-width: 767px)'

  it('desktop: open FitTrack, close it, rotate to mobile → home screen, no app open', async () => {
    setMatchMedia(() => false)
    render(<App />)
    const user = userEvent.setup()
    const sobre = screen.getByRole('dialog', { name: 'sobre.txt' }) // auto-opened (R4)
    await user.click(within(sobre).getByRole('button', { name: ui.close }))
    const icons = within(screen.getByRole('navigation', { name: ui.desktopIconsLabel }))
    await user.click(icons.getByRole('button', { name: 'fittrack' }))
    const win = screen.getByRole('dialog', { name: 'fittrack.app' })
    expect(window.location.hash).toBe('#/app/fittrack')
    await user.click(within(win).getByRole('button', { name: ui.close }))
    expect(window.location.hash).toBe('')
    act(() => setMatchMedia(mobile))
    expect(grid().getByRole('button', { name: 'fittrack' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 1, name: 'fittrack.app' })).not.toBeInTheDocument()
  })

  it('mobile with #/app/stack, widen to desktop → stack opens as a window', () => {
    window.history.replaceState(null, '', '/#/app/stack')
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: 'stack.cfg' })).toBeInTheDocument()
    act(() => setMatchMedia(() => false))
    expect(screen.getByRole('dialog', { name: 'stack.cfg' })).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: ui.appsLabel })).not.toBeInTheDocument()
    expect(window.location.hash).toBe('#/app/stack')
  })
})
