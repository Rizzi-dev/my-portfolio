import { useId, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent, Ref } from 'react'
import type { AppContent, UiStrings } from '@/content/types'
import { AppBody } from '@/apps/AppBody'
import { focusRing, inkFocusRing, insetFocusRing, quietFocus } from './focusStyles'
import { DOCK_RESERVE, MIN_WINDOW_H, WINDOW_GAP, WINDOW_SIZE, type Win } from './windowManager'

type WindowProps = {
  win: Win
  app: AppContent
  ui: UiStrings
  active: boolean
  onClose(): void
  onMinimize(): void
  /** 'pointer' for a press on the window, 'keyboard' for focus arriving otherwise. */
  onFocus(via: 'pointer' | 'keyboard'): void
  onMove(x: number, y: number): void
  titleRef?: Ref<HTMLHeadingElement>
}

type Drag = {
  pointerId: number
  startX: number
  startY: number
  originX: number
  originY: number
}


/** Gap kept between the window and the viewport sides. */
const EDGE_GAP = 16

export function Window({
  win,
  app,
  ui,
  active,
  onClose,
  onMinimize,
  onFocus,
  onMove,
  titleRef,
}: WindowProps) {
  const titleId = useId()
  const leadId = useId()
  const drag = useRef<Drag | null>(null)
  const [dragging, setDragging] = useState(false)
  // R10: anything on the yellow active bar is ink in both themes, focus ring included.
  const barRing = active ? inkFocusRing : focusRing

  function handleKeyDown(e: KeyboardEvent<HTMLElement>) {
    if (e.key !== 'Escape') return
    e.stopPropagation()
    onClose()
  }

  function handleBarPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return
    if ((e.target as Element).closest('button')) return
    e.preventDefault() // no text selection while dragging
    e.currentTarget.setPointerCapture?.(e.pointerId)
    drag.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: win.x,
      originY: win.y,
    }
    setDragging(true)
  }

  function handleBarPointerMove(e: PointerEvent<HTMLDivElement>) {
    const d = drag.current
    if (!d || d.pointerId !== e.pointerId) return
    onMove(d.originX + (e.clientX - d.startX), d.originY + (e.clientY - d.startY))
  }

  function endDrag(e: PointerEvent<HTMLDivElement>) {
    const d = drag.current
    if (!d || d.pointerId !== e.pointerId) return
    drag.current = null
    setDragging(false)
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture?.(e.pointerId)
    }
  }

  return (
    <section
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      data-window={win.id}
      data-active={active ? 'true' : 'false'}
      hidden={win.minimized}
      onPointerDown={() => onFocus('pointer')}
      onFocus={active ? undefined : () => onFocus('keyboard')}
      onKeyDown={handleKeyDown}
      style={{
        left: win.x,
        top: win.y,
        zIndex: win.z,
        width: WINDOW_SIZE.width,
        maxWidth: `calc(100vw - ${2 * EDGE_GAP}px)`,
        // CSS twin of windowHeight(): follows the live viewport without re-rendering.
        ['--win-h' as string]:
          `min(${WINDOW_SIZE.height}px, max(${MIN_WINDOW_H}px, ` +
          `calc(100dvh - ${win.y + DOCK_RESERVE + WINDOW_GAP}px)))`,
        height: 'var(--win-h)',
      }}
      className="rz-window absolute flex flex-col overflow-hidden rounded-[10px] border-2 border-line bg-surface text-text shadow-[6px_6px_0_var(--shadow-color)]"
    >
      <div
        data-testid="window-titlebar"
        onPointerDown={handleBarPointerDown}
        onPointerMove={handleBarPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={`flex h-8 shrink-0 touch-none items-center gap-2 border-b-2 border-line px-2.5 select-none ${
          active ? 'bg-accent text-ink' : 'bg-paper text-text'
        } ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        {/* R10: anything on the yellow active bar is ink in both themes. */}
        <span
          aria-hidden="true"
          data-testid="window-dots"
          className={`flex gap-1.5 ${active ? 'text-ink' : 'text-text'}`}
        >
          {[0, 1, 2].map((i) => (
            <i key={i} className="block size-3 rounded-full border-2 border-current bg-white" />
          ))}
        </span>
        <h2
          id={titleId}
          ref={titleRef}
          tabIndex={-1}
          className={`min-w-0 flex-1 truncate font-os text-[19px] leading-none font-normal ${quietFocus}`}
        >
          {app.windowTitle}
        </h2>
        <div className="flex gap-1">
          <button
            type="button"
            aria-label={ui.minimize}
            title={ui.minimize}
            onClick={onMinimize}
            className={`grid size-6 cursor-pointer place-items-center rounded-[6px] border-2 border-current font-os text-lg leading-none hover:bg-surface hover:text-text ${barRing}`}
          >
            <span aria-hidden="true">_</span>
          </button>
          <button
            type="button"
            aria-label={ui.close}
            title={ui.close}
            onClick={onClose}
            className={`grid size-6 cursor-pointer place-items-center rounded-[6px] border-2 border-current font-os text-lg leading-none hover:bg-surface hover:text-text ${barRing}`}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      </div>
      <div
        role="region"
        aria-labelledby={leadId}
        tabIndex={0}
        className={`min-h-0 flex-1 overflow-y-auto px-4 pt-3.5 pb-4 ${insetFocusRing}`}
      >
        <p id={leadId} className="mb-3 font-ui text-xl font-semibold tracking-tight">
          {app.heading}
        </p>
        <AppBody blocks={app.blocks} ui={ui} headingLevel={3} />
      </div>
    </section>
  )
}
