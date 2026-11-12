# RizziOS — portfólio de Gabriel Rizzi

Portfólio de Gabriel Rizzi, Desenvolvedor Fullstack & Mobile e Co-Founder & CEO da Fervo.
O site é um sistema operacional fictício, o **RizziOS**: cada seção é um "app".

- **Área de trabalho (≥ 768 px):** barra de menu, ícones, janelas e dock. `sobre.txt` abre
  sozinho na entrada; o resto só abre por ação da pessoa.
- **Celular (< 768 px):** tela inicial com grade de apps; cada app abre em tela cheia.
- **Versão em lista (`#/lista`):** todos os apps numa página linear, sem janelas. Fica na barra
  de menu da área de trabalho (botão próprio e menu Arquivo), no segundo link de pular (logo
  depois de "Pular para o conteúdo") e no fim da tela inicial do celular. Links entre apps
  (`#/app/<id>`) continuam na lista e levam à seção correspondente.
- **Endereços:** `#/app/<id>` abre aquele app (por exemplo `#/app/fervo`).
- **Teclado:** Tab percorre menu, ícones, janelas e dock; Enter/Espaço abre; Esc fecha a janela
  (no celular, Esc volta para a tela inicial); Alt+Shift+→ / Alt+Shift+← alternam entre janelas.
- **Hospedagem:** o build usa caminhos relativos (`base: './'`) e as rotas são só de hash, então
  `dist/` funciona em qualquer hospedagem estática, inclusive em um subcaminho.

Detalhes do design: [`docs/superpowers/specs/2026-11-12-rizzios-portfolio-design.md`](docs/superpowers/specs/2026-11-12-rizzios-portfolio-design.md).

## Stack

Vite, React 19, TypeScript e Tailwind 4, sem bibliotecas de componentes ou de ícones. O
gerenciador de janelas é próprio (`src/os/windowManager.ts`). Fontes servidas pelo próprio site
via `@fontsource`: VT323 (só na interface do sistema), Inter (títulos e interface) e Atkinson
Hyperlegible (texto corrido). Site estático, sem backend.

## Scripts

Node 20 e npm.

| Comando | O que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento |
| `npm test` | testes (Vitest + Testing Library + axe) |
| `npm run lint` | ESLint |
| `npm run build` | checagem de tipos e build de produção em `dist/` |
| `npm run preview` | serve o build de `dist/` |
| `npm run contrast` | contraste WCAG de cada par de cores dos tokens, nos dois temas |

## Onde fica o conteúdo

Componentes não contêm texto do Gabriel. Todo o texto vive em arquivos tipados:

- `src/content/pt.ts` e `src/content/en.ts` — mesmo formato nos dois (`SiteContent` em
  `src/content/types.ts`): metadados, perfil, textos de interface e o conteúdo de cada app em
  blocos (`p`, `list`, `chips`, `badge`, `links`, `timeline`, `table`, `heading`).
- `src/content/config.ts` — e-mail, LinkedIn, GitHub e URLs de projetos. O e-mail existe **só
  aqui**; os arquivos de idioma o importam.
- `src/styles/tokens.css` — cores dos temas claro e escuro e fontes.

Os testes de conteúdo (`src/content/content.test.ts`) conferem que PT e EN têm a mesma
estrutura, que não há telefone em lugar nenhum e que links externos estão marcados.

## Como adicionar um app

1. Acrescente o id em `AppId` (`src/content/types.ts`) e na posição desejada de `APP_ORDER`
   (`src/content/index.ts`). A rota `#/app/<id>`, a dock, os ícones e a versão em lista passam a
   incluí-lo sozinhos.
2. Escreva o conteúdo em **`pt.ts` e `en.ts`** (`iconLabel` em minúsculas, `windowTitle`,
   `heading`, `blocks`). Links externos levam `external: true`.
3. Desenhe o ícone em `src/apps/AppIcon.tsx` (SVG próprio no estilo RizziOS, fundo
   sky/mint/pink/yellow com traço `ink`).
4. Se for um projeto, inclua-o no menu Projetos (`src/os/MenuBar.tsx`).
5. `npm test`, `npm run lint`, `npm run build`.

O gerenciador de janelas não precisa mudar.

## Regra D1–D7

O site segue as diretrizes contra padrões manipulativos do TCC do Gabriel. **Qualquer recurso
novo também precisa cumprir** (o app Acessibilidade mostra a mesma tabela para quem visita).

| | Diretriz | Como o RizziOS aplica |
|---|---|---|
| D1 | Clareza na linguagem | Textos diretos, sem apelo emocional nem ambiguidade; rótulos dizem exatamente o que acontece. |
| D2 | Alternativas visíveis | "Versão em lista" e "fechar" sempre com o mesmo destaque que as outras opções. |
| D3 | Controle da pessoa usuária | Nada exige cadastro, dados ou ação para ver qualquer conteúdo. |
| D4 | Tempo adequado para decisão | Nenhum limite de tempo, contador ou pop-up que pressione resposta. |
| D5 | Previsibilidade das interações | Janelas só abrem por ação da pessoa (exceto `sobre.txt` na entrada); nada muda sozinho; Esc sempre fecha. |
| D6 | Evitar sobrecarga sensorial | Sem som automático, sem piscar, animações curtas (≤ 150 ms) e desligadas com `prefers-reduced-motion`. |
| D7 | Transparência nas escolhas | Links externos indicam que abrem outro site; nenhuma escolha pré-marcada. |

Além disso: WCAG 2.2 AA (só teclado, foco visível, contraste AA nos dois temas, alvos ≥ 24 px,
arrastar nunca é a única forma) e `<html lang>` acompanhando o idioma.

## Pendências

- **Texto em inglês** aguarda revisão do Gabriel (assim como o português) antes de publicar.
- **E-mail:** trocar para um endereço no domínio `rizzi.dev` em `src/content/config.ts` quando o
  domínio e o roteamento de e-mail existirem.
- **`og:image`:** ainda não há imagem de compartilhamento (a capa do LinkedIn é uma boa base);
  `index.html` já tem título, descrição e Open Graph de texto. O favicon (`public/favicon.svg`) é
  o "R" do RizziOS em azulejo amarelo.
- **Resumo do TCC em inglês:** pela spec, o resumo em EN do app Acessibilidade deve usar o texto
  do *Abstract* do próprio TCC, literalmente. Gabriel precisa confirmar que o texto em
  `src/content/en.ts` é esse (ou colá-lo).
- **Teste manual com leitores de tela:** antes de publicar, uma passada com VoiceOver no Safari
  (macOS/iOS) e com NVDA no Windows (abrir/fechar janelas, Alt+Shift+setas, versão em lista,
  celular).
- **Deploy:** hospedagem estática e domínio ainda não configurados.
