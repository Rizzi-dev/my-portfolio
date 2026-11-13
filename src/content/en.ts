// REVIEW: translated by Claude, pending Gabriel's review
import { CONTACT, FERVO_URL, FITTRACK_URL } from './config'
import type { SiteContent } from './types'

export const en: SiteContent = {
  locale: 'en',
  meta: {
    title: 'Gabriel Rizzi · RizziOS',
    description:
      'Gabriel Rizzi, Fullstack & Mobile Developer and Co-Founder & CEO of Fervo, in Curitiba, Brazil.',
  },
  profile: {
    name: 'Gabriel Rizzi',
    role: 'Fullstack & Mobile Developer',
    company: 'Co-Founder & CEO @ Fervo',
  },
  ui: {
    skipToContent: 'Skip to content',
    menuFile: 'File',
    menuProjects: 'Projects',
    menuContact: 'Contact',
    listVersion: 'List version',
    backToDesktop: 'Back to the desktop',
    close: 'Close',
    minimize: 'Minimize',
    back: 'Back',
    opensNewSite: '(opens another site)',
    themeToggle: 'Switch theme',
    themeLight: 'Light theme',
    themeDark: 'Dark theme',
    localeLabel: 'Language',
    desktopIconsLabel: 'Desktop icons',
    dockLabel: 'App dock',
    appsLabel: 'Apps',
    shortcutsHelp:
      'Shortcuts: Esc closes the window. Alt+Shift+→ and Alt+Shift+← switch between windows.',
    contentsLabel: 'Contents',
  },
  apps: {
    sobre: {
      iconLabel: 'about',
      windowTitle: 'about.txt',
      heading: 'Gabriel Rizzi',
      blocks: [
        { type: 'p', text: 'Fullstack & Mobile Developer' },
        { type: 'p', text: 'Co-Founder & CEO @ Fervo · Curitiba, Brazil' },
        {
          type: 'p',
          text: 'Fullstack and Mobile Developer with experience building digital products, web and mobile applications, and APIs. I currently work at HUMU, helping build and evolve solutions for the fintech sector, and I am building Fervo, a SaaS platform for managing organizations and events.',
        },
        {
          type: 'p',
          text: 'I have a special interest in software architecture, digital product development, accessibility and user experience.',
        },
        {
          type: 'links',
          links: [
            { label: 'Contact', href: '#/app/contato', external: false },
            { label: 'Fervo', href: '#/app/fervo', external: false },
          ],
        },
      ],
    },
    fervo: {
      iconLabel: 'fervo',
      windowTitle: 'fervo.app',
      heading: 'Fervo',
      blocks: [
        {
          type: 'p',
          text: 'SaaS platform for university athletic associations and student organizations: ticket sales, event management and membership management in one place.',
        },
        {
          type: 'p',
          text: 'Role: Co-Founder & CEO, working from product concept to architecture and development.',
        },
        { type: 'heading', text: 'For buyers' },
        {
          type: 'list',
          items: [
            'Online checkout with Mercado Pago (Pix and card) and real-time ticket availability',
            'QR code tickets and digital membership card',
            'Sign in with Google or email',
          ],
        },
        { type: 'heading', text: 'For organizers' },
        {
          type: 'list',
          items: [
            '3-step event creation with live preview',
            'Chained ticket batches, coupons and configurable service fee',
            'In-person sales by promoters: Pix, card via link, complimentary and cash',
            'Ticket check-in at the door with the camera',
            'Event cost calculator with shopping list and break-even point',
            'Financial dashboard with statement, CSV export and 2FA-protected payouts',
          ],
        },
        { type: 'heading', text: 'For organizations' },
        {
          type: 'list',
          items: [
            'Public page with events, membership plans, products and sports',
            'Online membership sign-up and renewal',
            'Sports: teams, athletes, training schedule with attendance and document review',
            'Multiple admins with permissions and ownership transfer',
          ],
        },
        { type: 'heading', text: 'Engineering' },
        {
          type: 'list',
          items: [
            'Web, API, mobile app (iOS and Android) and back office in separate repositories, each with its own ADRs',
            'Spec-Driven Development: spec and task before code',
            'WCAG 2.1 AA accessibility, CSP/HSTS, reCAPTCHA v3, SEO and GA4',
            'Continuous deployment on Cloudflare Pages, with an open staging environment',
          ],
        },
        { type: 'heading', text: 'Stack' },
        {
          type: 'chips',
          items: [
            'React',
            'React Native/Expo',
            'TypeScript',
            'Vite',
            'Tailwind',
            'shadcn/ui',
            'React Hook Form + Zod',
            'Fastify',
            'Prisma',
            'Supabase',
            'Mercado Pago',
            'Resend',
            'Cloudflare Pages',
          ],
        },
        {
          type: 'links',
          links: [{ label: 'fervo.online', href: FERVO_URL, external: true }],
        },
      ],
    },
    fittrack: {
      iconLabel: 'fittrack',
      windowTitle: 'fittrack.app',
      heading: 'FitTrack',
      blocks: [
        { type: 'badge', text: 'in progress' },
        {
          type: 'p',
          text: 'Gym mobile app built at university (2024–2025).',
        },
        {
          type: 'list',
          items: [
            'Student and instructor profiles',
            'Workout of the day by day of the week',
            'Gym selection',
            'Workout customization with exercises and sets',
            '"Train your way" with a photo from the camera',
            'Share workout',
            'Instructor dashboard with students, notifications and location',
          ],
        },
        { type: 'heading', text: 'Stack' },
        {
          type: 'chips',
          items: ['React Native', 'Expo', 'expo-router', 'TypeScript'],
        },
        {
          type: 'links',
          links: [{ label: 'Code on GitHub', href: FITTRACK_URL, external: true }],
        },
      ],
    },
    experiencia: {
      iconLabel: 'experience',
      windowTitle: 'experience.log',
      heading: 'Experience',
      blocks: [
        {
          type: 'timeline',
          entries: [
            {
              period: '2025–present',
              role: 'Fullstack and Mobile Developer',
              org: 'HUMU',
              text: 'Development and evolution of digital products for the financial sector, working on web applications, backend services and mobile applications.',
            },
            {
              period: '2025–present',
              role: 'Co-Founder & CEO',
              org: 'Fervo',
              text: 'Building a SaaS platform for managing academic organizations, events, users and products. Actively involved from the product concept through technical decisions, architecture and application development.',
            },
            {
              period: '2022–2025',
              role: 'Frontend and mobile intern',
              org: 'TrueWork Consultoria e Desenvolvimento',
              text: 'Development of web (Vue.js) and mobile (React Native) applications, helping build interfaces, features and automated tests.',
            },
          ],
        },
      ],
    },
    stack: {
      iconLabel: 'stack',
      windowTitle: 'stack.cfg',
      heading: 'Stack',
      blocks: [
        {
          type: 'chips',
          items: [
            'React',
            'React Native',
            'Vue.js',
            'Node.js',
            'JavaScript',
            'TypeScript',
            'HTML/CSS',
            'SQL',
            'REST API',
            'Docker',
            'Git',
            'ESLint',
            'Jest',
            'Robot',
            'UX/UI',
          ],
        },
      ],
    },
    acessibilidade: {
      iconLabel: 'accessibility',
      windowTitle: 'accessibility.md',
      heading: 'Accessibility',
      blocks: [
        { type: 'p', text: 'WCAG, cognitive accessibility and UX/UI.' },
        { type: 'heading', text: 'Thesis' },
        {
          type: 'p',
          text: 'The influence of Forced Action Deceptive Patterns on digital vulnerability of people with Autistic Spectrum Disorder',
        },
        {
          type: 'p',
          text: 'UTFPR, B.Sc. in Information Systems, Curitiba, 2025. Approved on November 4, 2025. Advisor: Prof. Dr. Leonelo Dell Anhol Almeida. Co-advisor: Cindy Gleyce Santos Luiz.',
        },
        {
          type: 'p',
          text: 'Qualitative, exploratory research on how deceptive patterns of the Forced Action type affect the autonomy and digital interaction of people with ASD. It analyzed the interfaces of Candy Crush and Instagram using seven guidelines derived from WCAG 2.1 and the W3C COGA guide, and organized a set of Forced Action examples considering the characteristics of people with ASD.',
        },
        {
          type: 'p',
          text: 'Keywords: Deceptive Patterns, Forced Action, digital accessibility, Autism Spectrum Disorder, inclusive design.',
        },
        { type: 'heading', text: 'Front-end Accessibility training' },
        { type: 'p', text: 'Rocketseat Faculty of Technology.' },
        { type: 'heading', text: 'How RizziOS follows my thesis' },
        {
          type: 'p',
          text: 'Guidelines D1 to D7 from the thesis, applied to this site one by one. It also works with the keyboard alone: Tab moves through the menu, icons and dock; Enter or Space opens an app; Esc closes the window; Alt+Shift+→ and Alt+Shift+← switch between windows. The site supports screen readers, has AA contrast in both themes and respects the reduced motion preference.',
        },
        {
          type: 'table',
          caption: 'Thesis guidelines applied to RizziOS',
          head: ['ID', 'Guideline (thesis)', 'How RizziOS meets it'],
          rows: [
            [
              'D1',
              'Clear language',
              'Direct text, with no emotional appeal or ambiguity; labels say exactly what happens.',
            ],
            [
              'D2',
              'Visible alternatives',
              '"List version" and "close" always have the same prominence as the other options.',
            ],
            [
              'D3',
              'User control',
              'Nothing requires sign-up, data or any action to see any content.',
            ],
            [
              'D4',
              'Adequate time to decide',
              'No time limits, countdowns or pop-ups that pressure a response.',
            ],
            [
              'D5',
              'Predictable interactions',
              'Windows open only by the person’s action (except about.txt on entry); nothing changes on its own; Esc always closes.',
            ],
            [
              'D6',
              'Avoid sensory overload',
              'No automatic sound, no flashing, short animations that can be turned off (prefers-reduced-motion).',
            ],
            [
              'D7',
              'Transparency in choices',
              'External links say they open another site; no choice is pre-selected.',
            ],
          ],
        },
      ],
    },
    formacao: {
      iconLabel: 'education',
      windowTitle: 'education.txt',
      heading: 'Education',
      blocks: [
        {
          type: 'list',
          items: [
            'B.Sc. in Information Systems, UTFPR (2020–2025). Thesis approved on November 4, 2025.',
            'Front-end Accessibility training, Rocketseat Faculty of Technology.',
            'Course: AWS Academy – Cybersecurity.',
          ],
        },
        {
          type: 'p',
          text: 'Thesis: The influence of Forced Action Deceptive Patterns on digital vulnerability of people with Autistic Spectrum Disorder.',
        },
      ],
    },
    contato: {
      iconLabel: 'contact',
      windowTitle: 'contact.vcf',
      heading: 'Contact',
      blocks: [
        {
          type: 'links',
          links: [
            { label: 'LinkedIn', href: CONTACT.linkedin, external: true },
            { label: 'GitHub', href: CONTACT.github, external: true },
            { label: CONTACT.email, href: `mailto:${CONTACT.email}`, external: false },
          ],
        },
      ],
    },
  },
}
