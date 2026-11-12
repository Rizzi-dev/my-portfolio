import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { describe, expect, it, vi } from 'vitest'
import { pt } from '@/content/pt'
import type { Win } from './windowManager'
import { Window } from './Window'

const ui = pt.ui
const app = pt.apps.sobre
const win: Win = { id: 'sobre', x: 100, y: 80, z: 3, minimized: false }

function setup(props: Partial<React.ComponentProps<typeof Window>> = {}) {
  const handlers = {
    onClose: vi.fn(),
    onMinimize: vi.fn(),
    onFocus: vi.fn(),
    onMove: vi.fn(),
  }
  const utils = render(<Window win={win} app={app} ui={ui} active {...handlers} {...props} />)
  return { ...handlers, ...utils }
}

describe('Window', () => {
  it('is a non-modal dialog named by the window title', () => {
    setup()
    const dialog = screen.getByRole('dialog', { name: app.windowTitle })
    expect(dialog).toHaveAttribute('aria-modal', 'false')
    const title = screen.getByRole('heading', {
      level: 2,
      name: app.windowTitle,
    })
    expect(title).toHaveAttribute('tabindex', '-1')
    expect(screen.getByText(app.heading)).toBeInTheDocument()
  })

  it('positions itself from win.x, win.y and win.z', () => {
    setup()
    const dialog = screen.getByRole('dialog')
    expect(dialog.style.left).toBe('100px')
    expect(dialog.style.top).toBe('80px')
    expect(dialog.style.zIndex).toBe('3')
  })

  it('is min(600px, room above the dock) tall', () => {
    setup()
    const { style } = screen.getByRole('dialog')
    expect(style.height).toBe('var(--win-h)')
    const h = style.getPropertyValue('--win-h')
    expect(h).toContain('600px')
    expect(h).toContain('100dvh - 160px') // y 80 + dock reserve 72 + gap 8
  })

  it('carries the window animation hook and its app id', () => {
    setup()
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveClass('rz-window')
    expect(dialog).toHaveAttribute('data-window', 'sobre')
  })

  it('is hidden when minimized', () => {
    setup({ win: { ...win, minimized: true } })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('calls onClose when Esc is pressed with focus inside', async () => {
    const user = userEvent.setup()
    const { onClose } = setup()
    screen.getByRole('button', { name: ui.minimize }).focus()
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('stops Esc from propagating to outer handlers', async () => {
    const user = userEvent.setup()
    const outer = vi.fn()
    document.addEventListener('keydown', outer)
    setup()
    screen.getByRole('button', { name: ui.close }).focus()
    await user.keyboard('{Escape}')
    expect(outer).not.toHaveBeenCalled()
    document.removeEventListener('keydown', outer)
  })

  it('buttons call onClose and onMinimize', async () => {
    const user = userEvent.setup()
    const { onClose, onMinimize } = setup()
    await user.click(screen.getByRole('button', { name: ui.minimize }))
    expect(onMinimize).toHaveBeenCalledTimes(1)
    await user.click(screen.getByRole('button', { name: ui.close }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('dragging the title bar calls onMove with the pointer delta', () => {
    const { onMove } = setup()
    const bar = screen.getByTestId('window-titlebar')
    fireEvent.pointerDown(bar, {
      clientX: 10,
      clientY: 10,
      pointerId: 1,
      button: 0,
    })
    fireEvent.pointerMove(bar, { clientX: 60, clientY: 40, pointerId: 1 })
    expect(onMove).toHaveBeenLastCalledWith(win.x + 50, win.y + 30)
    fireEvent.pointerUp(bar, { clientX: 60, clientY: 40, pointerId: 1 })
    onMove.mockClear()
    fireEvent.pointerMove(bar, { clientX: 90, clientY: 90, pointerId: 1 })
    expect(onMove).not.toHaveBeenCalled()
  })

  it('pointerdown on a title bar button does not start a drag', () => {
    const { onMove } = setup()
    const bar = screen.getByTestId('window-titlebar')
    const btn = screen.getByRole('button', { name: ui.close })
    fireEvent.pointerDown(btn, {
      clientX: 10,
      clientY: 10,
      pointerId: 1,
      button: 0,
    })
    fireEvent.pointerMove(bar, { clientX: 60, clientY: 40, pointerId: 1 })
    expect(onMove).not.toHaveBeenCalled()
  })

  it('pointerdown anywhere in the window calls onFocus', () => {
    const { onFocus } = setup({ active: false })
    fireEvent.pointerDown(screen.getByText(app.heading), { pointerId: 1 })
    expect(onFocus).toHaveBeenCalledTimes(1)
    expect(onFocus).toHaveBeenCalledWith('pointer')
  })

  it('focus arriving without a press reports keyboard', () => {
    const { onFocus } = setup({ active: false })
    fireEvent.focus(screen.getByRole('button', { name: ui.close }))
    expect(onFocus).toHaveBeenCalledWith('keyboard')
  })

  it('uses an ink focus ring on the yellow active title bar, the theme ring otherwise', () => {
    const { rerender, onClose, onMinimize, onFocus, onMove } = setup()
    const bar = screen.getByTestId('window-titlebar')
    for (const b of within(bar).getAllByRole('button')) {
      expect(b.className).toContain('focus-visible:outline-ink')
      expect(b.className).not.toContain('outline-focus')
    }
    const props = { win, app, ui, onClose, onMinimize, onFocus, onMove }
    rerender(<Window {...props} active={false} />)
    for (const b of within(bar).getAllByRole('button')) {
      expect(b.className).toContain('focus-visible:outline-focus')
    }
  })

  it('the programmatically focused title shows no outline box', () => {
    setup()
    const h = screen.getByRole('heading', { level: 2 })
    expect(h.className).toContain('outline-none')
    expect(h.className).not.toMatch(/outline-(3|focus|ink)/)
  })

  it('reflects active state in data-active', () => {
    const { rerender, onClose, onMinimize, onFocus, onMove } = setup()
    expect(screen.getByRole('dialog')).toHaveAttribute('data-active', 'true')
    rerender(
      <Window
        win={win}
        app={app}
        ui={ui}
        active={false}
        onClose={onClose}
        onMinimize={onMinimize}
        onFocus={onFocus}
        onMove={onMove}
      />,
    )
    expect(screen.getByRole('dialog')).toHaveAttribute('data-active', 'false')
  })

  it('draws the decorative dots in ink when active and in text colour when inactive', () => {
    const { rerender, onClose, onMinimize, onFocus, onMove } = setup()
    const dots = () => screen.getByTestId('window-dots')
    expect(dots()).toHaveClass('text-ink')
    for (const dot of dots().children) expect(dot).toHaveClass('border-current')
    rerender(
      <Window
        win={win}
        app={app}
        ui={ui}
        active={false}
        onClose={onClose}
        onMinimize={onMinimize}
        onFocus={onFocus}
        onMove={onMove}
      />,
    )
    expect(dots()).toHaveClass('text-text')
    expect(dots()).not.toHaveClass('text-ink')
  })

  it('forwards titleRef to the title heading', () => {
    const ref = { current: null as HTMLHeadingElement | null }
    setup({ titleRef: ref })
    expect(ref.current).toBe(screen.getByRole('heading', { level: 2 }))
  })

  it('has no axe violations', async () => {
    const { container } = setup()
    expect(await axe(container)).toHaveNoViolations()
  })
})
