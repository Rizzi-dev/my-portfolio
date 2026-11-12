# RizziOS — portfólio de Gabriel Rizzi

Documento de design do novo portfólio (`rizzi.dev`). Substitui por completo o layout atual do repositório `my-portfolio`.

## 1. Intenção

O portfólio atual é um esqueleto com cara de template shadcn (cards arredondados, tons neutros, texto provisório). Gabriel quer um site com identidade própria que **não pareça feito por IA** e que, por si só, prove domínio de front-end, mobile e acessibilidade.

A ideia escolhida: o portfólio é um **sistema operacional fictício, o "RizziOS"**. As seções são "apps" que abrem em janelas numa área de trabalho. Quem abre o site entende em segundos que está diante de alguém que domina interação. Quem tem pressa (recrutador) acha "quem é" e "contato" imediatamente.

O site também precisa ser coerente com o README do GitHub e com a nova capa do LinkedIn, que já usam a mesma identidade RizziOS.

## 2. Público

- **Recrutadores e tech leads** procurando dev Fullstack/Mobile (principal).
- **Parceiros, clientes e investidores do Fervo**, que chegam pelo cargo de Co-Founder & CEO.
- **Pessoas que usam tecnologia assistiva.** Gabriel estuda e tem formação em WCAG; o site é vitrine disso.

## 3. Objetivos, não objetivos e anti-objetivos

**Objetivos**
- Visual original e memorável no estilo RizziOS híbrido (seção 5).
- Conteúdo real do Gabriel em **português e inglês**.
- **WCAG 2.2 nível AA** em todo o site, incluindo a área de trabalho.
- Funcionar bem no celular, com uma experiência pensada para ele (seção 6.3), e não uma versão espremida do desktop.
- Conteúdo fácil de atualizar sem mexer em componentes.

**Não objetivos (fora da v1)**
- Blog.
- CMS ou painel administrativo.
- Sons do sistema e easter eggs elaborados (lixeira, jogos, tela azul). Podem entrar depois; a arquitetura não deve impedir.
- Download do CV em PDF (o CV atual contém telefone; ver seção 8).
- Compra do domínio e roteamento de e-mail (Gabriel fará por conta própria).

**Anti-objetivos (se acontecer, falhou mesmo funcionando)**
- Parecer template: shadcn, cards `rounded-lg` com sombra suave, gradiente roxo-azul, emojis como marcadores de seção.
- Imitar o macOS ou o Windows a ponto de parecer cópia, ou usar logos e marcas da Apple ou da Microsoft.
- Conteúdo escondido: um recrutador precisar "brincar" com janelas para achar o básico.
- Acessibilidade como remendo: janelas que não funcionam com teclado ou leitor de tela.
- Expor o telefone do Gabriel.
- Usar qualquer padrão manipulativo (o tema do TCC do Gabriel): pop-ups insistentes, apelos emocionais, opções pré-marcadas, pressão de tempo.

## 4. Restrições

- **Repositório:** `Rizzi-dev/my-portfolio`, branch `master`. Reaproveita a base atual: **Vite + React 19 + TypeScript + Tailwind 4**.
- **Remover:** shadcn, `@base-ui/react`, `class-variance-authority`, componentes em `src/components/ui`, a fonte Figtree e todo o layout atual (`home-page.tsx`, `carousel`, `stack-grid`, `nav`, o fundo que segue o mouse). Nada do visual atual é mantido.
- **Commits sem coautoria do Claude** e PRs sem "Generated with Claude Code".
- Site estático (sem backend). Precisa rodar em qualquer hospedagem estática.

## 5. Identidade visual: RizziOS híbrido

