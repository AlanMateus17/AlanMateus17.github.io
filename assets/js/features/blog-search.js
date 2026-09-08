/*
 * features/blog-search.js — campo de busca da listagem do blog.
 * Filtra os cards de post que já estão na página (não busca no servidor;
 * cada card tem um atributo data-search com o texto pesquisável).
 */
(function () {
  var input = document.getElementById('blog-search-input');
  if (!input) return;
  var items = document.querySelectorAll('.blog-post-item[data-search]');
  var vazio = document.getElementById('blog-search-empty');

  input.addEventListener('input', function () {
    var termo = input.value.trim().toLowerCase();
    var visiveis = 0;
    items.forEach(function (item) {
      var bate = !termo || item.getAttribute('data-search').includes(termo);
      item.style.display = bate ? '' : 'none';
      if (bate) visiveis++;
    });
    if (vazio) vazio.hidden = visiveis > 0;
  });
})();
