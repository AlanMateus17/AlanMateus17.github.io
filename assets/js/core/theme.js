/*
 * core/theme.js — botão de alternar entre modo claro e escuro.
 *
 * Como funciona o tema neste site (duas partes, em dois momentos diferentes):
 *
 * 1) ANTES da página desenhar qualquer coisa (evita o "flash" de tema errado):
 *    um script BEM PEQUENO e inline, direto no <head> de cada layout,
 *    lê o localStorage e já aplica data-theme="dark" no <html> se precisar.
 *    Esse script continua inline de propósito — se ele fosse um arquivo
 *    externo, o navegador ia desenhar a página no tema claro por uma fração
 *    de segundo antes do arquivo carregar, e o usuário veria um "pisca".
 *    Procure por esse trecho em _layouts/default.html e _layouts/sistema.html.
 *
 * 2) DEPOIS que a página carregou: este arquivo aqui. Ele só cuida do botão
 *    (ícone sol/lua) e do que acontece quando alguém CLICA para trocar de tema.
 */
(function () {
  var btn = document.getElementById('theme-toggle');
  if (!btn) return; // página sem botão de tema (não deveria acontecer, mas não quebra nada)

  var sunIcon = btn.querySelector('.theme-toggle__sun');
  var moonIcon = btn.querySelector('.theme-toggle__moon');

  // Mostra o ícone certo (sol no modo claro, lua no modo escuro)
  function atualizarIcones() {
    var escuro = document.documentElement.getAttribute('data-theme') === 'dark';
    sunIcon.hidden = escuro;
    moonIcon.hidden = !escuro;
  }
  atualizarIcones(); // já ajusta o ícone certo assim que a página carrega

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
