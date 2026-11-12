/** Focus ring for interactive controls on paper/surface: --focus (ink light, yellow dark). */
export const focusRing =
  'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus'

/** Scroll regions inside an overflow-hidden box (window body): ring drawn inside. */
export const insetFocusRing =
  'focus-visible:outline-3 focus-visible:outline-offset-[-4px] focus-visible:outline-focus'

/** Controls on an accent (yellow) surface: always ink, the yellow ring would vanish in dark. */
export const inkFocusRing =
  'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink'

/**
 * Headings that only receive focus programmatically (tabIndex=-1) are not controls:
 * no box when they are focused on open, just a subtle underline for keyboard users.
 */
export const quietFocus =
  'outline-none focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-4'

/**
 * Menu/status-bar controls: yellow ring on the bar (ink in light, surface in dark);
 * hover paints them menubar-fg (paper), where yellow is ~1.2:1, so the ring turns ink.
 */
export const barRing =
  'focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-yellow hover:focus-visible:outline-ink'

/** Bar control drawn in its pressed/open state (paper background): ink ring. */
export const openBarRing =
  'focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-ink'

/** Yellow skip links: ring inside the border, ink on yellow in both themes. */
export const skipLinkRing =
  'focus-visible:outline-3 focus-visible:outline-offset-[-5px] focus-visible:outline-ink'

/** Yellow skip link, hidden above the viewport until it receives keyboard focus. */
export const skipLink = `absolute top-1 left-1 z-30 -translate-y-20 rounded-[6px] border-2 border-line bg-accent px-3 py-1 font-ui font-semibold text-ink focus-visible:translate-y-0 ${skipLinkRing}`
