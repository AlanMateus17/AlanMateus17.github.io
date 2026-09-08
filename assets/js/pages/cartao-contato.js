/*
 * pages/cartao-contato.js — lógica da página /contato/cartao/:
 * gera um QR code que, ao ser escaneado, salva o contato direto na
 * agenda de quem escaneou (formato vCard), e adapta a página quando
 * quem está vendo já está no próprio celular (nesse caso, escanear a
 * própria tela não faz sentido — damos destaque ao botão de download).
 *
 * Os dados do contato (nome, telefone, site) vêm de atributos data-*
 * no elemento #vcard-qr, preenchidos com Liquid a partir de
 * _config.yml — assim o número de telefone, por exemplo, só existe
 * escrito num lugar do projeto inteiro.
 */
(function () {
  var qrEl = document.getElementById('vcard-qr');
  if (!qrEl) return;

  var d = qrEl.dataset;
  var vcard = 'BEGIN:VCARD\nVERSION:3.0\n' +
    'N:' + d.vcardNome + ';;;;\n' +
    'FN:' + d.vcardNome + '\n' +
    'ORG:' + d.vcardOrg + '\n' +
    'TITLE:' + d.vcardCargo + '\n' +
    'TEL;TYPE=CELL:+' + d.vcardTel + '\n' +
    'URL:' + d.vcardUrl + '\n' +
    'ADR:;;' + d.vcardCidade + ';' + d.vcardEstado + ';;;' + d.vcardPais + '\n' +
    'END:VCARD';

  window.addEventListener('load', function () {
    if (typeof QRCode === 'undefined') return;
    new QRCode(qrEl, {
      text: vcard,
      width: 260,
      height: 260,
      correctLevel: QRCode.CorrectLevel.M
    });
  });

  // Detecta se quem está vendo a página está num celular/tablet (toque como
  // entrada principal). Nesse caso, o QR code não faz sentido (a pessoa não
  // vai escanear a própria tela), então damos destaque ao botão de download.
  var ehTelaDeToque = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

  if (ehTelaDeToque) {
    document.getElementById('cartao-dica-mobile').hidden = false;
    document.getElementById('cartao-instrucao').textContent = 'Toque no botão abaixo pra salvar o contato direto na sua agenda.';
    document.getElementById('cartao-legenda-qr').hidden = true;
    document.getElementById('cartao-qr-link').classList.add('cartao-qr-link--recuado');
    document.getElementById('cartao-btn-principal').classList.add('cartao-btn-principal--grande');
  }
})();
