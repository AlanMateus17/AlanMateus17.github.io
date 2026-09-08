/*
 * features/toc.js — monta automaticamente um sumário ("Neste post")
 * a partir dos títulos (<h2> e <h3>) de um post, e só mostra esse
 * sumário se o post tiver pelo menos 3 títulos (post curto não precisa).
 */
(function () {
  var body = document.querySelector('.post-body');
  var toc = document.getElementById('post-toc');
  var list = document.getElementById('post-toc-list');
  if (!body || !toc || !list) return;

  var headings = body.querySelectorAll('h2, h3');
  if (headings.length < 3) return;

  headings.forEach(function (h) {
    // Cada título precisa de um "id" único pra poder ser linkado (#id).
    // Se o título ainda não tiver um, criamos um a partir do próprio texto.
    if (!h.id) {
      h.id = h.textContent.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove acentos
        .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    var li = document.createElement('li');
    li.className = h.tagName === 'H3' ? 'toc__item toc__item--sub' : 'toc__item';
    var a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent;
    li.appendChild(a);
    list.appendChild(li);
  });

  toc.hidden = false;
})();
