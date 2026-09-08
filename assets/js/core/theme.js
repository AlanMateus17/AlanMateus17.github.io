/**
 * === core/theme.js ===
 * Botão de alternar claro/escuro (#theme-toggle, no nav).
 *
 * A DECISÃO de qual tema mostrar ao carregar a página é feita por um
 * pequeno script inline no <head> de `_layouts/default.html` (precisa
 * rodar antes do CSS pintar, pra não piscar). Este arquivo só cuida da
 * AÇÃO de trocar de tema quando a pessoa clica no botão.
 */
(function () {
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;

  var sunIcon = btn.querySelector('.theme-toggle__sun');
  var moonIcon = btn.querySelector('.theme-toggle__moon');

  function atualizarIcones() {
    var escuro = document.documentElement.getAttribute('data-theme') === 'dark';
    sunIcon.hidden = escuro;
    moonIcon.hidden = !escuro;
  }
  atualizarIcones();

  btn.addEventListener('click', function () {
    var escuroAgora = document.documentElement.getAttribute('data-theme') === 'dark';
    if (escuroAgora) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
    atualizarIcones();
  });
})();
