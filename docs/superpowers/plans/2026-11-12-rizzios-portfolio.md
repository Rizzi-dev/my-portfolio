# RizziOS Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the shadcn placeholder portfolio with "RizziOS": a bilingual (PT/EN), WCAG 2.2 AA, desktop-metaphor portfolio with a phone home-screen layout under 768 px and a linear "list version".

**Architecture:** Content lives in typed per-locale files rendered through a small block model. A pure reducer manages windows (open/close/focus/minimize/move) and the URL hash mirrors the open app. Three views share the same content: Desktop (≥ 768 px), Mobile (< 768 px) and List (`#/lista`).

**Tech Stack:** Vite 8, React 19, TypeScript 6, Tailwind 4 (utilities only, tokens via CSS variables), `@fontsource/vt323`, `@fontsource/inter`, `@fontsource/atkinson-hyperlegible`, Vitest + Testing Library + jsdom + `vitest-axe`.

**Spec:** `docs/superpowers/specs/2026-11-12-rizzios-portfolio-design.md` (read it fully before Task 1; visual references in `docs/superpowers/specs/references/`).

## Global Constraints

- Node 20 (`node -v` → v20.x). Use `npm`; the repo `.npmrc` pins the public registry, keep it.
- Branch `master`. Commit messages must NOT contain `Co-Authored-By` lines or "Generated with Claude Code".
- No shadcn, `@base-ui/react`, `class-variance-authority`, icon libraries or Figtree. No UI component libraries at all.
- No Google Fonts at runtime; fonts come from `@fontsource/*`.
- Fonts: VT323 = OS chrome only (menu bar, window titles, icon labels, clock); Inter = headings/UI inside windows; Atkinson Hyperlegible = body text.
- Light palette tokens (exact): ink `#15172a`, paper `#f1ede4`, white `#ffffff`, yellow `#ffd23f`, sky `#7fe0ff`, mint `#9df0b8`, pink `#ff9fcb`.
- Visual values (spec §5): desktop grid 24 px with 1 px ink lines at ~7% opacity; window border 2 px, radius ~10 px, hard shadow `6px 6px 0`; title bar ~32 px yellow (active) / neutral (inactive), three 12 px outlined circles (white fill, not red/yellow/green); menu bar ~28 px ink with VT323 ~18 px; dock white, 2 px border, radius ~14 px, shadow `4px 4px 0`; icons ~38 px, 2 px border, radius ~9 px.
- Breakpoint: desktop at `min-width: 768px`, mobile below.
- No phone number anywhere in the code. The e-mail lives in exactly one place (`src/content/config.ts`), value `gabrielrizzi333@gmail.com`.
- Never invent facts about Gabriel: all copy comes from spec §6.2 (CV texts, TCC data, D1–D7 table). The builder may shorten, not add.
- Deceptive-pattern ban (spec D1–D7): no timers, no auto-opening anything except `sobre.txt` on desktop entry, no pre-checked choices, no emotional copy, close/list options as prominent as others, external links announce they open another site.
- WCAG 2.2 AA: keyboard-only operable, visible focus, contrast AA in both themes, targets ≥ 24 px, drag never the only way, `prefers-reduced-motion` honoured, `<html lang>` follows locale.

## Review Focus

1. **Small or resized viewport** (e.g. 800×500, or the window resized after opening): windows must open and stay fully reachable — title bar never off-screen. → Task 5 tests `open` and `move` clamping with a 800×500 viewport.
2. **Unknown or stale hash** (`#/app/xyz`, `#/qualquer`): show the normal desktop with `sobre.txt`, no crash, no blank screen. → Task 6 test.
3. **Storage unavailable** (Safari private mode, `localStorage` throws): locale and theme still resolve from the browser and toggles still work for the session. → Task 4 tests.
4. **Switching language with windows open**: the same windows stay open, in place, and their titles/bodies switch language. → Task 9 test.
5. **Re-opening an app that is already open or minimized**: no duplicate window; it restores and takes focus. → Task 5 test.

---

## File Structure

