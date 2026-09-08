/**
 * === features/toc.js ===
 * Gera automaticamente o sumário ("Neste post") de um post, a partir dos
 * títulos `<h2>` e `<h3>` que existem no corpo dele. Só aparece se o post
 * tiver pelo menos 3 títulos — sumário de post curto não ajuda em nada.
 */
(function () {
  var corpo = document.querySelector('.post-body');
  var toc = document.getElementById('post-toc');
  var lista = document.getElementById('post-toc-list');
  if (!corpo || !toc || !lista) return;

  var titulos = corpo.querySelectorAll('h2, h3');
  if (titulos.length < 3) return;

  titulos.forEach(function (h) {
    if (!h.id) {
      // Gera um id "fatiável" (slug) a partir do texto do título, removendo
      // acentos e caracteres especiais, pra poder linkar com #id.
      h.id = h.textContent.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    var li = document.createElement('li');
    li.className = h.tagName === 'H3' ? 'toc__item toc__item--sub' : 'toc__item';
    var a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent;
    li.appendChild(a);
    lista.appendChild(li);
  });

  toc.hidden = false;
})();
