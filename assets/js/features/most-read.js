/**
 * === features/most-read.js ===
 * Monta a lista "Mais lidos" (`#most-read`) na página do blog, consultando
 * a contagem de visualizações de cada post no CounterAPI e ordenando pelas
 * 3 maiores. Só aparece se pelo menos um post tiver mais de 1 visualização
 * (evita mostrar "mais lidos" quando ninguém leu nada ainda).
 */
(function () {
  var itens = document.querySelectorAll('.blog-post-item[data-slug]');
  var container = document.getElementById('most-read');
  var lista = document.getElementById('most-read-list');
  if (!itens.length || !container || !lista) return;

  var leituras = [];

  Promise.all(Array.from(itens).map(function (item) {
    var slug = item.getAttribute('data-slug');
    return AMSite.counter.lerContador('view', slug)
      .then(function (data) {
        var titulo = item.querySelector('.blog-post-item__title a');
        if (titulo && data.value) {
          leituras.push({ titulo: titulo.textContent, url: titulo.getAttribute('href'), views: data.value });
        }
      })
      .catch(function () {});
  })).then(function () {
    leituras.sort(function (a, b) { return b.views - a.views; });
    var top = leituras.slice(0, 3).filter(function (p) { return p.views > 1; });
    if (!top.length) return;
    top.forEach(function (p) {
      var a = document.createElement('a');
      a.href = p.url;
      a.className = 'most-read__item';
      a.textContent = p.titulo;
      lista.appendChild(a);
    });
    container.hidden = false;
  });
})();
