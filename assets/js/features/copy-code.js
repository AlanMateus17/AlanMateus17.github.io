/**
 * === features/copy-code.js ===
 * Adiciona um botão "Copiar" no canto de cada bloco de código (<pre>) dos
 * posts do blog. O botão é criado por JS (não existe no HTML do post)
 * porque o Markdown do Jekyll gera o <pre><code> sozinho, sem como incluir
 * um botão dentro dele na hora de escrever o post.
 */
(function () {
  document.querySelectorAll('pre').forEach(function (pre) {
    var btn = document.createElement('button');
    btn.textContent = 'Copiar';
    btn.className = 'copy-code-btn';
    pre.classList.add('pre-with-copy');
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
