import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '@/App'
import { APP_ORDER } from '@/content'
import { pt } from '@/content/pt'
import { setMatchMedia } from '@/test/setup'

beforeEach(() => {
  window.history.replaceState(null, '', '/#/lista')
})

describe('ListView', () => {
  it('renders from #/lista with the name as h1', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: 'Gabriel Rizzi' })).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders one labelled section per app, in order', () => {
    render(<App />)
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main > section'))
    expect(sections).toHaveLength(APP_ORDER.length)
    APP_ORDER.forEach((id, i) => {
      expect(sections[i]).toHaveAttribute('aria-labelledby')
      expect(
        within(sections[i]).getByRole('heading', { level: 2, name: pt.apps[id].heading }),
      ).toBeInTheDocument()
    })
  })

  it('has a contents nav with a link per section that focuses the heading', async () => {
    render(<App />)
    const nav = screen.getByRole('navigation', { name: pt.ui.contentsLabel })
    expect(within(nav).getAllByRole('link')).toHaveLength(APP_ORDER.length)
    await userEvent.click(within(nav).getByRole('link', { name: pt.apps.stack.heading }))
    expect(screen.getByRole('heading', { level: 2, name: pt.apps.stack.heading })).toHaveFocus()
    expect(window.location.hash).toBe('#/lista')
  })

  it('in-app links (#/app/<id>) stay in the list and focus that section', async () => {
    render(<App />)
    const sobre = document.getElementById('lista-sobre')!
    await userEvent.click(within(sobre).getByRole('link', { name: 'Contato' }))
    expect(window.location.hash).toBe('#/lista')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: pt.apps.contato.heading })).toHaveFocus()
  })

  it('section headings focused by the contents nav show no outline box', () => {
    render(<App />)
    for (const h of screen.getAllByRole('heading', { level: 2 })) {
      expect(h.className).toContain('outline-none')
      expect(h.className).not.toMatch(/outline-(3|focus|ink)/)
    }
  })

  it('the pressed locale button looks selected; the skip link has an ink ring on yellow', () => {
    render(<App />)
    const group = screen.getByRole('group', { name: pt.ui.localeLabel })
    const ptBtn = within(group).getByRole('button', { name: 'PT – Português' })
    const enBtn = within(group).getByRole('button', { name: 'EN – English' })
    expect(ptBtn).toHaveAttribute('aria-pressed', 'true')
    expect(ptBtn).toHaveClass('bg-accent')
    expect(ptBtn).not.toHaveClass('bg-surface') // would win over bg-accent in CSS order
    expect(enBtn).not.toHaveClass('bg-accent')
    expect(enBtn).toHaveClass('bg-surface')
    const skip = screen.getByRole('link', { name: pt.ui.skipToContent })
    expect(skip.className).toContain('focus-visible:outline-ink')
  })

  it('returns to the desktop', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: pt.ui.backToDesktop }))
    expect(screen.getByRole('dialog', { name: 'sobre.txt' })).toBeInTheDocument()
    expect(window.location.hash).toBe('')
  })

  it('switches locale and theme', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: 'EN – English' }))
    expect(screen.getByRole('button', { name: 'Back to the desktop' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Dark theme' }))
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('skip link focuses the first heading in main', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('link', { name: pt.ui.skipToContent }))
    expect(screen.getAllByRole('heading', { level: 2 })[0]).toHaveFocus()
  })

  it('still renders the list (not the phone home) on a mobile viewport', () => {
    setMatchMedia((q) => q === '(max-width: 767px)')
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: 'Gabriel Rizzi' })).toBeInTheDocument()
    expect(document.querySelectorAll('main > section')).toHaveLength(APP_ORDER.length)
  })

  it('has no axe violations', async () => {
    const { container } = render(<App />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
