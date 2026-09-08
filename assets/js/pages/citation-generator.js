/*
 * pages/citation-generator.js — lógica da ferramenta /ferramentas/gerador-de-citacao/.
 * Gera uma imagem quadrada (1080×1080) com uma frase e assinatura, pronta
 * pra baixar. Usa a função compartilhada wrapText de core/canvas-share.js
 * (a mesma que quebra texto em várias linhas nos outros geradores de imagem
 * do site) — só o desenho final é diferente, por isso o resto do código
 * fica aqui, específico desta página.
 */
(function () {
  var gerarBtn = document.getElementById('citacao-gerar');
  if (!gerarBtn) return;

  var corAtual = { c1: '#0E2E38', c2: '#0A161C' };

  document.querySelectorAll('.citacao-cor').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.citacao-cor').forEach(function (b) {
        b.classList.remove('citacao-cor--ativa');
      });
      btn.classList.add('citacao-cor--ativa');
      corAtual.c1 = btn.dataset.cor1;
      corAtual.c2 = btn.dataset.cor2;
    });
  });

  gerarBtn.addEventListener('click', function () {
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
    var linhas = window.AMCanvasShare.wrapText(ctx, texto, W - 160);
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
    preview.innerHTML = '';

    var img = document.createElement('img');
    img.src = url;
    img.alt = 'Citação gerada, pronta pra compartilhar';
    img.className = 'citacao-preview__img';

    var linkBaixar = document.createElement('a');
    linkBaixar.href = url;
    linkBaixar.download = 'citacao-de-aula.png';
    linkBaixar.className = 'btn btn--primary';
    linkBaixar.textContent = 'Baixar imagem';

    preview.appendChild(img);
    preview.appendChild(document.createElement('br'));
    preview.appendChild(linkBaixar);
  });
})();
