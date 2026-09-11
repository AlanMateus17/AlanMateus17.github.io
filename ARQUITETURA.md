# Arquitetura do site — guia de manutenção

Este documento existe pra você conseguir dar manutenção no site sozinho.
Ele explica **onde fica cada coisa** e **por quê** está organizado assim.
Para o que cada bloco de código faz especificamente, os comentários estão
dentro dos próprios arquivos (em CSS, JS e HTML) — este arquivo é o mapa
geral, não o detalhe.

## Visão geral

O site é gerado pelo Jekyll: você escreve Markdown/HTML com um pouco de
Liquid (`{{ }}` e `{% %}`), e o Jekyll transforma isso num site estático
(puro HTML/CSS/JS) toda vez que você publica. Não existe backend, nem
banco de dados — os "dados" do site são os próprios arquivos do repositório.

```
site/
├── _config.yml          → configurações gerais (nome, links, IDs de formulário...)
├── _layouts/             → moldes de página (cabeçalho + rodapé + onde o conteúdo entra)
├── _includes/            → pedaços de HTML reaproveitados dentro dos layouts
├── _posts/               → os artigos do blog (um arquivo .md por post)
├── _sistemas/             → os projetos do portfólio (um .md por sistema)
├── _produtos/, _depoimentos/ → outras collections, mesma ideia
├── _data/comments/        → comentários aprovados manualmente (ver README-COMENTARIOS.md)
├── assets/
│   ├── css/main.css      → TODO o CSS do site, num arquivo só
│   └── js/                → TODO o JavaScript do site, organizado (ver abaixo)
└── <pasta>/index.html    → cada pasta na raiz é uma página (ex: /sobre/, /contato/)
```

## Como o CSS está organizado

Tudo em **`assets/css/main.css`**, um arquivo só, dividido em seções com
comentários `/* === NOME DA SEÇÃO === */`. No topo do arquivo fica o
**sistema de tokens** (`:root { --brand: ...; --accent: ...; }`) — cores,
espaçamentos, fontes, sombras, tudo como variável.

**Regra de ouro: nunca escrever `style="cor:vermelho"` direto no HTML.**
Se precisar de um estilo novo, ele vira uma classe no `main.css` (mesmo
que seja usada só numa página) — assim, se um dia você quiser mudar uma
cor ou espaçamento, muda num lugar só, em vez de caçar em 20 arquivos
HTML diferentes. A seção **"CLASSES EXTRAÍDAS DE style="" INLINE"**, no
fim do arquivo, tem várias classes assim, cada uma comentada com o nome
da página de onde veio.

**Exceção intencional:** as cores dos "swatches" no gerador de citação
(`ferramentas/gerador-de-citacao/index.html`) continuam com
`style="background:#0E2E38"` — ali a cor é um DADO (uma opção que a
pessoa escolhe), não uma decisão de estilo, então não faz sentido virar
classe fixa.

## Como o JavaScript está organizado

Tudo dentro de **`assets/js/`**, dividido em quatro pastas:

```
assets/js/
├── site-config.js        → ponte entre _config.yml e o JS (veja abaixo)
├── core/                  → infraestrutura usada por várias features
├── features/               → um arquivo por funcionalidade reaproveitável
├── pages/                 → scripts específicos de UMA página só
└── vendor/                 → bibliotecas de terceiros (não editar por dentro)
```

### `core/` — a base que várias features usam

| Arquivo | O que faz |
|---|---|
| `theme.js` | Botão de modo claro/escuro |
| `navigation.js` | Menu, rolagem da navbar, botão "voltar ao topo" |
| `animations.js` | Efeito typewriter, fade-in ao rolar, barra de progresso de leitura |
| `pwa.js` | Instalar o site como app + Service Worker |
| `counter-widget.js` | Fala com o CounterAPI (curtidas e visualizações) — usado por posts, comentários e portfólio |
| `canvas-share.js` | Funções de desenho compartilhadas pelos 3 geradores de imagem do site |

### `features/` — uma funcionalidade por arquivo

Cada arquivo começa com `if (!elemento) return;` — ou seja, ele só age se
a página atual tiver o elemento que ele procura. Por isso TODOS os
arquivos de `features/` são carregados em TODA página (via
`_includes/scripts.html`), sem problema de desempenho perceptível: os que
não se aplicam simplesmente não fazem nada.

`filters.js`, `toc.js`, `copy-code.js`, `blog-search.js`, `most-read.js`,
`likes-widget.js`, `comments.js`, `quiz.js`, `study-guide.js`,
`share-post.js`, `share-global.js`, `post-status.js`.

### `pages/` — o oposto: código de UMA página só

Diferente de `features/`, estes só são carregados na própria página deles
(um `<script src="...">` no fim do arquivo HTML da página), porque não
fazem sentido em nenhum outro lugar do site: `curriculo.js`,
`cartao-contato.js`, `citation-generator.js`, `trilha.js`, `home.js`,
`servicos.js`, `terminal.js`.

**Regra pra decidir onde um script novo vai:** se ele pode, no futuro,
ser útil em mais de uma página → `features/`. Se é específico de uma
página só → `pages/`.

### `vendor/` — bibliotecas de terceiros

`qrcode.min.js` (gera QR codes) e `mailerlite.js`/`cms-editor-components.js`
(snippets oficiais de serviços externos). **Não edite o conteúdo desses
arquivos** — se precisar trocar de versão, baixe o arquivo novo e
substitua o antigo inteiro.

