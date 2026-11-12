import { render, screen, within } from '@testing-library/react'
import { axe } from 'vitest-axe'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { pt } from '@/content/pt'
import type { AppId, Block } from '@/content/types'
import { AppBody } from './AppBody'
import { AppIcon } from './AppIcon'

const ui = pt.ui

const blocks: Block[] = [
  { type: 'heading', text: 'Stack' },
  { type: 'p', text: 'Um parágrafo de texto.' },
  { type: 'list', items: ['Item um', 'Item dois'] },
  { type: 'chips', items: ['React', 'TypeScript'] },
  { type: 'badge', text: 'em evolução' },
  {
    type: 'links',
    links: [
      { label: 'fervo.online', href: 'https://fervo.online', external: true },
      { label: 'gabriel@example.com', href: 'mailto:gabriel@example.com', external: false },
      { label: 'Contato', href: '#/app/contato', external: false },
    ],
  },
  {
    type: 'timeline',
    entries: [
      { period: '2025–atual', role: 'Dev', org: 'HUMU', text: 'Texto um.' },
      { period: '2022–2025', role: 'Estágio', org: 'TrueWork', text: 'Texto dois.' },
    ],
  },
  {
    type: 'table',
    caption: 'Diretrizes',
    head: ['ID', 'Diretriz'],
    rows: [
      ['D1', 'Clareza'],
      ['D2', 'Alternativas'],
    ],
  },
]

