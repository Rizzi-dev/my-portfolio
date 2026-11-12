import ptSource from './pt.ts?raw'
import enSource from './en.ts?raw'
import { APP_ORDER, getContent } from './index'
import { CONTACT } from './config'
import type { Block, Link } from './types'

const pt = getContent('pt')

// Generic Brazilian phone shape: optional (DD), optional 9, 4+4 digits.
const BR_PHONE = /\(?\d{2}\)?\s?9?\d{4}[-\s]?\d{4}/

function allLinks(): Link[] {
  return Object.values(pt.apps).flatMap((app) =>
    app.blocks.flatMap((b: Block) => (b.type === 'links' ? b.links : [])),
  )
}

describe('pt content', () => {
  it('has exactly the apps in APP_ORDER', () => {
    expect(Object.keys(pt.apps).sort()).toEqual([...APP_ORDER].sort())
  })

  it('every app has title, heading and blocks', () => {
    for (const id of APP_ORDER) {
      const app = pt.apps[id]
      expect(app.windowTitle).not.toBe('')
      expect(app.heading).not.toBe('')
      expect(app.blocks.length).toBeGreaterThanOrEqual(1)
    }
  })

  it('contains no phone number', () => {
    expect(JSON.stringify(pt)).not.toMatch(BR_PHONE)
    expect(JSON.stringify(pt)).not.toMatch(/\+55/)
  })

  it('keeps the e-mail only in config.ts', () => {
    expect(ptSource).not.toContain(CONTACT.email)
    expect(CONTACT.email).toBe('gabrielrizzi333@gmail.com')
    expect(JSON.stringify(pt)).toContain(`mailto:${CONTACT.email}`)
    const contato = pt.apps.contato.blocks.filter((b) => b.type === 'links')
    expect(
      contato.some((b) => b.links.some((l) => l.href === `mailto:${CONTACT.email}`)),
    ).toBe(true)
  })

  it('marks fittrack as em evolução', () => {
    expect(pt.apps.fittrack.blocks).toContainEqual({ type: 'badge', text: 'em evolução' })
  })

  it('acessibilidade has a D1..D7 table', () => {
    const table = pt.apps.acessibilidade.blocks.find((b) => b.type === 'table')
    expect(table?.type).toBe('table')
    if (table?.type !== 'table') return
    expect(table.rows.map((r) => r[0])).toEqual(['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'])
  })

  it('external links are flagged', () => {
    const links = allLinks()
    expect(links.length).toBeGreaterThan(0)
    for (const l of links) {
      if (l.href.startsWith('http')) expect(l.external).toBe(true)
      else expect(l.external).toBe(false)
    }
  })

  it('has required UI strings and profile', () => {
    expect(pt.profile.name).toBe('Gabriel Rizzi')
    expect(pt.meta.title).toBe('Gabriel Rizzi · RizziOS')
    expect(pt.ui.shortcutsHelp).toMatch(/Esc/)
  })

  it("documents Alt+Shift+Arrow (not VoiceOver's Ctrl+Option) in both locales", () => {
    const en = getContent('en')
    for (const c of [pt, en]) {
      expect(c.ui.shortcutsHelp).toMatch(/Alt\+Shift\+→/)
      expect(c.ui.shortcutsHelp).toMatch(/Alt\+Shift\+←/)
      const a11y = JSON.stringify(c.apps.acessibilidade)
      expect(a11y).toMatch(/Alt\+Shift\+→/)
      expect(JSON.stringify(c)).not.toMatch(/Ctrl\+Alt/)
    }
  })

  it('every icon label is lowercase in both locales', () => {
    for (const c of [pt, getContent('en')])
      for (const id of APP_ORDER) expect(c.apps[id].iconLabel).toBe(c.apps[id].iconLabel.toLowerCase())
  })
})

describe('en content', () => {
  const en = getContent('en')

  it('has the same block structure as pt for every app', () => {
    for (const id of APP_ORDER) {
      expect(en.apps[id].blocks.map((b) => b.type)).toEqual(pt.apps[id].blocks.map((b) => b.type))
      en.apps[id].blocks.forEach((b, i) => {
        const p = pt.apps[id].blocks[i]
        if (b.type === 'table' && p.type === 'table') {
          expect(b.rows.length).toBe(p.rows.length)
          expect(b.head.length).toBe(p.head.length)
        }
        if (b.type === 'timeline' && p.type === 'timeline') expect(b.entries.length).toBe(p.entries.length)
        if (b.type === 'list' && p.type === 'list') expect(b.items.length).toBe(p.items.length)
        if (b.type === 'chips' && p.type === 'chips') expect(b.items.length).toBe(p.items.length)
        if (b.type === 'links' && p.type === 'links') expect(b.links.length).toBe(p.links.length)
      })
    }
  })

  it('has every ui key', () => {
    expect(Object.keys(en.ui).sort()).toEqual(Object.keys(pt.ui).sort())
  })

  it('is a real translation', () => {
    expect(en.locale).toBe('en')
    expect(en).not.toBe(pt)
    expect(en.apps.sobre.windowTitle).toBe('about.txt')
  })

  it('uses the TCC English title', () => {
    expect(JSON.stringify(en.apps.acessibilidade)).toContain(
      'The influence of Forced Action Deceptive Patterns on digital vulnerability of people with Autistic Spectrum Disorder',
    )
  })

  it('marks fittrack as in progress', () => {
    expect(en.apps.fittrack.blocks).toContainEqual({ type: 'badge', text: 'in progress' })
  })

  it('has no phone number and keeps the e-mail only in config.ts', () => {
    expect(JSON.stringify(en)).not.toMatch(BR_PHONE)
    expect(JSON.stringify(en)).not.toMatch(/\+55/)
    expect(enSource).not.toContain(CONTACT.email)
    expect(JSON.stringify(en)).toContain(`mailto:${CONTACT.email}`)
  })

  it('has the D1..D7 table and flags links', () => {
    const table = en.apps.acessibilidade.blocks.find((b) => b.type === 'table')
    if (table?.type !== 'table') throw new Error('no table')
    expect(table.rows.map((r) => r[0])).toEqual(['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'])
    for (const app of Object.values(en.apps))
      for (const b of app.blocks)
        if (b.type === 'links')
          for (const l of b.links) expect(l.external).toBe(l.href.startsWith('http'))
  })

  it('keeps profile and meta title', () => {
    expect(en.profile).toEqual({
      name: 'Gabriel Rizzi',
      role: 'Fullstack & Mobile Developer',
      company: 'Co-Founder & CEO @ Fervo',
    })
    expect(en.meta.title).toBe('Gabriel Rizzi · RizziOS')
  })
})