Estrutura moderna (barra de menu no topo, dock embaixo) com detalhes retrô. A referência visual aprovada está em dois arquivos HTML desta pasta, que podem ser abertos no navegador:
- `references/rizzios-estilos.html`: seção **"C · Híbrido RizziOS"** (a área de trabalho aprovada) e o celular "c" na seção "No celular". As opções A e B foram descartadas.
- `references/capa-linkedin.html`: a capa do LinkedIn já publicada, desenhada em canvas em 1584 × 396. Os valores em pixels dela (bordas, sombras, raios, grade) são a referência de escala mais precisa.

Valores de referência extraídos desses arquivos (o builder pode ajustar para escala de tela, mantendo a proporção):
- Grade da área de trabalho: linhas de 1 px em `ink` com ~7% de opacidade, a cada 24 px.
- Janela: borda 2 px (3–4 px em elementos grandes), raio ~10 px, sombra dura `6px 6px 0 ink`.
- Barra de título: altura ~32 px, fundo amarelo, borda inferior 2 px, três círculos de 12 px com borda 2 px e fundo branco, título em VT323.
- Barra de menu: altura ~28 px, fundo `ink`, texto `paper` em VT323 ~18 px, logo "RizziOS" em bloco amarelo.
- Dock: fundo branco, borda 2 px, raio ~14 px, sombra `4px 4px 0 ink`; ícones de ~38 px com borda 2 px, raio ~9 px e cores sky/mint/pink/yellow.
- Chips: borda 2 px, raio ~6 px, texto 12 px em peso 600.

**Paleta (tema claro)**
| Token | Valor | Uso |
|---|---|---|
| ink | `#15172a` | texto, contornos, barra de menu, sombras duras |
| paper | `#f1ede4` | fundo da área de trabalho (com grade quadriculada sutil) |
| white | `#ffffff` | corpo das janelas |
| yellow | `#ffd23f` | barra de título da janela ativa, logo RizziOS |
| sky | `#7fe0ff` | ícones e chips |
| mint | `#9df0b8` | ícones e chips |
| pink | `#ff9fcb` | ícones e chips |

**Tema escuro ("modo noturno")**: mesma personalidade, sem simplesmente inverter. O builder define os valores, mantendo contraste AA e as bordas grossas visíveis.

**Tipografia**
- **VT323** (pixelada): somente na "interface do sistema": barra de menu, títulos de janela, rótulos de ícones, relógio.
- **Inter**: títulos dentro das janelas e textos de interface.
- **Atkinson Hyperlegible**: texto corrido. Escolhida por ter sido desenhada para legibilidade, coerente com o foco em acessibilidade.
- Fontes servidas pelo próprio site (por exemplo via `@fontsource`), sem depender do Google Fonts.

**Linguagem visual**
- Bordas grossas (2–4 px) em `ink`, cantos levemente arredondados, **sombra dura** deslocada (sem desfoque).
- Janela ativa com barra de título amarela; janelas inativas com barra neutra.
- Três "bolinhas" na barra de título com contorno, sem as cores vermelho/amarelo/verde do macOS.

## 6. Experiência

### 6.1 Área de trabalho (≥ 768 px de largura)

- **Barra de menu (topo):** logo "RizziOS", menus (Arquivo, Projetos, Contato), seletor de idioma **PT / EN**, alternância claro/escuro, relógio.
- **Ícones na área de trabalho** e **dock** embaixo com os apps.
- **Janelas:** abrir, fechar, minimizar (vai para o dock), focar (traz para frente), **arrastar** pela barra de título. Redimensionar e maximizar ficam a critério do builder.
- **Ao entrar:** a janela `sobre.txt` já abre sozinha, centralizada e focada.
- Posição inicial das janelas em cascata; janelas nunca abrem fora da tela.

### 6.2 Apps (conteúdo)

