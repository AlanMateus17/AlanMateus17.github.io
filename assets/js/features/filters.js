/*
 * features/filters.js — os botões de filtro (".filter-btn") aparecem em
 * três páginas diferentes: o Portfólio (filtra por "Em desenvolvimento"
 * / "Planejado"), o Ensino (filtra por curso) e o Blog (filtra por
 * categoria). É o MESMO botão e a mesma classe CSS nas três páginas —
 * só o valor filtrado muda. Por isso todo card ".log-entry" (não importa
 * a página) usa o mesmo atributo "data-category" pra ser filtrado — o
 * Portfólio bota "dev"/"plan" nele, o Ensino bota o id do curso. Assim
 * este arquivo não precisa saber em qual página está.
 */
(function () {
  var btns = document.querySelectorAll('.filter-btn');
  if (!btns.length) return;

  var logEntries = document.querySelectorAll('.log-entry');       // cards do Portfólio e do Ensino
  var blogPosts = document.querySelectorAll('.blog-post-item');   // cards do Blog
  var vazioFiltro = document.getElementById('blog-filter-empty'); // aviso de "nenhum resultado" no Blog

  btns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      btns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.dataset.filter;
      var visiveis = 0;

      logEntries.forEach(function (card) {
        var match = filter === 'all' || card.dataset.category === filter;
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
