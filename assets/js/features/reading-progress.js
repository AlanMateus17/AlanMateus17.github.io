/**
 * === features/reading-progress.js ===
 * Barra fina no topo da página (`.reading-progress`) que enche conforme a
 * pessoa rola pelo corpo do post (`.post-body`). Só existe em páginas de post.
 */
(function () {
  var barra = document.querySelector('.reading-progress');
  var corpo = document.querySelector('.post-body');
  if (!barra || !corpo) return;

  function atualizar() {
    var rect = corpo.getBoundingClientRect();
    var total = corpo.offsetHeight - window.innerHeight;
    var lido = Math.max(0, -rect.top);
    barra.style.width = Math.min(100, (lido / total) * 100) + '%';
  }
  window.addEventListener('scroll', atualizar, { passive: true });
  atualizar();
})();
