/*
 * features/post-status.js — mostra os selinhos "Você já leu este post"
 * e "Você já curtiu este post" no topo do artigo, e registra a visita
 * no histórico de leitura (usado também pelo study-guide.js pra saber
 * qual é o "próximo post não lido").
 *
 * O slug do post vem no atributo data-slug do próprio hero do post
 * (veja _layouts/post.html).
 */
(function () {
  var hero = document.querySelector('.post-hero[data-slug]');
  if (!hero) return;

  var slug = hero.dataset.slug;
  var chaveHistorico = 'posts-lidos';
  var historico = JSON.parse(localStorage.getItem(chaveHistorico) || '[]');

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
    localStorage.setItem(chaveHistorico, JSON.stringify(historico));
  }

  // --- Contador de visualizações (incrementa a cada visita, sem exigir clique) ---
  var contadorEl = document.getElementById('post-view-count');
  if (contadorEl) {
    window.AMCounter.incrementViewCount(slug)
      .then(function (n) {
        contadorEl.textContent = n + (n === 1 ? ' visualização' : ' visualizações');
      })
      .catch(function () { contadorEl.textContent = ''; });
  }
})();
