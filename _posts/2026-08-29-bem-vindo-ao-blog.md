---
layout: post
title: "Bem-vindo ao blog — por que vou construir tudo em público"
date: 2026-08-29
categories: [carreira]
tags: [inicio, plano, aurapos, aprendizado]
excerpt: "Este blog começa agora, antes do primeiro sistema estar em produção. Esse é o ponto — documentar desde o princípio, não quando tiver algo bonito pra mostrar."
---

Este blog começa agora, antes do primeiro sistema estar em produção. Esse é o ponto.

Existe uma tentação real de esperar. Esperar o AuraPOS estar no ar. Esperar ter algo "digno" de publicar. Esperar ter certeza do que falar.

Mas aprendi uma coisa estudando o Akita: o melhor conteúdo técnico nasce da documentação honesta de um problema real, não da retrospectiva polida depois que foi resolvido.

## O que eu estou construindo

O ecossistema **Aura** — 23 sistemas SaaS planejados, começando pelo **AuraPOS**, um ponto de venda multi-tenant com PostgreSQL + Row-Level Security, .NET 10, Clean Architecture e Next.js no frontend.

Cada decisão de arquitetura — por que RLS em vez de `schema per tenant`, por que `Controllers` em vez de Minimal API, como modelar `TenantId` nas entidades de domínio — vai para este blog antes de ir para o código de produção.

## Por que em público

Três razões práticas:

1. **Escrever força clareza.** Se não consigo explicar uma decisão em texto, provavelmente não a entendi direito.
2. **Documentação que sobrevive.** Daqui a dois anos, quando precisar entender por que tomei aquela decisão, o post vai estar aqui.
3. **Ensino é parte do trabalho.** Sou professor de informática. Aprender e documentar não é separado do meu trabalho — é o trabalho.

## O que vem a seguir

O próximo post vai cobrir a estrutura do banco de dados do AuraPOS — o schema inicial, como o RLS funciona na prática e os erros que já cometi na modelagem.

---

Se você chegou aqui por qualquer motivo — bem-vindo. Pode acompanhar pelo [LinkedIn](https://linkedin.com/in/alan-souza-dev).
