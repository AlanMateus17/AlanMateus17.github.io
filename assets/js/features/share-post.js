/*
 * features/share-post.js — botões de compartilhamento de UM post
 * específico (os de WhatsApp e X já são links simples, resolvidos
 * direto no HTML por _includes/share-buttons.html; aqui só ficam os
 * que precisam de JavaScript):
 *
 *   1) Copiar link
 *   2) Gerar um card horizontal (1200×627) pra compartilhar no LinkedIn
 *   3) Selecionar um trecho do texto e gerar uma imagem de citação
 *   4) Baixar/imprimir o post em PDF (usa a função de impressão do
 *      próprio navegador — Ctrl+P — não gera um PDF customizado)
 *
 * Depende de core/canvas-share.js (roundRect, wrapText, etc.) já estar
 * carregado antes, e da biblioteca html2canvas (carregada como script
 * externo em _includes/scripts.html).
 */

// --- Copiar link do post ---
(function () {
  var btn = document.getElementById('share-copy-link');
  if (!btn) return;
  btn.addEventListener('click', function () {
    navigator.clipboard.writeText(btn.getAttribute('data-url')).then(function () {
      var original = btn.textContent;
      btn.textContent = 'Link copiado!';
      setTimeout(function () { btn.textContent = original; }, 1800);
    });
  });
})();

// --- Card pro LinkedIn (imagem horizontal 1200x627) ---
(function () {
  var linkedinBtn = document.getElementById('share-as-linkedin');
  if (!linkedinBtn) return;
  var overlay = document.getElementById('story-generating-overlay');
  var overlayText = document.getElementById('story-overlay-text');
  var S = window.AMCanvasShare;

  linkedinBtn.addEventListener('click', function () {
    if (typeof html2canvas === 'undefined') {
      alert('Ainda carregando os recursos necessários — espera 2 segundos e tenta de novo.');
      return;
    }
    overlay.hidden = false;
    overlayText.textContent = 'Gerando sua imagem...';
    var getCopiado = S.copiarLinkAtual();
    var alvo = document.querySelector('.post-hero') || document.querySelector('main');

    html2canvas(alvo, { backgroundColor: '#0E2E38', scale: 2, useCORS: true }).then(function (captura) {
      var W = 1200, H = 627;
      var canvas = document.createElement('canvas');
      canvas.width = W; canvas.height = H;
      var ctx = canvas.getContext('2d');

      var grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, '#0E2E38');
      grad.addColorStop(1, '#0A161C');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#00C2A8';
      ctx.fillRect(0, 0, W, 10);
      ctx.fillRect(0, H - 10, W, 10);

      // Metade esquerda: texto
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'left';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText('Alan Mateus | AMtech Digital', 60, 70);

      var titulo = document.querySelector('.post-hero__title');
      var tituloTexto = titulo ? titulo.textContent.trim() : document.title;
      ctx.font = 'bold 42px sans-serif';
      var linhas = S.wrapText(ctx, tituloTexto, 480);
      var ty = 160;
      linhas.slice(0, 4).forEach(function (linha) {
        ctx.fillText(linha, 60, ty);
        ty += 52;
      });

      ctx.font = '24px sans-serif';
      ctx.fillStyle = '#00C2A8';
      ctx.fillText('alanmateus17.github.io', 60, H - 60);

      // Metade direita: mockup pequeno da captura da tela
      var boxW = 480, boxH = 480, boxX = W - boxW - 60, boxY = (H - boxH) / 2;
      var escala = Math.min(boxW / captura.width, boxH / captura.height);
      var imgW = captura.width * escala, imgH = captura.height * escala;
      var imgX = boxX + (boxW - imgW) / 2, imgY = boxY + (boxH - imgH) / 2;

      ctx.fillStyle = '#050f14';
      S.roundRect(ctx, boxX - 10, boxY - 10, boxW + 20, boxH + 20, 20);
      ctx.fill();
      ctx.save();
      S.roundRect(ctx, imgX, imgY, imgW, imgH, 14);
      ctx.clip();
      ctx.drawImage(captura, imgX, imgY, imgW, imgH);
      ctx.restore();

      S.baixarOuCompartilhar(canvas, overlay, overlayText, getCopiado(), 'linkedin-alanmateus.png');
    }).catch(function () {
      overlay.hidden = true;
      alert('Não deu pra gerar a imagem agora. Tenta de novo em instantes.');
    });
  });
})();