```
src/
  main.tsx                    # mounts <App/>, imports index.css
  App.tsx                     # picks view: List | Mobile | Desktop
  index.css                   # tailwind + tokens.css + fontsource imports
  styles/tokens.css           # CSS variables, light + dark ([data-theme="dark"])
  content/
    types.ts                  # Locale, AppId, Block, AppContent, SiteContent
    config.ts                 # CONTACT (email, linkedin, github), FERVO_URL, FITTRACK_URL
    pt.ts / en.ts             # SiteContent per locale
    index.ts                  # getContent(locale), APP_ORDER
  i18n/locale.tsx             # detectLocale, LocaleProvider, useLocale
  theme/theme.tsx             # detectTheme, ThemeProvider, useTheme
  lib/storage.ts              # safeGet / safeSet (try/catch around localStorage)
  os/
    windowManager.ts          # pure reducer + selectors
    route.ts                  # parseHash / toHash
    useHashRoute.ts           # hook syncing hash <-> state
    useIsMobile.ts            # matchMedia('(max-width: 767px)')
    Window.tsx                # one window (dialog, title bar, drag, buttons)
    MenuBar.tsx  Dock.tsx  DesktopIcons.tsx  Desktop.tsx
  apps/
    AppIcon.tsx               # inline SVG icon per AppId, RizziOS style
    AppBody.tsx               # renders Block[]
  mobile/MobileHome.tsx  mobile/MobileApp.tsx
  list/ListView.tsx
  test/setup.ts               # jest-dom + vitest-axe matchers, matchMedia mock
```

Delete: `src/components/**`, `src/pages/**`, `src/data/**`, `src/types/**`, `src/content/*.md`, `src/content/profile.ts`, `src/lib/utils.ts`, `src/App.css`, `components.json`.

---

### Task 1: Clean slate, tooling and tokens

**Files:**
- Delete: everything listed under "Delete" above.
- Modify: `package.json`, `vite.config.ts`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `index.html`, `eslint.config.js` (ignore `dist`, `coverage`)
- Create: `src/styles/tokens.css`, `src/test/setup.ts`, `src/App.test.tsx`

**Interfaces:**
- Produces: CSS variables `--ink --paper --surface --text --accent(yellow) --sky --mint --pink --line --shadow-color --focus` on `:root` and redefined under `:root[data-theme="dark"]`; Tailwind `@theme` maps them to `bg-paper`, `text-ink`, etc.; font families `--font-os` (VT323), `--font-ui` (Inter), `--font-body` (Atkinson Hyperlegible). npm script `test` = `vitest run`.

- [ ] **Step 1:** `npm uninstall shadcn @base-ui/react class-variance-authority clsx tailwind-merge tw-animate-css @hugeicons/react @hugeicons/core-free-icons @fontsource-variable/figtree react-markdown remark-gfm` then `npm install @fontsource/vt323 @fontsource/inter @fontsource/atkinson-hyperlegible` and `npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom vitest-axe`. Expected: install succeeds; if a Vitest major is incompatible with Vite 8, pick the newest Vitest whose peer range includes the installed Vite.
- [ ] **Step 2:** Delete the old files; replace `index.css` with Tailwind import, `tokens.css`, the three fontsource imports (Inter 400/600/800, Atkinson 400/700, VT323 400). Dark tokens (my call, must pass AA): desktop `#141625`, surface `#1e2135`, text/borders `#f1ede4`, shadow `#000000`, yellow/sky/mint/pink unchanged with ink text on them.
- [ ] **Step 3:** Configure Vitest in `vite.config.ts` (`test: { environment: 'jsdom', setupFiles: './src/test/setup.ts', globals: true }`); setup registers jest-dom and vitest-axe matchers and a `matchMedia` mock defaulting to desktop.
- [ ] **Step 4: Write the failing test** `src/App.test.tsx`: `it('renders the RizziOS root', ...)` → `render(<App/>)`; `expect(screen.getByTestId('rizzios-root')).toBeInTheDocument()`.
- [ ] **Step 5:** `npm test` → FAIL (no test id). Make `App` render `<div data-testid="rizzios-root" />`. `npm test` → PASS; `npm run build` and `npm run lint` → no errors.
- [ ] **Step 6: Commit** `chore: remove shadcn layout, add RizziOS tokens, fonts and test setup`

### Task 2: Content model, config and Portuguese content

