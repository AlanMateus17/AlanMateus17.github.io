/*
 * features/filters.js — os botões de filtro (".filter-btn") aparecem em
 * duas páginas diferentes: o Portfólio (filtra por "Em desenvolvimento"
 * / "Planejado") e o Blog (filtra por categoria). É o MESMO botão e a
 * mesma classe CSS nas duas páginas — só o alvo filtrado muda, e o
 * código abaixo já verifica quais elementos existem na página atual
 * antes de tentar filtrar.
 */
(function () {
  var btns = document.querySelectorAll('.filter-btn');
  if (!btns.length) return;

  var logEntries = document.querySelectorAll('.log-entry');       // cards do Portfólio
  var blogPosts = document.querySelectorAll('.blog-post-item');   // cards do Blog
  var vazioFiltro = document.getElementById('blog-filter-empty'); // aviso de "nenhum resultado" no Blog

  btns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      btns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.dataset.filter;
      var visiveis = 0;

      logEntries.forEach(function (card) {
        var match = filter === 'all' || card.dataset.status === filter;
        card.style.display = match ? '' : 'none';
      });

      blogPosts.forEach(function (card) {
        var match = filter === 'all' || card.dataset.categoria === filter;
        card.style.display = match ? '' : 'none';
        if (match) visiveis++;
      });

      if (blogPosts.length && vazioFiltro) {
        vazioFiltro.hidden = visiveis > 0;
      }
    });
  });
})();
