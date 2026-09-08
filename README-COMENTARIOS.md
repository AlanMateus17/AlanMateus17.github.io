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

## Resposta em thread (opcional)

Se quiser que o comentário apareça como uma RESPOSTA a outro comentário já
publicado (em vez de um comentário novo, solto), adicione o campo `parent`
com o nome do arquivo do comentário respondido (sem a extensão `.yml`):

```yaml
name: "Nome da pessoa"
date: "2026-08-31"
message: "O texto da resposta aqui."
parent: "001"
```

## Marcar um comentário como seu (opcional)

Se você mesmo estiver respondendo (não um visitante), adicione `author: true`
pra aparecer o selo "Autor" ao lado do seu nome:

```yaml
name: "Alan Mateus"
date: "2026-08-31"
message: "Sua resposta aqui."
parent: "001"
author: true
```