**Files:**
- Create: `src/content/types.ts`, `src/content/config.ts`, `src/content/pt.ts`, `src/content/index.ts`, `src/content/content.test.ts`

**Interfaces:**
- Produces:
  ```ts
  type Locale = 'pt' | 'en'
  type AppId = 'sobre' | 'fervo' | 'fittrack' | 'experiencia' | 'stack' | 'acessibilidade' | 'formacao' | 'contato'
  type Link = { label: string; href: string; external: boolean }
  type Block =
    | { type: 'heading'; text: string }
    | { type: 'p'; text: string }
    | { type: 'list'; items: string[] }
    | { type: 'chips'; items: string[] }
    | { type: 'badge'; text: string }                       // e.g. "em evolução"
    | { type: 'links'; links: Link[] }
    | { type: 'timeline'; entries: { period: string; role: string; org: string; text: string }[] }
    | { type: 'table'; caption: string; head: string[]; rows: string[][] }
  type AppContent = { iconLabel: string; windowTitle: string; heading: string; blocks: Block[] }
  type UiStrings = { /* every chrome string: menu items, close/minimize/back, list version, skip link,
                       theme/locale toggles, "abre em outro site", shortcuts help, dock label, etc. */ }
  type SiteContent = { locale: Locale; meta: { title: string; description: string }; ui: UiStrings; apps: Record<AppId, AppContent> }
  const APP_ORDER: AppId[]  // ['sobre','fervo','fittrack','experiencia','stack','acessibilidade','formacao','contato']
  function getContent(locale: Locale): SiteContent
  // config.ts
  const CONTACT: { email: string; linkedin: string; github: string }
  const FERVO_URL = 'https://fervo.online'; const FITTRACK_URL = 'https://github.com/Rizzi-dev/FitTrack'
  ```
- Window titles (PT): `sobre.txt`, `fervo.app`, `fittrack.app`, `experiencia.log`, `stack.cfg`, `acessibilidade.md`, `formacao.txt`, `contato.vcf`.

- [ ] **Step 1: Write the failing tests** in `content.test.ts`:
  - `getContent('pt').apps` has exactly the keys of `APP_ORDER`.
  - every app has non-empty `windowTitle`, `heading` and ≥ 1 block.
  - `JSON.stringify(getContent('pt'))` does not match a generic Brazilian phone number pattern (no phone).
  - the string `gabrielrizzi333@gmail.com` appears in `config.ts` only: `grep`-style test reading `src/content/pt.ts` via `?raw` import must not contain it; the contato app's links include `mailto:${CONTACT.email}`.
  - `fittrack` blocks contain a `badge` with text `em evolução`.
  - `acessibilidade` contains a `table` with 7 rows whose first cells are `D1`…`D7`.
  - every `Link` whose `href` starts with `http` has `external: true`.
- [ ] **Step 2:** `npm test src/content` → FAIL.
- [ ] **Step 3:** Write `types.ts`, `config.ts`, `index.ts`, and `pt.ts` from spec §6.2 verbatim-or-shortened (sobre resumo, Fervo, FitTrack, experiência timeline with the three CV paragraphs, stack list as chips, acessibilidade = TCC block + Rocketseat + D1–D7 table, formação, contato with LinkedIn/GitHub/e-mail). Fervo has no code link. Contato has no phone.
- [ ] **Step 4:** `npm test src/content` → PASS.
- [ ] **Step 5: Commit** `feat: add typed Portuguese content for RizziOS apps`

### Task 3: English content

**Files:**
- Create: `src/content/en.ts`; Modify: `src/content/content.test.ts`, `src/content/index.ts`

**Interfaces:**
- Consumes: Task 2 types. Produces: `getContent('en')`.

