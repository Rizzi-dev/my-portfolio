import { CONTACT, FERVO_URL, FITTRACK_URL } from './config'
import type { SiteContent } from './types'

export const pt: SiteContent = {
  locale: 'pt',
  meta: {
    title: 'Gabriel Rizzi · RizziOS',
    description:
      'Gabriel Rizzi, Desenvolvedor Fullstack & Mobile e Co-Founder & CEO da Fervo, em Curitiba-PR.',
  },
  profile: {
    name: 'Gabriel Rizzi',
    role: 'Desenvolvedor Fullstack & Mobile',
    company: 'Co-Founder & CEO @ Fervo',
  },
  ui: {
    skipToContent: 'Pular para o conteúdo',
    menuFile: 'Arquivo',
    menuProjects: 'Projetos',
    menuContact: 'Contato',
    listVersion: 'Versão em lista',
    backToDesktop: 'Voltar para a área de trabalho',
    close: 'Fechar',
    minimize: 'Minimizar',
    back: 'Voltar',
    opensNewSite: '(abre em outro site)',
    themeToggle: 'Alternar tema',
    themeLight: 'Tema claro',
    themeDark: 'Tema escuro',
    localeLabel: 'Idioma',
    desktopIconsLabel: 'Ícones da área de trabalho',
    dockLabel: 'Dock de aplicativos',
    appsLabel: 'Aplicativos',
    shortcutsHelp:
      'Atalhos: Esc fecha a janela. Alt+Shift+→ e Alt+Shift+← alternam entre janelas.',
    contentsLabel: 'Conteúdo',
  },
  apps: {
    sobre: {
      iconLabel: 'sobre',
      windowTitle: 'sobre.txt',
      heading: 'Gabriel Rizzi',
      blocks: [
        { type: 'p', text: 'Desenvolvedor Fullstack & Mobile' },
        { type: 'p', text: 'Co-Founder & CEO @ Fervo · Curitiba-PR' },
        {
          type: 'p',
          text: 'Desenvolvedor Fullstack e Mobile com experiência no desenvolvimento de produtos digitais, aplicações web, mobile e APIs. Atualmente atuo na HUMU, participando da construção e evolução de soluções para o setor fintech, e na construção da Fervo, uma plataforma SaaS voltada à gestão de entidades e eventos.',
        },
        {
          type: 'p',
          text: 'Tenho interesse especial em arquitetura de software, desenvolvimento de produtos digitais, acessibilidade e experiência do usuário.',
        },
        {
          type: 'links',
          links: [
            { label: 'Contato', href: '#/app/contato', external: false },
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
          text: 'Plataforma SaaS para atléticas e entidades acadêmicas: venda de ingressos, gestão de eventos e gestão de sócios em um só lugar.',
        },
        {
          type: 'p',
          text: 'Papel: Co-Founder & CEO, atuando da concepção do produto à arquitetura e ao desenvolvimento.',
        },
        { type: 'heading', text: 'Para quem compra' },
        {
          type: 'list',
          items: [
            'Compra online com Mercado Pago (Pix e cartão) e disponibilidade dos lotes em tempo real',
            'Ingresso com QR code e carteirinha digital de sócio',
            'Login com Google ou e-mail',
          ],
        },
        { type: 'heading', text: 'Para quem organiza' },
        {
          type: 'list',
          items: [
            'Criação de evento em 3 etapas, com prévia ao vivo',
            'Lotes encadeados, cupons e taxa de serviço configurável',
            'Venda presencial pelo promoter: Pix, cartão por link, cortesia e dinheiro',
            'Validação de ingressos na entrada pela câmera',
            'Calculadora de custos do evento, com lista de compras e ponto de equilíbrio',
            'Painel financeiro com extrato, exportação em CSV e saque com 2FA',
          ],
        },
        { type: 'heading', text: 'Para a entidade' },
        {
          type: 'list',
          items: [
            'Página pública com eventos, planos, produtos e esportes',
            'Sócios com adesão e renovação online',
            'Esportes: modalidades, atletas, agenda de treinos com chamada e conferência de documentos',
            'Vários administradores com permissões e transferência de propriedade',
          ],
        },
        { type: 'heading', text: 'Engenharia' },
        {
          type: 'list',
          items: [
            'Web, API, app mobile (iOS e Android) e backoffice em repositórios separados, com ADRs próprios',
            'Spec-Driven Development: spec e task antes do código',
            'Acessibilidade WCAG 2.1 AA, CSP/HSTS, reCAPTCHA v3, SEO e GA4',
            'Deploy contínuo na Cloudflare Pages, com staging aberto para testes',
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
        { type: 'badge', text: 'em evolução' },
        {
          type: 'p',
          text: 'App mobile de academia feito na faculdade (2024–2025).',
        },
        {
          type: 'list',
          items: [
            'Perfis de aluno e instrutor',
            'Treino do dia por dia da semana',
            'Escolha de academia',
            'Personalização de treino com exercícios e séries',
            '"Treine do seu jeito" com foto pela câmera',
            'Compartilhar treino',
            'Painel do instrutor com alunos, notificações e localização',
          ],
        },
        { type: 'heading', text: 'Stack' },
        {
          type: 'chips',
          items: ['React Native', 'Expo', 'expo-router', 'TypeScript'],
        },
        {
          type: 'links',
          links: [{ label: 'Código no GitHub', href: FITTRACK_URL, external: true }],
        },
      ],
    },
    experiencia: {
      iconLabel: 'experiência',
      windowTitle: 'experiencia.log',
      heading: 'Experiência',
      blocks: [
        {
          type: 'timeline',
          entries: [
            {
              period: '2025–atual',
              role: 'Desenvolvedor Fullstack e Mobile',
              org: 'HUMU',
              text: 'Atuação no desenvolvimento e evolução de produtos digitais para o setor financeiro, trabalhando em aplicações web, serviços backend e aplicações mobile.',
            },
            {
              period: '2025–atual',
              role: 'Co-Founder & CEO',
              org: 'Fervo',
              text: 'Atuação na construção de uma plataforma SaaS voltada à gestão de entidades acadêmicas, eventos, usuários e produtos. Participação ativa desde a concepção do produto até a definição de soluções técnicas, arquitetura e desenvolvimento das aplicações.',
            },
            {
              period: '2022–2025',
              role: 'Estágio frontend e mobile',
              org: 'TrueWork Consultoria e Desenvolvimento',
              text: 'Atuação no desenvolvimento de aplicações web (Vue.js) e mobile (React Native), participando da construção de interfaces, funcionalidades e testes automatizados.',
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
      iconLabel: 'acessibilidade',
      windowTitle: 'acessibilidade.md',
      heading: 'Acessibilidade',
      blocks: [
        { type: 'p', text: 'WCAG, acessibilidade cognitiva e UX/UI.' },
        { type: 'heading', text: 'TCC' },
        {
          type: 'p',
          text: 'A influência dos padrões manipulativos do tipo Forced Action sobre a vulnerabilidade digital de pessoas com Transtorno do Espectro Autista',
        },
        {
          type: 'p',
          text: 'UTFPR, Bacharelado em Sistemas de Informação, Curitiba, 2025. Aprovado em 04/11/2025. Orientador: Prof. Dr. Leonelo Dell Anhol Almeida. Coorientadora: Cindy Gleyce Santos Luiz.',
        },
        {
          type: 'p',
          text: 'Pesquisa qualitativa e exploratória sobre como padrões manipulativos do tipo Forced Action afetam a autonomia e a interação digital de pessoas com TEA. Analisou interfaces do Candy Crush e do Instagram com sete diretrizes derivadas da WCAG 2.1 e do guia COGA do W3C, e organizou um conjunto de exemplos de Forced Action considerando as características de pessoas com TEA.',
        },
        {
          type: 'p',
          text: 'Palavras-chave: padrões manipulativos, Forced Action, acessibilidade digital, Transtorno do Espectro Autista, design inclusivo.',
        },
        { type: 'heading', text: 'Formação em Acessibilidade Front-end' },
        { type: 'p', text: 'Faculdade de Tecnologia Rocketseat.' },
        { type: 'heading', text: 'Como o RizziOS segue o meu TCC' },
        {
          type: 'p',
          text: 'As diretrizes D1 a D7 do TCC aplicadas a este site, uma por uma. Também funciona só com teclado: Tab percorre menu, ícones e dock; Enter ou Espaço abre um app; Esc fecha a janela; Alt+Shift+→ e Alt+Shift+← alternam entre janelas. O site tem suporte a leitor de tela, contraste AA nos dois temas e respeita a preferência por movimento reduzido.',
        },
        {
          type: 'table',
          caption: 'Diretrizes do TCC aplicadas ao RizziOS',
          head: ['ID', 'Diretriz (TCC)', 'Como o RizziOS cumpre'],
          rows: [
            [
              'D1',
              'Clareza na linguagem',
              'Textos diretos, sem apelo emocional nem ambiguidade; rótulos dizem exatamente o que acontece.',
            ],
            [
              'D2',
              'Alternativas visíveis',
              '"Versão em lista" e "fechar" sempre com o mesmo destaque que as outras opções.',
            ],
            [
              'D3',
              'Controle da pessoa usuária',
              'Nada exige cadastro, dados ou ação para ver qualquer conteúdo.',
            ],
            [
              'D4',
              'Tempo adequado para decisão',
              'Nenhum limite de tempo, contador ou pop-up que pressione resposta.',
            ],
            [
              'D5',
              'Previsibilidade das interações',
              'Janelas só abrem por ação da pessoa (exceto sobre.txt na entrada); nada muda sozinho; Esc sempre fecha.',
            ],
            [
              'D6',
              'Evitar sobrecarga sensorial',
              'Sem som automático, sem piscar, animações curtas e desligáveis (prefers-reduced-motion).',
            ],
            [
              'D7',
              'Transparência nas escolhas',
              'Links externos indicam que abrem outro site; nenhuma escolha pré-marcada.',
            ],
          ],
        },
      ],
    },
    formacao: {
      iconLabel: 'formação',
      windowTitle: 'formacao.txt',
      heading: 'Formação',
      blocks: [
        {
          type: 'list',
          items: [
            'Bacharelado em Sistemas de Informação, UTFPR (2020–2025). TCC aprovado em 04/11/2025.',
            'Formação em Acessibilidade Front-end, Faculdade de Tecnologia Rocketseat.',
            'Curso: AWS Academy – Cybersecurity.',
          ],
        },
        {
          type: 'p',
          text: 'TCC: A influência dos padrões manipulativos do tipo Forced Action sobre a vulnerabilidade digital de pessoas com Transtorno do Espectro Autista.',
        },
      ],
    },
    contato: {
      iconLabel: 'contato',
      windowTitle: 'contato.vcf',
      heading: 'Contato',
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