| App | Conteúdo |
|---|---|
| **sobre.txt** | Nome, "Desenvolvedor Fullstack & Mobile", "Co-Founder & CEO @ Fervo", Curitiba-PR, resumo do CV (produtos digitais, web, mobile e APIs; interesse em arquitetura, acessibilidade e UX), links rápidos para Contato e Fervo. |
| **Fervo** | Plataforma SaaS de gestão de entidades acadêmicas, eventos e venda de ingressos (compra online com Mercado Pago, ingresso com QR code, venda presencial com Pix, app mobile). Papel: Co-Founder & CEO, atuando da concepção do produto à arquitetura e ao desenvolvimento. Stack: React, React Native/Expo, TypeScript, Vite, Tailwind, Fastify, Prisma, Supabase, Mercado Pago. Link para `https://fervo.online`. Sem link de código (repositórios privados). |
| **FitTrack** | App mobile de academia feito na faculdade (2024–2025), com selo **"em evolução"**. Perfis de aluno e instrutor; treino do dia por dia da semana; escolha de academia; personalização de treino com exercícios e séries; "treine do seu jeito" com foto pela câmera; compartilhar treino; painel do instrutor com alunos, notificações e localização. Stack: React Native, Expo, expo-router, TypeScript. Link para `https://github.com/Rizzi-dev/FitTrack`. |
| **Experiência** | Linha do tempo: HUMU (2025–atual, Desenvolvedor Fullstack Pleno e Mobile, produtos para o setor financeiro); Fervo (2025–atual, Co-Founder & CEO); TrueWork Consultoria e Desenvolvimento (2022–2025, estágio frontend e mobile com Vue.js, React Native e testes automatizados). |
| **Stack** | React, React Native, Vue.js, Node.js, JavaScript, TypeScript, HTML/CSS, SQL, REST API, Docker, Git, ESLint, Jest, Robot, UX/UI. |
| **Acessibilidade** | WCAG, acessibilidade cognitiva e UX/UI. Três blocos: (1) o **TCC** (dados abaixo), com o resumo; (2) **Formação em Acessibilidade Front-end** pela **Faculdade de Tecnologia Rocketseat**; (3) **"Como o RizziOS segue o meu TCC"**: as diretrizes D1–D7 do TCC aplicadas a este site, uma por uma (tabela abaixo), mais teclado, leitor de tela, contraste e movimento reduzido. |
| **Formação** | Bacharelado em Sistemas de Informação, UTFPR (2020–2025), TCC aprovado em 04/11/2025 (título abaixo). Formação em Acessibilidade Front-end, Faculdade de Tecnologia Rocketseat. Curso: AWS Academy – Cybersecurity. |

**TCC (fonte: o PDF entregue pelo Gabriel; usar só estes fatos)**
- Título: *A influência dos padrões manipulativos do tipo Forced Action sobre a vulnerabilidade digital de pessoas com Transtorno do Espectro Autista*.
- Título em inglês (do próprio TCC): *The influence of Forced Action Deceptive Patterns on digital vulnerability of people with Autistic Spectrum Disorder*.
- UTFPR, Bacharelado em Sistemas de Informação, Curitiba, 2025. Aprovado em 04/11/2025.
- Orientador: Prof. Dr. Leonelo Dell Anhol Almeida. Coorientadora: Cindy Gleyce Santos Luiz.
- Resumo (usar o do TCC, pode ser encurtado): pesquisa qualitativa e exploratória sobre como padrões manipulativos do tipo *Forced Action* afetam a autonomia e a interação digital de pessoas com TEA. Analisou interfaces do Candy Crush e do Instagram com sete diretrizes derivadas da WCAG 2.1 e do guia COGA do W3C, e organizou um conjunto de exemplos de *Forced Action* considerando as características de pessoas com TEA. O resumo em inglês já existe no TCC (Abstract) e deve ser usado na versão EN.
- Palavras-chave: padrões manipulativos, Forced Action, acessibilidade digital, Transtorno do Espectro Autista, design inclusivo.
- Sem link para o PDF na v1 (ver seção 8).