### `site-config.js` — a ponte com `_config.yml`

Alguns valores (o namespace do CounterAPI, os IDs do Formspree) ficam
configurados no `_config.yml`, não escritos direto no JavaScript — assim
você só precisa trocar num lugar se um dia mudar de serviço. Só que o
navegador não lê `_config.yml` (só o Jekyll lê, no momento do build). O
`site-config.js` resolve isso: é um arquivo `.js` com front matter
Liquid (as três linhas `---` no topo), que o Jekyll processa e "imprime"
esses valores num objeto `window.AM_CONFIG` de JavaScript comum.

### Como uma página passa dado pro JavaScript

Como o JavaScript não entende Liquid, todo dado que varia por página
(o slug de um post, o nome de usuário do GitHub, etc.) é passado através
de **atributos `data-*`** no próprio HTML:

```html
<!-- no HTML (processado pelo Jekyll): -->
<div id="vcard-qr" data-vcard-tel="{{ site.author.whatsapp }}"></div>
```
```js
// no JavaScript (arquivo comum, sem Liquid):
var telefone = document.getElementById('vcard-qr').dataset.vcardTel;
```

Isso mantém os arquivos `.js` 100% reaproveitáveis e sem depender do
Jekyll pra funcionar — são só JavaScript puro.

### Ordem de carregamento (`_includes/scripts.html`)

Um único include, incluído uma vez em `_layouts/default.html`, carrega
TODO o JavaScript do site (menos os scripts de `pages/`, que cada página
carrega por conta própria, no fim do próprio arquivo). A ordem dentro
dele importa — está comentada linha a linha lá dentro.

## Como os layouts se encaixam

```
_layouts/default.html   ← base de tudo: <head>, navegação, rodapé, scripts
        ↑ estendido por
_layouts/post.html       ← usado pelos posts do blog (_posts/*.md)
_layouts/sistema.html    ← usado pelas páginas do portfólio (_sistemas/*.md)
```

`post.html` e `sistema.html` têm `layout: default` no próprio front
matter — isso significa "pegue o `default.html` e coloque o MEU conteúdo
onde está `{{ content }}`". **Nunca copie o `<head>`/navegação/rodapé de
`default.html` pra outro layout** — foi exatamente esse erro que existia
antes (em `sistema.html`) e fez o botão de tema desaparecer nas páginas
do portfólio, porque ninguém lembrou de atualizar a cópia também.

## Portfólio: uma fonte de verdade só

Os 13 sistemas do portfólio (`portfolio/index.html`) são lidos direto da
collection `_sistemas/` — cada sistema é um arquivo `_sistemas/nome.md`
com `name`, `excerpt`, `status`, `stack`, etc. **Pra atualizar um
sistema, edite só o arquivo dele em `_sistemas/`** — a página do
portfólio e a página de detalhe dele (`/portfolio/nome-do-sistema/`) se
atualizam sozinhas, porque as duas leem do mesmo lugar.

## Comentários: fluxo manual

Não existe backend recebendo e publicando comentários automaticamente.
O fluxo é: alguém comenta → você recebe um e-mail (Formspree) → você
aprova criando um arquivo `.yml` em `_data/comments/<slug-do-post>/` →
faz commit e push → o comentário aparece no próximo build. O passo a
passo completo (incluindo como fazer respostas em thread) está em
`README-COMENTARIOS.md`.

## Onde configurar o quê

| Quero mudar... | Onde |
|---|---|
| Nome, WhatsApp, GitHub, LinkedIn, localização | `_config.yml` → `author:` |
| Status "construindo agora" do hero | `_config.yml` → `status_now:` |
| Analytics (GoatCounter) | `_config.yml` → `goatcounter_username` |
| Formulário de comentários / orçamento / quiz | `_config.yml` → `formspree_*` |
| Um sistema do portfólio | `_sistemas/<nome>.md` |
| Uma matéria/curso da página de Ensino | `_data/ensino.yml` |
| Um post do blog | `_posts/AAAA-MM-DD-titulo.md` |
| Uma cor ou espaçamento do site inteiro | `assets/css/main.css` → seção `:root` (tokens) |
| O comportamento de um botão/widget | o arquivo certo em `assets/js/` (veja a tabela acima) |

## Coisas que foram corrigidas nesta reorganização

Pra referência — o que mudou em relação à versão anterior do projeto:

- HTML mal-formado em `_layouts/post.html` (tags fechando sem abrir)
- `_layouts/sistema.html` duplicava o `default.html` inteiro → agora estende
- `portfolio/index.html` tinha a mesma lista de sistemas colada duas vezes,
  e ainda duplicava os dados de `_sistemas/*.md` → agora lê só de lá
- Todo JavaScript que estava espalhado em `<script>` dentro do HTML foi
  extraído pra `assets/js/`, organizado e comentado
- Funções repetidas (`wrapText`, `roundRect`, lógica de curtidas/CounterAPI)
  foram unificadas em `core/canvas-share.js` e `core/counter-widget.js`
- O namespace do CounterAPI, que estava escrito em 5 lugares diferentes,
  agora existe só em `_config.yml`
- `staticman.yml` (configuração não usada) e o bloco `editor_components`
  inválido de `admin/config.yml` foram removidos
- BOM (caractere invisível) removido de 4 arquivos
- ~200 atributos `style=""` inline viraram classes no `main.css`