describe('AppBody', () => {
  it('renders heading blocks at the given level', () => {
    const { unmount } = render(<AppBody blocks={blocks} ui={ui} headingLevel={2} />)
    expect(screen.getByRole('heading', { level: 2, name: 'Stack' })).toBeInTheDocument()
    unmount()
    render(<AppBody blocks={blocks} ui={ui} headingLevel={3} />)
    expect(screen.getByRole('heading', { level: 3, name: 'Stack' })).toBeInTheDocument()
  })

  it('renders paragraphs, lists, chips and badge as real text', () => {
    render(<AppBody blocks={blocks} ui={ui} headingLevel={2} />)
    expect(screen.getByText('Um parágrafo de texto.').tagName).toBe('P')
    const lists = screen.getAllByRole('list')
    const itemList = lists.find((l) => within(l).queryByText('Item um'))
    expect(itemList).toBeDefined()
    expect(within(itemList!).getAllByRole('listitem')).toHaveLength(2)
    const chipList = lists.find((l) => within(l).queryByText('React'))
    expect(chipList).toBeDefined()
    expect(within(chipList!).getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByText('em evolução')).toBeInTheDocument()
  })

  it('renders the timeline as an ordered list', () => {
    render(<AppBody blocks={blocks} ui={ui} headingLevel={2} />)
    const ol = screen.getByText('HUMU', { exact: false }).closest('ol')
    expect(ol).not.toBeNull()
    expect(within(ol!).getAllByRole('listitem')).toHaveLength(2)
    expect(within(ol!).getByText('2025–atual')).toBeInTheDocument()
    expect(within(ol!).getByText('Texto dois.')).toBeInTheDocument()
  })

  it('renders a real table with caption and column headers', () => {
    render(<AppBody blocks={blocks} ui={ui} headingLevel={2} />)
    const table = screen.getByRole('table', { name: 'Diretrizes' })
    expect(table.tagName).toBe('TABLE')
    expect(table.querySelector('caption')).toHaveTextContent('Diretrizes')
    const headers = within(table).getAllByRole('columnheader')
    expect(headers).toHaveLength(2)
    headers.forEach((th) => {
      expect(th.tagName).toBe('TH')
      expect(th).toHaveAttribute('scope', 'col')
    })
    expect(within(table).getAllByRole('row')).toHaveLength(3)
  })

  it('marks external links and announces they open another site', () => {
    render(<AppBody blocks={blocks} ui={ui} headingLevel={2} />)
    const link = screen.getByRole('link', { name: new RegExp(`^fervo\\.online.*${escapeRe(ui.opensNewSite)}$`) })
    expect(link).toHaveAttribute('href', 'https://fervo.online')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('does not treat mailto or in-app links as external', () => {
    render(<AppBody blocks={blocks} ui={ui} headingLevel={2} />)
    for (const name of ['gabriel@example.com', 'Contato']) {
      const link = screen.getByRole('link', { name })
      expect(link).not.toHaveAttribute('target')
      expect(link).not.toHaveAttribute('rel')
      expect(link.textContent).not.toContain(ui.opensNewSite)
    }
  })

  it('routes #/app/<id> links through onInternalLink when given', async () => {
    const onInternalLink = vi.fn()
    window.history.replaceState(null, '', '/#/lista')
    render(<AppBody blocks={blocks} ui={ui} headingLevel={2} onInternalLink={onInternalLink} />)
    const link = screen.getByRole('link', { name: 'Contato' })
    expect(link).toHaveAttribute('href', '#/app/contato')
    await userEvent.click(link)
    expect(onInternalLink).toHaveBeenCalledWith('contato')
    expect(window.location.hash).toBe('#/lista')
    await userEvent.click(screen.getByRole('link', { name: 'gabriel@example.com' }))
    expect(onInternalLink).toHaveBeenCalledTimes(1)
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <main>
        <h1>Janela</h1>
        <AppBody blocks={blocks} ui={ui} headingLevel={2} />
      </main>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no axe violations with every real app content', async () => {
    const { container } = render(
      <main>
        {(Object.keys(pt.apps) as AppId[]).map((id) => (
          <section key={id} aria-labelledby={`h-${id}`}>
            <h2 id={`h-${id}`}>{pt.apps[id].heading}</h2>
            <AppBody blocks={pt.apps[id].blocks} ui={ui} headingLevel={3} />
          </section>
        ))}
      </main>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('AppIcon', () => {
  const ids = Object.keys(pt.apps) as AppId[]

  it('renders a decorative, distinct SVG for every app', () => {
    const markup = new Set<string>()
    for (const id of ids) {
      const { container, unmount } = render(<AppIcon id={id} />)
      const svg = container.querySelector('svg')
      expect(svg).not.toBeNull()
      expect(svg).toHaveAttribute('aria-hidden', 'true')
      expect(svg).toHaveAttribute('focusable', 'false')
      const tile = svg!.querySelector('[data-part="tile"]')!
      expect(tile.getAttribute('class')).toMatch(/^fill-(yellow|sky|mint|pink) stroke-line$/)
      markup.add(svg!.innerHTML)
      unmount()
    }
    expect(markup.size).toBe(ids.length)
  })

  it('outlines the tile with the theme line token over a hard shadow', () => {
    const { container } = render(<AppIcon id="sobre" />)
    const svg = container.querySelector('svg')!
    const shadow = svg.querySelector('[data-part="shadow"]')!
    const tile = svg.querySelector('[data-part="tile"]')!
    expect(tile).toHaveClass('stroke-line')
    expect(tile).not.toHaveClass('stroke-ink')
    expect(shadow).toHaveClass('fill-shadow')
    expect(shadow).toHaveAttribute('stroke', 'none')
    // shadow is painted first (behind) and offset down-right of the tile
    expect(shadow.compareDocumentPosition(tile) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(Number(shadow.getAttribute('x'))).toBeGreaterThan(Number(tile.getAttribute('x')))
    expect(Number(shadow.getAttribute('y'))).toBeGreaterThan(Number(tile.getAttribute('y')))
  })

  it('honours the size prop', () => {
    const { container } = render(<AppIcon id="fervo" size={48} />)
    const svg = container.querySelector('svg')!
    expect(svg).toHaveAttribute('width', '48')
    expect(svg).toHaveAttribute('height', '48')
  })
})

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