**Diretrizes do TCC aplicadas ao RizziOS** (conteúdo do bloco 3 e também requisito de produto, ver 6.4):
| ID | Diretriz (TCC) | Como o RizziOS cumpre |
|---|---|---|
| D1 | Clareza na linguagem | Textos diretos, sem apelo emocional nem ambiguidade; rótulos dizem exatamente o que acontece. |
| D2 | Alternativas visíveis | "Versão em lista" e "fechar" sempre com o mesmo destaque que as outras opções. |
| D3 | Controle da pessoa usuária | Nada exige cadastro, dados ou ação para ver qualquer conteúdo. |
| D4 | Tempo adequado para decisão | Nenhum limite de tempo, contador ou pop-up que pressione resposta. |
| D5 | Previsibilidade das interações | Janelas só abrem por ação da pessoa (exceto `sobre.txt` na entrada); nada muda sozinho; Esc sempre fecha. |
| D6 | Evitar sobrecarga sensorial | Sem som automático, sem piscar, animações curtas e desligáveis (`prefers-reduced-motion`). |
| D7 | Transparência nas escolhas | Links externos indicam que abrem outro site; nenhuma escolha pré-marcada. |
| **Contato** | LinkedIn (`https://www.linkedin.com/in/gabrielrizzi113`), GitHub (`https://github.com/Rizzi-dev`) e e-mail. **Sem telefone.** |

**Textos de base (do CV do Gabriel, usar como fonte; não inventar conquistas, números ou credenciais além disto):**

> Resumo: Desenvolvedor Fullstack e Mobile com experiência no desenvolvimento de produtos digitais, aplicações web, mobile e APIs. Atualmente atuo na HUMU, participando da construção e evolução de soluções para o setor fintech, envolvendo fluxos transacionais, integrações, regras de negócio e jornadas críticas de usuários. Também atuo na construção da Fervo, uma plataforma SaaS voltada à gestão de entidades e eventos, participando desde a concepção do produto até a definição da arquitetura e desenvolvimento das aplicações.
>
> Possuo experiência com React, React Native, Node.js, TypeScript e bancos de dados relacionais, além de vivência com desenvolvimento de produtos, integrações externas, resolução de problemas em produção e decisões técnicas. Tenho interesse especial em arquitetura de software, desenvolvimento de produtos digitais, acessibilidade e experiência do usuário.

> HUMU: Atuação no desenvolvimento e evolução de produtos digitais para o setor financeiro, trabalhando em aplicações web, serviços backend e aplicações mobile.

> Fervo: Atuação na construção de uma plataforma SaaS voltada à gestão de entidades acadêmicas, eventos, usuários e produtos. Participação ativa desde a concepção do produto até a definição de soluções técnicas, arquitetura e desenvolvimento das aplicações.

> TrueWork: Atuação no desenvolvimento de aplicações web (Vue.JS) e mobile (React Native), participando da construção de interfaces, funcionalidades e testes automatizados.

Cada experiência é exibida com cargo, empresa, período e esse parágrafo; sem listas de conquistas na v1. O builder pode editar o texto para caber no formato de janela (encurtar, dividir em parágrafos), sem acrescentar fatos.

**Cargos:** no portfólio, "Co-Founder & CEO" no Fervo (no CV ele usa "Co-Founder e Desenvolvedor"; isso não afeta o site).

**E-mail:** fica numa única configuração. Valor provisório `gabrielrizzi333@gmail.com`, que será trocado pelo e-mail do domínio rizzi.dev quando existir.

O projeto "ferramentas-online" **não entra**.

### 6.3 Celular (< 768 px)

- Vira a **tela inicial de um smartphone RizziOS**: barra de status no topo, grade de ícones de apps.
- Tocar num ícone abre o app **em tela cheia**, com botão de voltar e título no topo. Nada de janelas arrastáveis.
- O botão voltar do navegador e o gesto de voltar fecham o app (ver seção 6.5).
- O primeiro conteúdo visível já identifica Gabriel (nome e cargo), sem precisar tocar em nada.

### 6.4 Acessibilidade (WCAG 2.2 AA)

