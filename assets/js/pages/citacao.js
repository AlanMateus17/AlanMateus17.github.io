/**
 * === pages/citacao.js ===
 * Lógica exclusiva da página /ferramentas/gerador-de-citacao/: escolher cor,
 * desenhar a citação num canvas e gerar a imagem final pra download.
 * "Página exclusiva" quer dizer: só é carregado nessa página (ver
 * ferramentas/gerador-de-citacao/index.html), diferente dos arquivos em
 * features/, que rodam em várias páginas.
 */
(function () {
  var corAtual = { c1: '#0E2E38', c2: '#0A161C' };

  document.querySelectorAll('.citacao-cor').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.citacao-cor').forEach(function (b) { b.classList.remove('color-swatch--selected'); });
      btn.classList.add('color-swatch--selected');
      corAtual.c1 = btn.dataset.cor1;
      corAtual.c2 = btn.dataset.cor2;
    });
  });

  document.getElementById('citacao-gerar').addEventListener('click', function () {
    var texto = document.getElementById('citacao-texto').value.trim();
    if (!texto) { alert('Escreve uma frase primeiro.'); return; }
    var assinatura = document.getElementById('citacao-assinatura').value.trim();

    var canvas = document.getElementById('citacao-canvas');
    var W = 1080, H = 1080;
    var ctx = canvas.getContext('2d');

    var grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, corAtual.c1);
    grad.addColorStop(1, corAtual.c2);
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
    var linhas = AMSite.canvas.wrapText(ctx, texto, W - 160);
    var alturaLinha = 62;
    var ty = (H - linhas.length * alturaLinha) / 2;
    linhas.forEach(function (linha) { ctx.fillText(linha, 80, ty); ty += alturaLinha; });

    if (assinatura) {
      ctx.font = 'bold 26px sans-serif';
      ctx.fillStyle = '#00C2A8';
      ctx.fillText(assinatura, 80, H - 100);
    }
    ctx.font = '20px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText('gerado em alanmateus17.github.io/ferramentas', 80, H - 50);

    var url = canvas.toDataURL('image/png');
    var preview = document.getElementById('citacao-preview');
    preview.innerHTML = '<img src="' + url + '" alt="Citação gerada, pronta pra compartilhar" class="citacao-preview-img mb-1">' +
      '<br><a href="' + url + '" download="citacao-de-aula.png" class="btn btn--primary">Baixar imagem</a>';
  });
})();