- [ ] **Step 1: Write the failing tests:** parity — for every `AppId`, `en.apps[id].blocks.map(b => b.type)` equals the PT sequence; tables/timelines/lists have equal lengths; every `ui` key present in both; `en.apps.acessibilidade` contains the TCC English title `The influence of Forced Action Deceptive Patterns on digital vulnerability of people with Autistic Spectrum Disorder`; no phone pattern; FitTrack badge text `in progress`.
- [ ] **Step 2:** `npm test src/content` → FAIL.
- [ ] **Step 3:** Translate `pt.ts` into `en.ts`. Use the TCC's own Abstract (spec §6.2) for the TCC summary. Window titles: `about.txt`, `fervo.app`, `fittrack.app`, `experience.log`, `stack.cfg`, `accessibility.md`, `education.txt`, `contact.vcf`. Add `// REVIEW: translated by Claude, pending Gabriel's review` at the top of `en.ts`.
- [ ] **Step 4:** `npm test src/content` → PASS.
- [ ] **Step 5: Commit** `feat: add English content (pending review)`

### Task 4: Safe storage, locale and theme

**Files:**
- Create: `src/lib/storage.ts`, `src/i18n/locale.tsx`, `src/theme/theme.tsx`, `src/i18n/locale.test.tsx`, `src/theme/theme.test.tsx`

**Interfaces:**
- Produces:
  ```ts
  safeGet(key: string): string | null; safeSet(key: string, value: string): void   // never throw
  detectLocale(stored: string | null, languages: readonly string[]): Locale        // stored wins; else 'pt' if any language starts with 'pt'; else 'en'
  LocaleProvider; useLocale(): { locale: Locale; setLocale(l: Locale): void; content: SiteContent }  // key 'rizzios.locale'; sets document.documentElement.lang to 'pt-BR' | 'en'
  detectTheme(stored: string | null, prefersDark: boolean): 'light' | 'dark'
  ThemeProvider; useTheme(): { theme; toggleTheme(): void }  // key 'rizzios.theme'; sets <html data-theme>
  ```

- [ ] **Step 1: Write the failing tests:** `detectLocale(null, ['pt-BR'])==='pt'`, `detectLocale(null, ['en-US','pt'])==='pt'`, `detectLocale(null, ['fr'])==='en'`, `detectLocale('en', ['pt-BR'])==='en'`, invalid stored value `'xx'` ignored; `detectTheme(null,true)==='dark'`, `detectTheme('light',true)==='light'`; with `localStorage.getItem/setItem` mocked to throw, rendering `LocaleProvider` + calling `setLocale('en')` updates `document.documentElement.lang` to `en` without throwing (Review Focus 3); same for theme toggle setting `data-theme`.
- [ ] **Step 2:** run → FAIL. **Step 3:** implement. **Step 4:** run → PASS.
- [ ] **Step 5: Commit** `feat: add locale and theme providers with safe storage`

### Task 5: Window manager reducer

**Files:**
- Create: `src/os/windowManager.ts`, `src/os/windowManager.test.ts`

**Interfaces:**
- Produces:
  ```ts
  type Viewport = { width: number; height: number }
  type Win = { id: AppId; x: number; y: number; z: number; minimized: boolean }
  type WMState = { windows: Win[]; nextZ: number }
  type WMAction =
    | { type: 'open'; id: AppId; viewport: Viewport }
    | { type: 'close'; id: AppId }
    | { type: 'focus'; id: AppId }
    | { type: 'minimize'; id: AppId }
    | { type: 'move'; id: AppId; x: number; y: number; viewport: Viewport }
    | { type: 'cycle'; direction: 1 | -1 }
  const WINDOW_SIZE = { width: 520, height: 420 }; const MENU_BAR_H = 28; const DOCK_RESERVE = 72; const CASCADE = 28
  function wmReducer(s: WMState, a: WMAction): WMState
  function activeWindow(s: WMState): Win | undefined   // highest z among non-minimized
  const initialWM: WMState
  ```
- Clamp rule (algorithm): x ∈ [0, max(0, vw − 120)], y ∈ [MENU_BAR_H, max(MENU_BAR_H, vh − DOCK_RESERVE − 32)] — keeps at least 120 px of title bar visible. New windows: centered for the first, then cascade by `CASCADE` from the last opened, then clamped.

- [ ] **Step 1: Write the failing tests:** open adds one window with highest z; opening the same id again (open or minimized) does not duplicate, sets `minimized:false` and top z (Review Focus 5); close removes; focus raises z; minimize hides and `activeWindow` falls to the next; `cycle(1)` with three windows rotates focus through all and wraps; with viewport `{width: 800, height: 500}` an opened window's title bar is inside the viewport and `move` to `(-500, -500)` and `(5000, 5000)` clamps per the rule (Review Focus 1).
- [ ] **Step 2:** run → FAIL. **Step 3:** implement. **Step 4:** run → PASS.
- [ ] **Step 5: Commit** `feat: add window manager reducer`

### Task 6: Hash routing

**Files:**
- Create: `src/os/route.ts`, `src/os/useHashRoute.ts`, `src/os/route.test.ts`

**Interfaces:**
- Produces:
  ```ts
  type Route = { view: 'os'; app: AppId | null } | { view: 'list' }
  function parseHash(hash: string): Route   // '#/app/<id>' -> app; '#/lista' -> list; anything else -> { view:'os', app:null }
  function toHash(route: Route): string     // '' for {os,null}; '#/app/fervo'; '#/lista'
  function useHashRoute(): [Route, (r: Route, opts?: { replace?: boolean }) => void]  // listens to hashchange; push by default
  ```

- [ ] **Step 1: Write the failing tests:** round-trip for every `AppId`; `parseHash('#/app/xyz')` and `parseHash('#/qualquer')` and `parseHash('')` → `{view:'os', app:null}` (Review Focus 2); `parseHash('#/lista')` → list; the hook updates when `window.location.hash` changes and `hashchange` fires.
- [ ] **Step 2:** run → FAIL. **Step 3:** implement. **Step 4:** run → PASS.
- [ ] **Step 5: Commit** `feat: add hash routing for apps and list view`

### Task 7: App icons and block renderer

**Files:**
- Create: `src/apps/AppIcon.tsx`, `src/apps/AppBody.tsx`, `src/apps/AppBody.test.tsx`

**Interfaces:**
- Consumes: `Block`, `AppId`, `UiStrings`.
- Produces: `<AppIcon id={AppId} size?={number} />` (decorative SVG, `aria-hidden`, flat colours from tokens, 2 px ink outline; one distinct glyph per app, drawn by hand, no icon library); `<AppBody blocks={Block[]} ui={UiStrings} headingLevel={2|3} />`.

- [ ] **Step 1: Write the failing tests:** renders each block type (`table` renders a real `<table>` with `<caption>` and `<th scope="col">`; `timeline` renders an `<ol>`); external links have `target="_blank"`, `rel="noopener noreferrer"` and accessible name ending with `ui.opensNewSite` (D7); `mailto:` link is not external; `axe(container)` has no violations.
- [ ] **Step 2:** run → FAIL. **Step 3:** implement with Atkinson for body, Inter for headings, chips per spec (2 px border, radius ~6 px, 12 px weight 600). **Step 4:** run → PASS.
- [ ] **Step 5: Commit** `feat: add app icons and content block renderer`

### Task 8: Window component

**Files:**
- Create: `src/os/Window.tsx`, `src/os/Window.test.tsx`

**Interfaces:**
- Consumes: `Win`, `AppContent`, `UiStrings`, `AppBody`.
- Produces:
  ```ts
  <Window win={Win} app={AppContent} ui={UiStrings} active={boolean}
          onClose(): void  onMinimize(): void  onFocus(): void  onMove(x: number, y: number): void
          titleRef?: React.Ref<HTMLHeadingElement> />
  ```
  Renders `role="dialog"` with `aria-modal="false"` and `aria-labelledby` → title `<h2 tabIndex={-1}>` showing `app.windowTitle` in VT323. Title bar: three decorative circles, title, then real buttons "Minimizar"/"Fechar" (from `ui`, ≥ 24 px targets). Drag: pointer events on the title bar (`setPointerCapture`), calls `onMove` (drag stays enabled under reduced motion; it is user-driven). Keyboard alternative to drag is not required because moving is not needed to reach content (2.5.7 satisfied: every action has a button).

- [ ] **Step 1: Write the failing tests:** dialog has accessible name = window title; Esc while focus is inside calls `onClose`; buttons call `onClose`/`onMinimize`; pointerdown at (10,10) + pointermove to (60,40) on the title bar calls `onMove(win.x+50, win.y+30)`; pointerdown anywhere calls `onFocus`; inactive window title bar has a different class/attribute than active (`data-active`); axe clean.
- [ ] **Step 2:** run → FAIL. **Step 3:** implement. **Step 4:** run → PASS.
- [ ] **Step 5: Commit** `feat: add accessible draggable window`

### Task 9: Desktop shell (menu bar, icons, dock, integration)

**Files:**
- Create: `src/os/MenuBar.tsx`, `src/os/DesktopIcons.tsx`, `src/os/Dock.tsx`, `src/os/Desktop.tsx`, `src/os/Desktop.test.tsx`; Modify: `src/App.tsx`

**Interfaces:**
- Consumes: Tasks 4–8.
- Produces: `<Desktop />` (reads locale/theme/route via hooks). MenuBar (`<header>`): logo "RizziOS" (yellow block), menu "Arquivo" (open any app, "Versão em lista"), "Projetos" (Fervo, FitTrack), "Contato" (opens contato), locale toggle `PT | EN` (two `aria-pressed` buttons), theme toggle (button with `aria-pressed`), clock (`<time>`, updates each minute, `aria-hidden` is NOT used; it is plain text). Menus are disclosure buttons (`aria-expanded`) with a list of buttons, Esc closes the menu and returns focus to its button. DesktopIcons: `<nav aria-label>` list of buttons (icon + VT323 label), double click OR Enter/Space opens. Dock (`<nav aria-label>`): one button per app; open apps marked (`aria-pressed` + dot), minimized ones restore on click. Skip link "Pular para o conteúdo" first in tab order → focuses the active window title, or the icons if none. Shortcut **Ctrl+Alt+→ / Ctrl+Alt+←** cycles windows (dispatch `cycle`) and focuses the new active title; the shortcut is listed in `ui` and in the Acessibilidade app.
- Behaviour: on desktop mount with route `{os, app:null}` open `sobre`; with `{os, app:X}` open X. Opening/focusing an app pushes `#/app/<id>`; closing the active window replaces the hash with the next active (or `''`). Focus moves to the new window's title on open; on close it returns to the element that opened it (keep a `Map<AppId, HTMLElement>` of openers; fall back to the dock button).

