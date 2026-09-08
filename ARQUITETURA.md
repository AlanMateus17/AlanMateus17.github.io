# Arquitetura do site — alanmateus17.github.io

Este documento explica **como o projeto está organizado agora**, depois da
reestruturação: por que cada pasta existe, como CSS/JS/HTML se relacionam,
e o raciocínio por trás das decisões — pra você conseguir dar manutenção
sozinho sem precisar decorar tudo de novo daqui a 3 meses.

Todo arquivo `.css` e `.js` também tem comentários explicando o que cada
bloco faz — este documento é o "mapa geral"; os comentários dentro de cada
arquivo são o "zoom" em cada parte.

---

## 1. Visão geral: Jekyll, e o que isso significa na prática

O site é gerado pelo **Jekyll** (rodando automaticamente no GitHub Pages a
cada `git push`). Isso significa que existem dois "mundos" de código aqui,
que não devem ser confundidos:

- **Liquid** (`{% ... %}` e `{{ ... }}`) — roda uma vez, **no momento do
  build**, no servidor do GitHub. Gera o HTML final. Não existe mais depois
  que a página chega no navegador de quem visita o site.
- **JavaScript** (`assets/js/*.js`) — roda **no navegador de cada
  visitante**, depois que a página já chegou pronta. É o que faz botões
  responderem a clique, contadores atualizarem, etc.

Isso importa porque **arquivos `.js` não são processados pelo Jekyll** —
eles são servidos exatamente como estão escritos. Então, sempre que um
script precisa de um dado que só existe em tempo de build (o slug de um
post, um ID de formulário, uma config do `_config.yml`), esse dado precisa
"atravessar a ponte" de Liquid pra JS através de **atributos `data-*` no
HTML** — nunca dentro do próprio arquivo `.js`. Você vai ver esse padrão
se repetir várias vezes abaixo.

## 2. Estrutura de pastas

```
_config.yml          → configuração central do Jekyll (títulos, IDs de API, etc.)
_layouts/             → "moldes" de página (default, post, sistema)
_includes/            → pedaços de HTML reutilizados entre páginas (nav, comentários, etc.)
_posts/                → os artigos do blog
_sistemas/             → um arquivo por projeto do portfólio (collection do Jekyll)
_data/comments/        → comentários aprovados manualmente (ver README-COMENTARIOS.md)
admin/                 → editor visual (Decap CMS)
assets/
  css/main.css          → TODO o CSS do site, num arquivo só (ver seção 3)
  js/                    → TODO o JS do site, organizado em pastas (ver seção 4)
<pasta-de-cada-página>/index.html → uma pasta por URL (ex.: /sobre/, /blog/)
```

## 3. CSS — `assets/css/main.css`

Fica num arquivo único de propósito (facilita o navegador cachear uma vez
só), mas é organizado em seções bem marcadas com comentários
`/* === NOME DA SEÇÃO === */`. As principais, na ordem em que aparecem:

1. **TOKENS** (`:root { --brand: ...; }`) — todas as cores, espaçamentos e
   fontes do site são variáveis CSS aqui. Trocar uma cor do site inteiro é
   mudar uma linha aqui, nunca procurar por um valor de cor espalhado pelo
   HTML.
2. **MODO ESCURO** — os mesmos tokens, com valores diferentes, ativados
   quando `<html data-theme="dark">`.
3. **LAYOUT** e **UTILITÁRIOS** — classes pequenas e genéricas
   (`.text-muted`, `.mb-2`, `.flex-center`, etc.) que substituem o que
   antes eram estilos `style="..."` escritos direto no HTML. Regra: se um
   valor se repete em mais de um lugar e não é exclusivo de um componente
   específico, vira uma classe aqui.
4. **Seções por componente/página** (`NAVEGAÇÃO`, `HERO`, `PORTFOLIO`,
   `CURRÍCULO`, `TERMINAL`, etc.) — cada uma cobre um pedaço visual
   específico do site.
5. **RESPONSIVO** — media queries, por último, sempre sobrescrevendo o que
   vem antes.

**Por que quase não sobrou `style="..."` no HTML:** antes havia 201
ocorrências espalhadas por ~20 arquivos. Isso significava que ajustar uma
cor ou espaçamento repetido virava uma caça ao tesouro pelo HTML inteiro.
Agora restam só 3, e são um caso legítimo: `style="--frente-color:#00C2A8"`
define uma *variável CSS por instância* (um jeito padrão e correto de
parametrizar um componente reaproveitável) — não é a mesma coisa que
"esquecer" o estilo dentro do HTML.

## 4. JavaScript — `assets/js/`

```
site-config.js     → lê configuração do _config.yml (via data-* no <body>)
core/                → roda em TODA página, é a base do site
  canvas-utils.js       funções de desenho compartilhadas (geração de imagens)
  counter-api.js        comunicação com o CounterAPI (views/curtidas)
  theme.js              botão de claro/escuro
  navigation.js         menu, scroll da nav, voltar ao topo
  animations.js         efeito de digitação, fade-in ao rolar
  pwa.js                instalar como app + service worker
features/            → uma funcionalidade por arquivo; cada um SÓ FAZ ALGO
                        se o elemento HTML dele existir na página atual
                        (por isso é seguro carregar todos em toda página)
  reading-progress.js, filters.js, copy-code.js, toc.js, view-counter.js,
  blog-search.js, most-read.js, likes-widget.js, post-status.js,
  study-guide.js, comments.js, quiz.js, share-post.js, share-global.js
pages/                → lógica exclusiva de UMA página específica —
                        só é carregado nela, não no site inteiro
  curriculo.js, citacao.js, trilha.js, cartao.js
vendor/               → bibliotecas de terceiros (não escritas por nós)
  gerador-visual.js (QRCode.js), mailerlite.js
```

