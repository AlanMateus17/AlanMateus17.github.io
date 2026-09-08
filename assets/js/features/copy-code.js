/*
 * features/copy-code.js — adiciona um botão "Copiar" em todo bloco de
 * código (<pre>) do conteúdo dos posts, pra quem estiver lendo poder
 * copiar o código sem precisar selecionar o texto manualmente.
 */
(function () {
  document.querySelectorAll('pre').forEach(function (pre) {
    var btn = document.createElement('button');
    btn.textContent = 'Copiar';
    btn.className = 'copy-code-btn';
    pre.style.position = 'relative';
    pre.appendChild(btn);

    btn.addEventListener('click', function () {
      var code = pre.querySelector('code');
      navigator.clipboard.writeText(code ? code.textContent : pre.textContent).then(function () {
        btn.textContent = 'Copiado!';
        btn.classList.add('copy-code-btn--copiado');
        setTimeout(function () {
          btn.textContent = 'Copiar';
          btn.classList.remove('copy-code-btn--copiado');
        }, 1800);
      });
    });
  });
})();