- [ ] **Step 1: Write the failing tests (Testing Library + user-event):**
  - initial render shows dialog named `sobre.txt` and `location.hash === ''` or `#/app/sobre`.
  - with `location.hash = '#/app/fervo'` before render → dialog `fervo.app` is open.
  - Tab to the desktop icon "Fervo", press Enter → `fervo.app` dialog open, its title focused, hash `#/app/fervo`.
  - Esc in that window → dialog gone and focus back on the "Fervo" icon button.
  - minimize via button → dialog hidden, dock button for Fervo still `aria-pressed="true"`; clicking it restores the dialog.
  - open three apps, press Ctrl+Alt+ArrowRight three times → focus visits each window title and wraps.
  - switch locale to EN with `sobre` and `fervo` open → dialogs `about.txt` and `fervo.app` present, positions unchanged (Review Focus 4); `document.documentElement.lang === 'en'`.
  - menu "Arquivo" → "Versão em lista" sets hash `#/lista`.
  - `axe(document.body)` no violations with two windows open.
- [ ] **Step 2:** run → FAIL. **Step 3:** implement; `App` renders `<LocaleProvider><ThemeProvider>` then `<Desktop/>` (List and Mobile come in Tasks 10–11). **Step 4:** run → PASS; `npm run build` OK.
- [ ] **Step 5: Commit** `feat: add RizziOS desktop shell`

