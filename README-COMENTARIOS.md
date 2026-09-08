# Como aprovar e publicar um comentário

Quando alguém comenta, você recebe um e-mail do Formspree com nome, e-mail,
mensagem e o "post_slug" do post. Pra publicar:

1. Vá em `_data/comments/` no repositório.
2. Se ainda não existe uma pasta com o slug do post (ex: `_data/comments/por-que-este-blog-existe/`),
   crie uma.
3. Dentro dela, crie um arquivo `.yml` novo (nome livre, ex: `001.yml`) com este conteúdo:

```yaml
name: "Nome da pessoa"
date: "2026-08-31"
message: "O texto do comentário aqui."
```

4. Commit e push. O GitHub Pages recompila e o comentário aparece no post.

Pra rejeitar um comentário: simplesmente não faz nada, o e-mail fica só na sua caixa de entrada.

## Resposta em thread (comentário respondendo outro)

Quando alguém usa o botão "Responder" no site, o e-mail que você recebe do
Formspree já vem com o campo `parent` preenchido (o id do comentário-pai).
Copie esse id pro campo `parent` do `.yml` da resposta:

```yaml
name: "Nome de quem respondeu"
date: "2026-09-02"
message: "O texto da resposta aqui."
parent: "001"
```

O valor de `parent` é o **nome do arquivo** (sem `.yml`) do comentário original
que está sendo respondido — não o nome da pessoa.

## Selo de "Autor" (quando você mesmo comenta)

Pra marcar um comentário seu com o selo "Autor" ao lado do nome, adicione
`author: true`:

```yaml
name: "Alan Mateus"
date: "2026-09-02"
message: "Resposta minha aqui."
author: true
parent: "001"
```

`author` e `parent` são independentes — um comentário pode ter só um dos
dois, os dois juntos, ou nenhum.
