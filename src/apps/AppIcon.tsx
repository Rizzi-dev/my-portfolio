import type { ReactNode } from 'react'
import type { AppId } from '@/content/types'

/*
 * Hand-drawn glyphs for each RizziOS app, on a 32×32 grid inside a 34×34
 * viewBox (the extra 2 units hold the hard shadow). Every icon is a flat
 * colour tile whose outer border uses the theme `line` token (ink in light,
 * paper in dark) with a hard offset shadow in `--shadow-color`, so the tile
 * stays outlined on dark surfaces. Glyph strokes sit on the coloured fills and
 * stay ink in both themes. Strokes are non-scaling, so they stay 2 px at any
 * size. Colours come from tokens only.
 */

type Tile = 'fill-yellow' | 'fill-sky' | 'fill-mint' | 'fill-pink'

// Stroke colour/width/joins are set once on the <svg> and inherited;
// vector-effect does not inherit, so every shape spreads it.
const stroke = { vectorEffect: 'non-scaling-stroke' } as const

const ICONS: Record<AppId, { tile: Tile; glyph: ReactNode }> = {
  // ID card: portrait + text lines
  sobre: {
    tile: 'fill-yellow',
    glyph: (
      <>
        <rect x="6" y="9" width="20" height="14" rx="2" className="fill-white" {...stroke} />
        <circle cx="12" cy="14" r="2.5" className="fill-pink" {...stroke} />
        <path d="M8.5 21a3.5 3.5 0 0 1 7 0" className="fill-pink" {...stroke} />
        <path d="M18.5 13h4.5M18.5 16h4.5M18.5 19h3" fill="none" {...stroke} />
      </>
    ),
  },
  // Ticket with side notches and a perforation
  fervo: {
    tile: 'fill-pink',
    glyph: (
      <>
        <path
          d="M6 10h20v4a2 2 0 0 0 0 4v4H6v-4a2 2 0 0 0 0-4z"
          className="fill-white"
          {...stroke}
        />
        <path d="M20 12v8" fill="none" {...stroke} strokeDasharray="1.5 2.5" />
        <circle cx="13" cy="16" r="2.5" className="fill-yellow" {...stroke} />
      </>
    ),
  },
  // Dumbbell
  fittrack: {
    tile: 'fill-mint',
    glyph: (
      <>
        <rect x="11" y="15" width="10" height="2" className="fill-ink" {...stroke} />
        <rect x="8" y="10" width="4" height="12" rx="1" className="fill-white" {...stroke} />
        <rect x="20" y="10" width="4" height="12" rx="1" className="fill-white" {...stroke} />
        <rect x="5" y="13" width="3" height="6" rx="1" className="fill-sky" {...stroke} />
        <rect x="24" y="13" width="3" height="6" rx="1" className="fill-sky" {...stroke} />
      </>
    ),
  },
  // Briefcase
  experiencia: {
    tile: 'fill-sky',
    glyph: (
      <>
        <path d="M12.5 11V8.5h7V11" fill="none" {...stroke} />
        <rect x="6" y="11" width="20" height="13" rx="2" className="fill-yellow" {...stroke} />
        <path d="M6 16.5h20" fill="none" {...stroke} />
        <rect x="14" y="15" width="4" height="3.5" rx="0.5" className="fill-white" {...stroke} />
      </>
    ),
  },
  // Stacked layers
  stack: {
    tile: 'fill-yellow',
    glyph: (
      <>
        <path d="M16 15.5l9 4.5-9 4.5-9-4.5z" className="fill-sky" {...stroke} />
        <path d="M16 11.5l9 4.5-9 4.5-9-4.5z" className="fill-white" {...stroke} />
        <path d="M16 7.5l9 4.5-9 4.5-9-4.5z" className="fill-pink" {...stroke} />
      </>
    ),
  },
  // Accessibility figure (arms open) inside a circle
  acessibilidade: {
    tile: 'fill-sky',
    glyph: (
      <>
        <circle cx="16" cy="16" r="10" className="fill-white" {...stroke} />
        <circle cx="16" cy="10.5" r="1.75" className="fill-ink" {...stroke} />
        <path d="M10 14l6 1 6-1M16 15v4.5M16 19.5l-3 4M16 19.5l3 4" fill="none" {...stroke} />
      </>
    ),
  },
  // Graduation cap with tassel
  formacao: {
    tile: 'fill-pink',
    glyph: (
      <>
        <path d="M10 15v5c0 2.5 12 2.5 12 0v-5" className="fill-white" {...stroke} />
        <path d="M16 8l11 5-11 5-11-5z" className="fill-ink" {...stroke} />
        <path d="M26 13.5v5" fill="none" {...stroke} />
        <circle cx="26" cy="20.5" r="1.5" className="fill-yellow" {...stroke} />
      </>
    ),
  },
  // Envelope
  contato: {
    tile: 'fill-mint',
    glyph: (
      <>
        <rect x="6" y="9" width="20" height="14" rx="2" className="fill-white" {...stroke} />
        <path d="M7 10.5l9 6.5 9-6.5" fill="none" {...stroke} />
      </>
    ),
  },
}

type AppIconProps = { id: AppId; size?: number }

export function AppIcon({ id, size = 38 }: AppIconProps) {
  const { tile, glyph } = ICONS[id]
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 34 34"
      aria-hidden="true"
      focusable="false"
      className="block shrink-0 stroke-ink"
      strokeWidth={2}
      strokeLinejoin="round"
      strokeLinecap="round"
      data-app-icon={id}
    >
      <rect
        x="3"
        y="3"
        width="30"
        height="30"
        rx="7.5"
        stroke="none"
        className="fill-shadow"
        data-part="shadow"
      />
      <rect
        x="1"
        y="1"
        width="30"
        height="30"
        rx="7.5"
        className={`${tile} stroke-line`}
        data-part="tile"
        {...stroke}
      />
      {glyph}
    </svg>
  )
}
