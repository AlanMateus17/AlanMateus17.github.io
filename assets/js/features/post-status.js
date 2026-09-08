/**
 * === features/post-status.js ===
 * Ao abrir um post:
 *  1) verifica se esse post já foi lido antes (histórico em localStorage)
 *     e se já foi curtido, mostrando os selos correspondentes;
 *  2) se ainda não tinha sido lido, registra no histórico agora — esse
 *     histórico é a base de dados usada por `study-guide.js` (widget
 *     "continue seus estudos") e pela página `/trilha/`.
 *
 * O slug do post vem de `data-post-slug` no próprio container
 * `#post-reading-status` (injetado pelo Jekyll em `_layouts/post.html`).
 */
(function () {
  var container = document.getElementById('post-reading-status');
  if (!container) return;

  var slug = container.getAttribute('data-post-slug');
  var CHAVE_HISTORICO = 'posts-lidos';
  var historico = JSON.parse(localStorage.getItem(CHAVE_HISTORICO) || '[]');

  var jaTinhaLido = historico.indexOf(slug) !== -1;
  var jaCurtiu = !!localStorage.getItem('liked:' + slug);

  if (jaTinhaLido) {
    var badgeLido = document.getElementById('already-read-badge');
    if (badgeLido) badgeLido.hidden = false;
  }
  if (jaCurtiu) {
    var badgeCurtido = document.getElementById('already-liked-badge');
    if (badgeCurtido) badgeCurtido.hidden = false;
  }

  if (!jaTinhaLido) {
    historico.push(slug);
    localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(historico));
  }
})();
