/**
 * === pages/cartao.js ===
 * Lógica exclusiva do cartão de contato digital (/contato/cartao/).
 *
 * Nota sobre carregamento: diferente das outras páginas em `pages/`, este
 * arquivo NÃO usa `defer` — precisa que o QR code apareça imediatamente,
 * sem esperar a página inteira terminar de carregar (senão a pessoa vê a
 * caixa vazia por um instante). Por isso `contato/cartao/index.html` carrega
 * `vendor/gerador-visual.js` de novo aqui, mesmo esse arquivo já sendo
 * carregado globalmente (com defer) por `global-story-share.html`. É uma
 * duplicação pequena e proposital — a alternativa seria a pessoa ver o
 * cartão em branco por um instante, o que é pior nesta página específica
 * (cujo conteúdo inteiro É o QR code).
 */
(function () {
  var vcard = 'BEGIN:VCARD\nVERSION:3.0\nN:Mateus;Alan;;;\nFN:Alan Mateus\nORG:Grupo AMtech Digital\nTITLE:Professor de Informática & Desenvolvedor\nTEL;TYPE=CELL:+5532984138614\nURL:https://alanmateus17.github.io\nADR:;;Barbacena;MG;;;Brasil\nEND:VCARD';

  new QRCode(document.getElementById('vcard-qr'), {
    text: vcard,
    width: 260,
    height: 260,
    correctLevel: QRCode.CorrectLevel.M
  });

  // Detecta se quem está vendo a página está num celular/tablet (toque como entrada principal).
  // Nesse caso, o QR code não faz sentido (a pessoa não vai escanear a própria tela),
  // então damos destaque ao botão de download direto.
  var ehTelaDeToque = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

  if (ehTelaDeToque) {
    document.getElementById('cartao-dica-mobile').classList.add('display-block');
    document.getElementById('cartao-instrucao').textContent = 'Toque no botão abaixo pra salvar o contato direto na sua agenda.';
    document.getElementById('cartao-legenda-qr').classList.add('hidden-js');

    document.getElementById('cartao-qr-link').classList.add('cartao-qr-link--discreto');
    document.getElementById('cartao-btn-principal').classList.add('cartao-btn--destaque');
  }
})();
