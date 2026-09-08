/**
 * === features/likes-widget.js ===
 * Liga os botões de "curtir" do site ao módulo compartilhado
 * `AMSite.counter` (core/counter-api.js). Cobre dois casos:
 *
 *  1) Curtida de um post inteiro — botão único `#like-btn`
 *     (renderizado por `_includes/likes.html`). A chave usada é o slug
 *     do post, injetado no HTML via `data-post-slug` no próprio botão
 *     (é a única parte que precisa vir do Jekyll em tempo de build).
 *
 *  2) Curtida de cada card de sistema no portfólio — vários botões
 *     `.project-like-btn`, cada um com sua própria `data-like-key`.
 *
 * Antes, essa mesma lógica de "buscar contagem, marcar se já curtiu,
 * incrementar ao clicar" estava copiada 3 vezes (aqui, em comments.html
 * e em main.js). Agora mora só em `core/counter-api.js`.
 */
(function () {
  // 1) Curtida do post
  var likeBtnPost = document.getElementById('like-btn');
  if (likeBtnPost) {
    var slug = likeBtnPost.getAttribute('data-post-slug');
    var countEl = document.getElementById('like-count');
    AMSite.counter.ligarBotaoCurtir(likeBtnPost, countEl, slug);
  }

  // 2) Curtidas dos cards do portfólio
  document.querySelectorAll('.project-like-btn').forEach(function (btn) {
    var key = btn.getAttribute('data-like-key');
    var countEl = btn.querySelector('.project-like-btn__count');
    AMSite.counter.ligarBotaoCurtir(btn, countEl, key);
  });
})();
