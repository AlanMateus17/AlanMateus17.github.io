/**
 * === features/filters.js ===
 * Botões de filtro (`.filter-btn`) usados em três páginas diferentes:
 *  - Portfólio (`#portfolio-lista`): filtra `.log-entry` por `data-status`
 *    (em desenvolvimento / planejado)
 *  - Ensino (`#materias-lista`): filtra `.log-entry` por `data-curso`
 *    (qual curso técnico aquela matéria pertence)
 *  - Blog: filtra `.blog-post-item` por `data-categoria`, e mostra um aviso
 *    de "nenhum resultado" (`#blog-filter-empty`) quando o filtro zera a lista
 *
 * Portfólio e Ensino reaproveitam a mesma classe visual `.log-entry` (é o
 * mesmo componente de "linha de log"), então cada busca é escopada pelo
 * container da própria página (`#portfolio-lista`, `#materias-lista`) —
 * sem isso, filtrar o portfólio também esconderia as matérias do ensino
 * (e vice-versa), já que os elementos têm a mesma classe.
 */
(function () {
  var botoes = document.querySelectorAll('.filter-btn');
  if (!botoes.length) return;

  var itensPortfolio = document.querySelectorAll('#portfolio-lista .log-entry');
  var itensEnsino = document.querySelectorAll('#materias-lista .log-entry');
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

      itensEnsino.forEach(function (card) {
        var bate = filtro === 'all' || card.dataset.curso === filtro;
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