### Task 10: List version

**Files:**
- Create: `src/list/ListView.tsx`, `src/list/ListView.test.tsx`; Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `getContent`, `AppBody`, `useHashRoute`, locale/theme hooks.
- Produces: `<ListView />` — one page: `<header>` with name + "Voltar para a área de trabalho" (link to `''` hash) + locale/theme toggles, `<nav>` table of contents (anchor links), then one `<section aria-labelledby>` per app in `APP_ORDER` with `<h2>` heading and `AppBody headingLevel={3}`. No windows, no drag. Same typography and palette, no grid background.

- [ ] **Step 1: Write the failing tests:** with hash `#/lista`, `App` renders `ListView` (heading level 1 = "Gabriel Rizzi"); 8 sections in `APP_ORDER`; "Voltar para a área de trabalho" returns to Desktop; axe clean; also renders on mobile width.
- [ ] **Step 2:** run → FAIL. **Step 3:** implement; `App` chooses `ListView` when `route.view === 'list'` regardless of width. **Step 4:** run → PASS.
- [ ] **Step 5: Commit** `feat: add accessible list version`

### Task 11: Mobile home screen and full-screen apps

**Files:**
- Create: `src/os/useIsMobile.ts`, `src/mobile/MobileHome.tsx`, `src/mobile/MobileApp.tsx`, `src/mobile/Mobile.test.tsx`; Modify: `src/App.tsx`

