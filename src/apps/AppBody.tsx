import { useId } from 'react'
import type { MouseEvent } from 'react'
import type { AppId, Block, Link, UiStrings } from '@/content/types'
import { focusRing } from '@/os/focusStyles'
import { parseHash } from '@/os/route'

type AppBodyProps = {
  blocks: Block[]
  ui: UiStrings
  headingLevel: 2 | 3
  /**
   * When given, in-app links ('#/app/<id>') call this instead of navigating
   * (the list view keeps them on the page). Otherwise they are plain hash links.
   */
  onInternalLink?: (id: AppId) => void
}

/** The app id an in-app link points at, or null. */
function internalAppId(href: string): AppId | null {
  const route = parseHash(href)
  return route.view === 'os' ? route.app : null
}

export function AppBody({ blocks, ui, headingLevel, onInternalLink }: AppBodyProps) {
  return (
    <div className="max-w-[65ch] space-y-4 font-body text-base leading-relaxed text-text">
      {blocks.map((block, i) => (
        <BlockView
          key={i}
          block={block}
          ui={ui}
          headingLevel={headingLevel}
          onInternalLink={onInternalLink}
        />
      ))}
    </div>
  )
}

function BlockView({
  block,
  ui,
  headingLevel,
  onInternalLink,
}: { block: Block } & Omit<AppBodyProps, 'blocks'>) {
  switch (block.type) {
    case 'heading': {
      const H = headingLevel === 2 ? 'h2' : 'h3'
      return (
        <H className="mt-7 font-ui text-lg font-semibold tracking-tight first:mt-0">
          {block.text}
        </H>
      )
    }
    case 'p':
      return <p>{block.text}</p>
    case 'list':
      return (
        <ul role="list" className="space-y-1.5">
          {block.items.map((item) => (
            <li key={item} className="relative pl-5">
              <span
                aria-hidden="true"
                className="absolute top-[0.6em] left-0.5 size-2 border-2 border-line bg-accent"
              />
              {item}
            </li>
          ))}
        </ul>
      )
    case 'chips':
      return (
        <ul role="list" className="flex flex-wrap gap-1.5">
          {block.items.map((item) => (
            <li
              key={item}
              className="rounded-[6px] border-2 border-line bg-surface px-2 py-0.5 font-ui text-xs leading-5 font-semibold text-text"
            >
              {item}
            </li>
          ))}
        </ul>
      )
    case 'badge':
      return (
        <p>
          <span className="inline-block rounded-[6px] border-2 border-line bg-accent px-2 py-0.5 font-ui text-xs leading-5 font-semibold tracking-wide text-ink uppercase shadow-[2px_2px_0_var(--shadow-color)]">
            {block.text}
          </span>
        </p>
      )
    case 'links':
      return (
        <ul role="list" className="flex flex-wrap gap-3 pt-1">
          {block.links.map((link) => (
            <li key={link.href}>
              <LinkView link={link} ui={ui} onInternalLink={onInternalLink} />
            </li>
          ))}
        </ul>
      )
    case 'timeline':
      return (
        <ol className="ml-1.5 space-y-6 border-l-2 border-line pl-6">
          {block.entries.map((entry) => (
            <li key={`${entry.period}-${entry.org}`} className="relative">
              <span
                aria-hidden="true"
                className="absolute top-1 -left-[calc(1.5rem+8px)] size-3.5 rounded-[3px] border-2 border-line bg-mint"
              />
              <p>
                <span className="inline-block rounded-[6px] border-2 border-line bg-sky px-2 font-ui text-xs leading-5 font-semibold text-ink">
                  {entry.period}
                </span>
              </p>
              <p className="mt-1.5 font-ui font-semibold">
                {entry.role} <span className="font-normal">· {entry.org}</span>
              </p>
              <p className="mt-1">{entry.text}</p>
            </li>
          ))}
        </ol>
      )
    case 'table':
      return <TableView block={block} />
  }
}

function TableView({ block }: { block: Extract<Block, { type: 'table' }> }) {
  const captionId = useId()
  return (
    <div
      role="region"
      aria-labelledby={captionId}
      tabIndex={0}
      className={`overflow-x-auto rounded-[6px] ${focusRing}`}
    >
      <table className="w-full border-collapse text-sm">
        <caption id={captionId} className="mb-2 text-left font-ui font-semibold">
          {block.caption}
        </caption>
        <thead>
          <tr>
            {block.head.map((h) => (
              <th
                key={h}
                scope="col"
                className="border-2 border-line bg-accent px-3 py-2 text-left font-ui font-semibold text-ink"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => (
                <td key={c} className="border-2 border-line px-3 py-2 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function LinkView({
  link,
  ui,
  onInternalLink,
}: {
  link: Link
  ui: UiStrings
  onInternalLink?: (id: AppId) => void
}) {
  const className = `inline-flex min-h-8 items-center gap-1.5 rounded-[6px] border-2 border-line bg-surface px-3 py-1 font-ui text-sm font-semibold text-text underline decoration-2 underline-offset-2 shadow-[3px_3px_0_var(--shadow-color)] hover:bg-accent hover:text-ink active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${focusRing}`
  if (!link.external) {
    const appId = onInternalLink ? internalAppId(link.href) : null
    const onClick =
      appId && onInternalLink
        ? (e: MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault()
            onInternalLink(appId)
          }
        : undefined
    return (
      <a href={link.href} onClick={onClick} className={className}>
        {link.label}
      </a>
    )
  }
  return (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
      {link.label}
      <span aria-hidden="true">↗</span>
      <span className="sr-only"> {ui.opensNewSite}</span>
    </a>
  )
}
