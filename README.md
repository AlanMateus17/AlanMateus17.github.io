# Alan Mateus — site pessoal (v2)

Portfólio, blog e materiais de ensino de Alan Mateus, com a identidade visual da
**Grupo AMtech Digital** (Aura Design System, tema escuro por padrão e tema claro no botão).

- **Base:** template [Magic UI Portfolio](https://github.com/dillionverma/portfolio) (MIT), adaptado.
- **Stack:** Next.js 16 (export estático) · TypeScript · Tailwind CSS 4 · Motion.
- **Hospedagem:** GitHub Pages, publicado pelo GitHub Actions (`.github/workflows/deploy.yml`).
- **Endereços:** os mesmos do site antigo em Jekyll (`/blog/2026/08/30/...`, `/portfolio/kaixara/` …).

## Ativar a publicação (uma vez só)

1. Junte esta branch na `main` (Pull Request → Merge).
2. No repositório: **Settings → Pages → Build and deployment → Source: “GitHub Actions”**.
3. Pronto: a cada push na `main`, o Actions gera o site e publica (1–2 min). Acompanhe em **Actions**.

Enquanto a fonte do Pages continuar em “Deploy from a branch”, o site antigo continua no ar.

## Onde fica cada coisa

```
content/                 ← TODO o conteúdo do site (é aqui que você mexe no dia a dia)
├── site.yml             ← nome, links, status "agora", IDs do Formspree/CounterAPI/MailerLite
├── curriculo.yml        ← dados da página /curriculo/
├── ensino.yml           ← cursos e matérias da página /ensino/
├── posts/               ← posts do blog (AAAA-MM-DD-slug.md, mesmo formato do Jekyll)
├── sistemas/            ← os 13 sistemas do portfólio (um .md por sistema)
├── produtos/            ← itens da /loja/
├── depoimentos/         ← depoimentos
└── comments/<slug>/     ← comentários aprovados (veja README-COMENTARIOS.md)

public/                  ← arquivos servidos como estão (ícones, imagens, vCard, manifest,
                           service worker, security.txt, editor /admin/)

src/
├── app/                 ← uma pasta por página (ex.: src/app/servicos/page.tsx = /servicos/)
├── components/
│   ├── magicui/         ← componentes do template (dock, blur-fade) + partículas e título "decodificando"
│   ├── site/            ← cabeçalho, rodapé, dock do celular, paleta ⌘K, hero das páginas
│   └── features/        ← curtidas, comentários, quiz, trilha, compartilhar, terminal, etc.
├── lib/                 ← leitura do conteúdo, Markdown, utilidades
└── app/globals.css      ← tokens de cor da Aura (escuro e claro) e estilos base
```

## Tarefas comuns

| Quero…                               | Onde                                                          |
| ------------------------------------ | ------------------------------------------------------------- |
| Atualizar o “status --agora” da Home | `content/site.yml` → `status_now`                             |
| Escrever um post                     | novo arquivo em `content/posts/` (ou pelo editor em `/admin/`) |
| Mudar status/stack de um sistema     | `content/sistemas/<sistema>.md`                               |
| Ativar o formulário de orçamento     | crie o form no Formspree e cole o ID em `formspree_orcamento_id` |
| Ativar o aviso de quiz concluído     | idem, em `formspree_quiz_id`                                  |
| Ativar o analytics                   | conta no GoatCounter → `goatcounter_username`                 |
| Mudar uma cor da marca               | `src/app/globals.css` (bloco de tokens no topo)               |

Template de post:

```markdown
---
title: "Título do post"
date: 2026-09-15
categories: [desenvolvimento]   # desenvolvimento | ensino | seguranca | carreira
tags: [dotnet, kaixara]         # a tag "kaixara" liga o post à página do AM Kaixara
excerpt: "Resumo de 1-2 linhas que aparece na listagem."
---

Conteúdo em Markdown.
```

## Rodar no seu computador

```bash
npm install
npm run dev      # http://localhost:3000, recarrega ao salvar
npm run build    # gera a pasta out/ (o mesmo que o GitHub Actions publica)
```

Requer Node.js 20.9 ou mais novo.

## Serviços externos que continuam em uso

Formspree (comentários, contato, orçamento, quiz), CounterAPI (curtidas e
visualizações), MailerLite (newsletter), API pública do GitHub (atividade e
radar do currículo) e Decap CMS (editor em `/admin/`). As fontes agora são
servidas pelo próprio site, sem Google Fonts.