**Interfaces:**
- Produces: `useIsMobile(): boolean` (`matchMedia('(max-width: 767px)')`, live). `<MobileHome />`: status bar (RizziOS + clock + PT/EN + theme), a visible identity block ("Gabriel Rizzi", "Desenvolvedor Fullstack & Mobile", "Co-Founder & CEO @ Fervo") before the grid, grid of app buttons (icon + label, ≥ 44 px targets), link "Versão em lista". `<MobileApp id />`: full-screen `<main>` with top bar (Back button + `windowTitle` as `<h1>`), `AppBody headingLevel={2}`; focus goes to `<h1>` on open.
- Behaviour: open app → push `#/app/<id>`; Back button → `history.back()` when the previous entry is ours, else set hash `''`; browser back (hashchange to `''`) closes the app. Deep link `#/app/fittrack` on mobile opens it full screen. No `sobre` auto-open on mobile (identity block covers it).

- [ ] **Step 1: Write the failing tests** (mock `matchMedia` to mobile): home shows the identity text without any interaction; tapping "FitTrack" shows heading `fittrack.app` focused and hash `#/app/fittrack`; firing `hashchange` with hash `''` returns to home; Back button returns to home and focus lands on the "FitTrack" button; axe clean on home and on an app.
- [ ] **Step 2:** run → FAIL. **Step 3:** implement; `App` = list → `ListView`; mobile → `MobileHome`/`MobileApp`; else `Desktop`. **Step 4:** run → PASS.
- [ ] **Step 5: Commit** `feat: add mobile home screen and full-screen apps`

### Task 12: Motion, metadata, final verification

**Files:**
- Modify: `index.html`, `src/styles/tokens.css`, `README.md`
- Create: `scripts/contrast-check.mjs`

**Interfaces:**
- Consumes: everything.

- [ ] **Step 1:** Window open/close/minimize animation ≤ 150 ms (scale/opacity); all transitions removed under `@media (prefers-reduced-motion: reduce)`. No blinking anywhere (the clock has no blinking colon).
- [ ] **Step 2:** `index.html`: `lang="pt-BR"` default, `<title>Gabriel Rizzi · RizziOS</title>`, meta description from `pt.meta.description`, `theme-color`, Open Graph title/description (no og:image yet; noted in README).
- [ ] **Step 3:** `scripts/contrast-check.mjs` computes WCAG contrast for every text/background token pair used (light + dark: text on desktop, text on window, ink on yellow/sky/mint/pink, focus ring vs both backgrounds ≥ 3:1). Run `node scripts/contrast-check.mjs` → every pair prints PASS (≥ 4.5:1 text, ≥ 3:1 non-text). Fix tokens if any FAIL.
- [ ] **Step 4:** `npm test` (all PASS), `npm run lint` (0 errors), `npm run build` (OK).
- [ ] **Step 5:** Run the app (`npm run dev`) and capture screenshots at 1440×900 light, 1440×900 dark, 390×844 light, plus the list view; check against `docs/superpowers/specs/references/rizzios-estilos.html` option C. Keyboard pass by hand: Tab order skip link → menu bar → icons → windows → dock; Esc; Ctrl+Alt+→.
- [ ] **Step 6:** Rewrite `README.md`: what RizziOS is, scripts, where content lives (`src/content/pt.ts`, `en.ts`, `config.ts`), how to add an app (new `AppId`, content in both locales, icon), the D1–D7 rule, and the open items: EN copy pending Gabriel's review, e-mail to switch to the rizzi.dev domain, og:image, deploy.
- [ ] **Step 7: Commit** `feat: polish motion, metadata and docs for RizziOS`

---

**Not in this plan (by spec):** blog, CMS, sounds, elaborate easter eggs, CV download, deploy/domain. Gabriel must review PT and EN copy before anything is published.
