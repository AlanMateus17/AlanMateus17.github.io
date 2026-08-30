# Alan Mateus — Site Pessoal

## Como subir no GitHub Pages (5 passos)

### Passo 1 — Criar o repositório
Acesse github.com → Novo repositório → Nome: `AlanMateus17.github.io`
(substitua AlanMateus17 pelo seu usuário real do GitHub)
Marque "Public" → Create repository

### Passo 2 — Subir os arquivos
No PowerShell, dentro da pasta extraída:
```powershell
git init
git add .
git commit -m "feat: site inicial"
git branch -M main
git remote add origin https://github.com/AlanMateus17/AlanMateus17.github.io.git
git push -u origin main
```

### Passo 3 — Ativar o GitHub Pages
No repositório → Settings → Pages → Source: "Deploy from a branch"
Branch: main / (root) → Save

O site vai ao ar em até 2 minutos em: https://AlanMateus17.github.io

### Passo 4 — Configurar o formulário de contato
Acesse formspree.io → crie conta grátis → novo formulário
Copie o ID gerado e substitua "SEU_ID_FORMSPREE" em `contato/index.html`

### Passo 5 — Configurar o CMS (publicar sem tocar no código)
Acesse github.com/settings/apps → New GitHub App (para o Decap CMS funcionar)
Ou: publique posts diretamente pelo GitHub.com editando a pasta `_posts/`

## Como publicar um novo post (sem código)

### Opção A — Pelo GitHub.com (mais simples)
1. Vá em github.com/AlanMateus17/AlanMateus17.github.io
2. Clique em `_posts/` → Add file → Create new file
3. Nome do arquivo: `2026-09-15-titulo-do-post.md`
4. Cole o template abaixo e escreva em Markdown
5. Commit changes → o post aparece em ~1 minuto

**Template de post:**
```markdown
---
layout: post
title: "Título do post"
date: 2026-09-15
categories: [desenvolvimento]
tags: [dotnet, postgresql]
excerpt: "Resumo de 1-2 linhas que aparece na listagem."
---

Conteúdo do post em Markdown aqui.
```

### Opção B — Pelo CMS visual
Acesse: https://AlanMateus17.github.io/admin/
Faça login com GitHub → escreva como num editor de texto → Publish

## Atualizar o "Status agora" (widget do hero)
Edite o arquivo `_config.yml` → seção `status_now` → commit
Aparece automaticamente no site em ~1 minuto

## Adicionar apostilas para download
1. Coloque os PDFs em `assets/apostilas/`
2. Edite `ensino/index.html` para adicionar o link de download
3. Commit → aparece no ar

## Domínio personalizado (opcional)
Compre `amtechdigital.com.br` no Registro.br (~R$40/ano)
Em Settings → Pages → Custom domain → digite o domínio
Adicione o arquivo `CNAME` na raiz com o conteúdo: `amtechdigital.com.br`