// --- Citação em imagem (aparece ao selecionar um trecho do texto) ---
(function () {
  var quoteBtn = document.getElementById('quote-share-btn');
  var postBody = document.querySelector('.post-body');
  if (!quoteBtn || !postBody) return;
  var overlay = document.getElementById('story-generating-overlay');
  var overlayText = document.getElementById('story-overlay-text');
  var S = window.AMCanvasShare;
  var textoSelecionado = '';

  document.addEventListener('mouseup', mostrarBotao);
  document.addEventListener('touchend', mostrarBotao);

  function mostrarBotao() {
    var sel = window.getSelection();
    var texto = sel.toString().trim();
    if (!texto || texto.length < 10 || texto.length > 280) {
      quoteBtn.hidden = true;
      return;
    }
    // só ativa se a seleção estiver dentro do corpo do post
    if (!postBody.contains(sel.anchorNode)) {
      quoteBtn.hidden = true;
      return;
    }
    textoSelecionado = texto;
    var rect = sel.getRangeAt(0).getBoundingClientRect();
    quoteBtn.style.top = (window.scrollY + rect.top - 46) + 'px';
    quoteBtn.style.left = Math.max(10, rect.left + rect.width / 2 - 90) + 'px';
    quoteBtn.hidden = false;
  }

  quoteBtn.addEventListener('mousedown', function (e) { e.preventDefault(); });
  quoteBtn.addEventListener('click', function () {
    quoteBtn.hidden = true;
    overlay.hidden = false;
    overlayText.textContent = 'Gerando sua imagem...';
    var getCopiado = S.copiarLinkAtual();

    var W = 1080, H = 1080;
    var canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    var ctx = canvas.getContext('2d');

    var grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#0E2E38');
    grad.addColorStop(1, '#0A161C');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#00C2A8';
    ctx.fillRect(0, 0, W, 12);
    ctx.fillRect(0, H - 12, W, 12);

    ctx.fillStyle = '#00C2A8';
    ctx.font = 'bold 120px Georgia, serif';
    ctx.textAlign = 'left';
    ctx.fillText('❝', 70, 260);

    ctx.fillStyle = '#fff';
    ctx.font = '46px Georgia, serif';
    var linhas = S.wrapText(ctx, textoSelecionado, W - 160);
    var alturaLinha = 62;
    var alturaTotal = linhas.length * alturaLinha;
    var ty = (H - alturaTotal) / 2;
    linhas.forEach(function (linha) {
      ctx.fillText(linha, 80, ty);
      ty += alturaLinha;
    });

    var tituloEl = document.querySelector('.post-hero__title');
    var autorTexto = 'Alan Mateus — ' + (tituloEl ? tituloEl.textContent.trim() : document.title);
    ctx.font = 'bold 26px sans-serif';
    ctx.fillStyle = '#00C2A8';
    var linhasAutor = S.wrapText(ctx, autorTexto, W - 160);
    linhasAutor.slice(0, 2).forEach(function (linha, i) {
      ctx.fillText(linha, 80, H - 100 + (i * 34));
    });

    S.baixarOuCompartilhar(canvas, overlay, overlayText, getCopiado(), 'citacao-alanmateus.png');
  });
})();

// --- "Baixar PDF" (usa a impressão do navegador) ---
(function () {
  var pdfBtn = document.getElementById('download-pdf-btn');
  if (!pdfBtn) return;
  pdfBtn.addEventListener('click', function () {
    window.print();
  });
})();
