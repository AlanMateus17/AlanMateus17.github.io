/*
 * features/most-read.js — widget "Mais lidos" na listagem do blog.
 * Busca a contagem de visualizações (via core/counter-widget.js) de
 * cada post listado, ordena e mostra os 3 mais vistos — só se algum
 * post já tiver mais de 1 visualização (senão não faz sentido destacar).
 */
(function () {
  var items = document.querySelectorAll('.blog-post-item[data-slug]');
  var container = document.getElementById('most-read');
  var list = document.getElementById('most-read-list');
  if (!items.length || !container || !list) return;

  var leituras = [];

  var promessas = Array.from(items).map(function (item) {
    var slug = item.getAttribute('data-slug');
    return window.AMCounter.fetchViewCount(slug)
      .then(function (views) {
        var titulo = item.querySelector('.blog-post-item__title a');
        if (titulo && views) {
          leituras.push({ titulo: titulo.textContent, url: titulo.getAttribute('href'), views: views });
        }
      })
      .catch(function () {});
  });

  Promise.all(promessas).then(function () {
    leituras.sort(function (a, b) { return b.views - a.views; });
    var top = leituras.slice(0, 3).filter(function (p) { return p.views > 1; });
    if (!top.length) return;

    top.forEach(function (p) {
      var a = document.createElement('a');
      a.href = p.url;
      a.className = 'most-read__item';
      a.textContent = p.titulo;
      list.appendChild(a);
    });
    container.hidden = false;
  });
})();
