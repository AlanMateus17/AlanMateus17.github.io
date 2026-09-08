/**
 * === features/view-counter.js ===
 * Incrementa e exibe o contador de visualizações do post (`#post-view-count`).
 * Diferente da curtida, a visualização soma sozinha a cada carregamento —
 * não precisa de clique nem de checagem de "já visualizou antes".
 */
(function () {
  var el = document.getElementById('post-view-count');
  if (!el) return;
  var slug = el.getAttribute('data-slug');

  AMSite.counter.incrementarContador('view', slug)
    .then(function (data) {
      var n = data.value || 1;
      el.textContent = n + (n === 1 ? ' visualização' : ' visualizações');
    })
    .catch(function () {
      el.textContent = '';
    });
})();
