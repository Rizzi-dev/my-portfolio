// WCAG 2.x contrast for every text/background token pair RizziOS uses, in both themes.
// Reads the values from src/styles/tokens.css. Exit code 1 if any pair fails.
// Usage: node scripts/contrast-check.mjs
import { readFileSync } from 'node:fs'

const css = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8')

function block(selector) {
  const start = css.indexOf(selector)
  const body = css.slice(css.indexOf('{', start) + 1, css.indexOf('}', start))
  return Object.fromEntries(
    [...body.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})\s*;/gi)].map((m) => [m[1], m[2]]),
  )
}

const light = block(':root {')
const dark = { ...light, ...block(":root[data-theme='dark']") }
// menubar-bg / menubar-fg are var() aliases: resolve them by hand.
light['menubar-bg'] = light.ink
light['menubar-fg'] = light.paper
dark['menubar-bg'] = dark.surface
dark['menubar-fg'] = dark.text

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
const lum = (hex) => {
  const [r, g, b] = rgb(hex).map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
/** fg drawn at `alpha` over bg (e.g. opacity-80 text). */
const mix = (fg, bg, alpha) =>
  '#' +
  rgb(fg)
    .map((c, i) => Math.round(c * alpha + rgb(bg)[i] * (1 - alpha)))
    .map((c) => c.toString(16).padStart(2, '0'))
    .join('')

const TEXT = 4.5
const NON_TEXT = 3

function pairs(t) {
  return [
    // text
    ['text on desktop (paper)', t.text, t.paper, TEXT],
    ['text on window (surface)', t.text, t.surface, TEXT],
    ['menu bar text', t['menubar-fg'], t['menubar-bg'], TEXT],
    ['menu bar inactive locale (80%)', mix(t['menubar-fg'], t['menubar-bg'], 0.8), t['menubar-bg'], TEXT],
    ['ink on yellow (title bar, RizziOS badge, hover)', t.ink, t.yellow, TEXT],
    ['ink on sky', t.ink, t.sky, TEXT],
    ['ink on mint', t.ink, t.mint, TEXT],
    ['ink on pink', t.ink, t.pink, TEXT],
    ['ink on white (mobile Back button)', t.ink, t.white, TEXT],
    ['list window name (70%) on paper', mix(t.text, t.paper, 0.7), t.paper, TEXT],
    // non-text: borders
    ['border/line vs paper', t.line, t.paper, NON_TEXT],
    ['border/line vs surface', t.line, t.surface, NON_TEXT],
    // focus rings, each against the colour it is drawn on while focused (hover included).
    // Inset rings (offset < 0) sit on the element's own fill; outset rings on what is behind it.
    ['ring: icons/dock/links/list controls, outset on paper', t.focus, t.paper, NON_TEXT],
    ['ring: window links/dock, outset on surface', t.focus, t.surface, NON_TEXT],
    ['ring: window scroll region, inset on surface', t.focus, t.surface, NON_TEXT],
    ['ring: inactive title-bar buttons, outset on paper bar', t.focus, t.paper, NON_TEXT],
    ['ring: active title-bar buttons, ink outset on yellow bar', t.ink, t.yellow, NON_TEXT],
    ['ring: mobile Back, ink outset on yellow bar', t.ink, t.yellow, NON_TEXT],
    ['ring: menu/status bar button, yellow inset on bar', t.yellow, t['menubar-bg'], NON_TEXT],
    ['ring: hovered bar button, ink inset on menubar-fg', t.ink, t['menubar-fg'], NON_TEXT],
    ['ring: open menu button, ink inset on menubar-fg', t.ink, t['menubar-fg'], NON_TEXT],
    ['ring: menu item, inset on surface', t.focus, t.surface, NON_TEXT],
    ['ring: hovered menu item, ink inset on yellow', t.ink, t.yellow, NON_TEXT],
    ['ring: skip links, ink inset on yellow', t.ink, t.yellow, NON_TEXT],
  ]
}

let failed = 0
for (const [name, theme] of [['light', light], ['dark', dark]]) {
  console.log(`\n${name}`)
  for (const [label, fg, bg, min] of pairs(theme)) {
    const r = ratio(fg, bg)
    const ok = r >= min
    if (!ok) failed++
    console.log(
      `  ${ok ? 'PASS' : 'FAIL'}  ${r.toFixed(2).padStart(5)}:1  (min ${min})  ${label}  ${fg} / ${bg}`,
    )
  }
}
console.log(failed ? `\n${failed} pair(s) FAIL` : '\nall pairs PASS')
process.exit(failed ? 1 : 0)