### Como tudo é carregado: `_includes/scripts.html`

Esse arquivo é o **único lugar** que decide a ordem de carregamento do JS
global — está incluído em `_layouts/default.html`, então roda em toda
página. Ele carrega, nesta ordem: `site-config.js` → `core/*` → `features/*`.
A ordem importa porque um arquivo pode depender do anterior (ex.:
`core/counter-api.js` usa `AMSite.config`, que só existe depois de
`site-config.js` rodar).

Os scripts de `pages/` **não** estão em `scripts.html` — cada página os
carrega individualmente (ex.: só `/curriculo/` carrega `pages/curriculo.js`),
pra não pesar o carregamento das páginas que não precisam deles.

### O padrão `AMSite` e por que os módulos existem

Todo arquivo de `core/` e `features/` guarda suas funções dentro de um
objeto global único, `window.AMSite` (ex.: `AMSite.counter.ligarBotaoCurtir`,
`AMSite.canvas.wrapText`). Isso substitui o que antes eram 3 cópias
levemente diferentes da mesma lógica (curtir um post, curtir um comentário,
curtir um card do portfólio todas reimplementavam a mesma chamada ao
CounterAPI; `roundRect`/`wrapText` existiam coladas em 3 arquivos de
geração de imagem diferentes). Agora existe **uma versão de cada função**,
e um bug corrigido nela é corrigido em todo lugar que a usa.

### A "ponte" entre Jekyll e JS: `data-*`, não `<script>` inline

Sempre que uma feature precisa de um dado que só existe em tempo de build
(slug de um post, ID de formulário, nível de segurança do currículo), esse
dado é escrito como atributo `data-*` num elemento HTML já existente, e o
arquivo `.js` correspondente lê esse atributo quando roda. Exemplos:

```html
<!-- likes.html escreve o dado: -->
<button id="like-btn" data-post-slug="{{ page.slug }}">

<!-- features/likes-widget.js lê o dado: -->
var slug = likeBtnPost.getAttribute('data-post-slug');
```

**Por que não simplesmente chamar uma função com o dado, tipo
`AMSite.likes.iniciar({{ page.slug | jsonify }})`?** Porque todo script
externo carrega com `defer` — ele só *executa* depois que a página inteira
terminou de carregar, mesmo que aaparência dele no HTML seja mais acima.
Um `<script>` **inline** (sem `src`), por outro lado, roda **na hora**, no
exato ponto em que o navegador o encontra — o que seria *antes* do arquivo
`defer` correspondente sequer ter rodado. Ler os dados do próprio DOM (via
`data-*`) em vez de receber por chamada de função elimina esse problema de
ordem por completo.

A única exceção de verdade a "todo JS mora em `assets/js/`" é o
script de tema no `<head>` de `_layouts/default.html`: ele decide se a
página nasce clara ou escura, e precisa rodar **antes** do CSS pintar a
tela — um arquivo com `defer` chegaria tarde demais e a página piscaria
branca por um instante. Está comentado no próprio arquivo.

### Duplicação de carregamento proposital (só uma, e documentada)

`/contato/cartao/` carrega `vendor/gerador-visual.js` (a lib do QR code)
uma segunda vez, sem `defer`, além da cópia global (com `defer`) que já
roda em toda página. É proposital: essa página *é* o QR code, então ele
precisa aparecer imediatamente, sem esperar o carregamento adiado. Está
comentado em `assets/js/pages/cartao.js`.

## 5. Onde cada tipo de mudança deve ser feita

| Eu quero... | Eu mexo em... |
|---|---|
| Mudar uma cor/espaçamento do site inteiro | `assets/css/main.css`, seção `TOKENS` |
| Mudar o estilo de UM componente específico | `main.css`, seção daquele componente |
| Adicionar um sistema novo no portfólio | criar `_sistemas/novo-slug.md` (nunca em `portfolio/index.html`) |
| Mudar o namespace do CounterAPI | `_config.yml` → `counterapi_namespace` |
| Mudar o comportamento de "curtir" (post, comentário ou portfólio) | `assets/js/core/counter-api.js` |
| Mudar como as citações/cards de LinkedIn são desenhados | `assets/js/core/canvas-utils.js` |
| Adicionar uma feature nova que aparece em várias páginas | novo arquivo em `assets/js/features/`, incluído em `_includes/scripts.html` |
| Adicionar lógica só de uma página nova | novo arquivo em `assets/js/pages/`, `<script src="...">` só naquela página |
| Aprovar um comentário | `README-COMENTARIOS.md` |

## 6. O que a auditoria técnica pediu e o que foi feito

Todos os itens da auditoria (`auditoria-site-alanmateus.md`) foram
aplicados: BOM removido, `staticman.yml` removido, bug de tags órfãs em
`post.html` corrigido, `<time>` semântico na data do post,
`related-posts.html` considerando todas as categorias (não só a primeira),
duplicação de dados do portfólio eliminada (agora vem de `site.sistemas`),
`sistema.html` estendendo `default.html` (corrigindo o dark mode ausente),
namespace do CounterAPI centralizado, `roundRect`/`wrapText` unificados,
script duplicado do currículo removido, `editor_components` morto removido
do `admin/config.yml`, `onclick` trocado por `addEventListener`, todos os
links internos padronizados pra `relative_url`, e o README de comentários
documentando `parent` e `author`. O único item deixado como está (por
decisão de arquitetura, documentada) é o radar de skills do currículo
continuar consultando a API do GitHub ao vivo em vez de dados pré-gerados
em build time — mover isso exigiria uma GitHub Action nova, o que é uma
mudança de infraestrutura maior e fica de fora do escopo desta limpeza.
