/**
 * === features/blog-search.js ===
 * Campo de busca da listagem do blog (`#blog-search-input`). Filtra os
 * posts (`.blog-post-item`) comparando o termo digitado com o atributo
 * `data-search` de cada card (gerado no Jekyll com título + resumo em
 * minúsculo, pra busca não sensível a maiúscula/minúscula).
 */
(function () {
  var input = document.getElementById('blog-search-input');
  if (!input) return;
  var itens = document.querySelectorAll('.blog-post-item[data-search]');
  var vazio = document.getElementById('blog-search-empty');

  input.addEventListener('input', function () {
    var termo = input.value.trim().toLowerCase();
    var visiveis = 0;
    itens.forEach(function (item) {
      var bate = !termo || item.getAttribute('data-search').includes(termo);
      item.style.display = bate ? '' : 'none';
      if (bate) visiveis++;
    });
    vazio.hidden = visiveis > 0;
  });
})();
