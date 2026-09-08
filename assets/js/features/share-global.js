/*
 * features/share-global.js — botão flutuante que aparece em TODA página
 * (não só posts) e gera uma imagem vertical (1080×1920, formato Story
 * de Instagram/WhatsApp) com uma captura da página + QR code de volta
 * pro site.
 *
 * Depende de:
 *   - core/canvas-share.js (roundRect, baixarOuCompartilhar)
 *   - html2canvas (script externo, carregado em _includes/scripts.html)
 *   - vendor/qrcode.min.js (biblioteca de QR code)
 */
(function () {
  var btn = document.getElementById('page-share-story-btn');
  if (!btn) return;
  var overlay = document.getElementById('page-share-overlay');
  var overlayText = document.getElementById('page-share-overlay-text');
  var S = window.AMCanvasShare;

  btn.addEventListener('click', function () {
    if (typeof html2canvas === 'undefined' || typeof QRCode === 'undefined') {
      alert('Ainda carregando os recursos necessários — espera 2 segundos e tenta de novo.');
      return;
    }
    overlay.hidden = false;
    overlayText.textContent = 'Gerando sua imagem...';
    var getCopiado = S.copiarLinkAtual();

    // Funciona em qualquer tipo de página: post, página interna (page-hero) ou a Home (hero)
    var alvo = document.querySelector('.post-hero') ||
               document.querySelector('.page-hero') ||
               document.querySelector('.hero') ||
               document.querySelector('main');

    html2canvas(alvo, { backgroundColor: '#0E2E38', scale: 2, useCORS: true }).then(function (captura) {
      var W = 1080, H = 1920;
      var canvas = document.createElement('canvas');
      canvas.width = W; canvas.height = H;
      var ctx = canvas.getContext('2d');

      var grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#0E2E38');
      grad.addColorStop(1, '#0A161C');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#00C2A8';
      ctx.fillRect(0, 0, W, 14);
      ctx.fillRect(0, H - 14, W, 14);

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 34px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Alan Mateus | AMtech Digital', W / 2, 90);

      var phoneW = 780, phoneX = (W - phoneW) / 2, phoneY = 180;
      var escala = phoneW / captura.width;
      var phoneH = Math.min(captura.height * escala, 1180);

      ctx.fillStyle = '#050f14';
      S.roundRect(ctx, phoneX - 14, phoneY - 14, phoneW + 28, phoneH + 28, 46);
      ctx.fill();
      ctx.save();
      S.roundRect(ctx, phoneX, phoneY, phoneW, phoneH, 32);
      ctx.clip();
      ctx.drawImage(captura, phoneX, phoneY, phoneW, phoneH);
      ctx.restore();

      // O QRCode.js só sabe desenhar dentro de um elemento do DOM, então
      // criamos um <div> temporário fora da tela, geramos o QR nele,
      // "recortamos" a imagem gerada pro nosso canvas, e removemos o <div>.
      var qrContainer = document.createElement('div');
      qrContainer.style.position = 'absolute';
      qrContainer.style.left = '-9999px';
      document.body.appendChild(qrContainer);
      new QRCode(qrContainer, { text: window.location.href, width: 260, height: 260, correctLevel: QRCode.CorrectLevel.H });

      setTimeout(function () {
        var qrEl = qrContainer.querySelector('img') || qrContainer.querySelector('canvas');
        var qrY = phoneY + phoneH + 60;
        ctx.fillStyle = '#fff';
        S.roundRect(ctx, W / 2 - 150, qrY, 300, 300, 16);
        ctx.fill();
        if (qrEl) ctx.drawImage(qrEl, W / 2 - 130, qrY + 20, 260, 260);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 30px sans-serif';
        ctx.fillText('Aponte a câmera pra conhecer', W / 2, qrY + 350);
        document.body.removeChild(qrContainer);

        S.baixarOuCompartilhar(canvas, overlay, overlayText, getCopiado(), 'alanmateus-site.png');
      }, 400);
    }).catch(function () {
      overlay.hidden = true;
      alert('Não deu pra gerar a imagem agora. Tenta de novo em instantes.');
    });
  });
})();