Requisitos, não sugestões:
- Tudo funciona **só com teclado**: Tab percorre menu, ícones e dock; Enter/Espaço abre um app; **Esc fecha** a janela focada; deve haver atalho para alternar entre janelas abertas.
- Ao abrir um app, o foco vai para a janela (título). Ao fechar, o foco volta para o ícone que a abriu.
- Janelas expõem papel e nome acessíveis (por exemplo `role="dialog"` não modal com `aria-labelledby`); o leitor de tela anuncia o que abriu.
- Arrastar nunca é a única forma de fazer algo (critério 2.5.7).
- Link "Pular para o conteúdo" e uma **"Versão em lista"** (todos os apps em uma página linear, sem janelas), acessível pelo menu e pelo link de pular. Ela também serve a quem prefere não usar a área de trabalho.
- Contraste AA em ambos os temas, foco sempre visível, alvos de toque ≥ 24 px.
- `prefers-reduced-motion` desliga animações de abrir/fechar/arrastar.
- `lang` do documento acompanha o idioma escolhido.
- **Acessibilidade cognitiva e zero padrões manipulativos:** o site cumpre as diretrizes D1–D7 da tabela na seção 6.2 (vindas do TCC do Gabriel). Qualquer recurso futuro (easter eggs, sons) também precisa cumprir.

### 6.5 Idioma e URLs

- PT e EN com o mesmo conteúdo. Idioma inicial pelo navegador; a escolha fica salva no navegador; seletor na barra de menu (e equivalente no celular).
- Cada app tem um endereço próprio para poder ser compartilhado (por exemplo um link direto para o Fervo). Abrir esse endereço mostra a área de trabalho com aquele app aberto (no celular, o app em tela cheia). O formato dos endereços fica com o builder.

## 7. Conteúdo e manutenção

- Todo o texto vive em arquivos de conteúdo tipados, separados por idioma (por exemplo `src/content/pt.ts` e `src/content/en.ts`), com a mesma estrutura nos dois. Componentes não contêm texto do Gabriel.
- Adicionar um projeto novo = adicionar uma entrada de conteúdo e um ícone, sem tocar no gerenciador de janelas.
- O status "em evolução" do FitTrack é um campo de conteúdo.

## 8. Decisões tomadas por mim (Claude), não pelo Gabriel

Gabriel pode revisar qualquer uma:
- Manter Vite + React + Tailwind e implementar o gerenciador de janelas sem biblioteca de terceiros.
- Fontes VT323, Inter e Atkinson Hyperlegible, servidas pelo próprio site.
- Breakpoint de 768 px entre área de trabalho e celular.
- "Versão em lista" como alternativa acessível.
- Sem sons nem easter eggs na v1.
- Sem download do CV na v1, porque o PDF atual expõe o telefone. Pode entrar quando houver uma versão sem telefone.
- O app Acessibilidade mostra como o próprio site cumpre as diretrizes D1–D7 do TCC.
- Sem link para o PDF do TCC na v1 (contém dedicatória e agradecimentos pessoais). Se o TCC for publicado no repositório institucional da UTFPR, o link entra.
- O texto em inglês ainda não existe. A tradução a partir do português é uma tarefa do plano, e o site só é publicado depois que o Gabriel revisar os dois idiomas.
- Os textos de conteúdo são redigidos a partir dos textos de base da seção 6.2, e o Gabriel revisa tudo antes da publicação.

## 9. Deixado para o builder

- Estrutura de pastas, gerenciamento de estado das janelas e formato das rotas/endereços.
- Valores exatos do tema escuro, animações, tamanhos e posições de janelas, ícones de cada app (desenhados no estilo RizziOS, sem bibliotecas de ícones genéricas).
- Estratégia de testes (incluindo verificação automática de acessibilidade) e lint.
- Metadados de SEO e imagem de compartilhamento (a capa do LinkedIn é uma boa base).
- Hospedagem estática e configuração de deploy.
