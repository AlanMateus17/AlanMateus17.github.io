/**
 * === features/filters.js ===
 * Botões de filtro (`.filter-btn`) usados em duas páginas diferentes:
 *  - Portfólio: filtra `.log-entry` por `data-status` (em desenvolvimento / planejado)
 *  - Blog: filtra `.blog-post-item` por `data-categoria`, e mostra um aviso
 *    de "nenhum resultado" (`#blog-filter-empty`) quando o filtro zera a lista
 * O mesmo botão serve pras duas páginas porque cada uma só tem os elementos
 * que lhe dizem respeito — os `querySelectorAll` que não encontram nada
 * simplesmente não fazem nada (listas vazias).
 */
(function () {
  var botoes = document.querySelectorAll('.filter-btn');
  if (!botoes.length) return;

  var itensPortfolio = document.querySelectorAll('.log-entry');
  var itensBlog = document.querySelectorAll('.blog-post-item');
  var avisoVazioBlog = document.getElementById('blog-filter-empty');

  botoes.forEach(function (btn) {
    btn.addEventListener('click', function () {
      botoes.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filtro = btn.dataset.filter;
      var visiveis = 0;

      itensPortfolio.forEach(function (card) {
        var bate = filtro === 'all' || card.dataset.status === filtro;
        card.style.display = bate ? '' : 'none';
      });

      itensBlog.forEach(function (card) {
        var bate = filtro === 'all' || card.dataset.categoria === filtro;
        card.style.display = bate ? '' : 'none';
        if (bate) visiveis++;
      });

      if (itensBlog.length && avisoVazioBlog) {
        avisoVazioBlog.hidden = visiveis > 0;
      }
    });
  });
})();
