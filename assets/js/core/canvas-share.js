/*
 * core/canvas-share.js — funções de apoio para as três ferramentas do
 * site que geram uma IMAGEM em <canvas> pra compartilhar (o card do
 * LinkedIn, o card de citação dos posts, o "story" genérico de
 * qualquer página, e o gerador de citação de aula). As quatro
 * ferramentas usam basicamente as mesmas operações:
 *
 *   - roundRect: desenhar um retângulo com cantos arredondados
 *   - wrapText: quebrar um texto longo em várias linhas que cabem
 *     numa largura máxima
 *   - copiarLinkAtual: copiar a URL da página pra área de transferência
 *   - baixarOuCompartilhar: depois de pronta a imagem, ou abre o menu
 *     nativo de compartilhamento (celular) ou baixa o arquivo (desktop)
 *
 * Antes essas quatro funções estavam copiadas (com pequenas variações)
 * em três arquivos diferentes. Agora vivem só aqui, em window.AMCanvasShare.
 */
window.AMCanvasShare = (function () {
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function wrapText(ctx, text, maxWidth) {
    var words = text.split(' ');
    var lines = [];
    var current = '';
    words.forEach(function (w) {
      var test = (current + ' ' + w).trim();
      if (ctx.measureText(test).width <= maxWidth) {
        current = test;
      } else {
        lines.push(current);
        current = w;
      }
    });
    if (current) lines.push(current);
    return lines;
  }

  /** Copia a URL atual da página. Retorna uma função que diz se deu certo. */
  function copiarLinkAtual() {
    var copiado = false;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(function () { copiado = true; }).catch(function () {});
    }
    return function () { return copiado; };
  }

  /**
   * Depois que o canvas está pronto: no celular, tenta abrir o menu
   * nativo de compartilhamento; no desktop (ou se o celular não suportar),
   * baixa a imagem como arquivo PNG.
   */
  function baixarOuCompartilhar(canvas, overlay, overlayText, linkCopiado, nomeArquivo) {
    canvas.toBlob(function (blob) {
      var arquivo = new File([blob], nomeArquivo, { type: 'image/png' });
      overlayText.textContent = linkCopiado
        ? 'Pronto! Link também copiado — cola no sticker de link do Instagram.'
        : 'Pronto!';

      setTimeout(function () {
        overlay.hidden = true;
        if (navigator.canShare && navigator.canShare({ files: [arquivo] })) {
          navigator.share({ files: [arquivo], title: 'Compartilhar' }).catch(function () {});
        } else {
          var link = document.createElement('a');
          link.download = nomeArquivo;
          link.href = canvas.toDataURL('image/png');
          link.click();
        }
      }, linkCopiado ? 1400 : 200);
    }, 'image/png');
  }

  return {
    roundRect: roundRect,
    wrapText: wrapText,
    copiarLinkAtual: copiarLinkAtual,
    baixarOuCompartilhar: baixarOuCompartilhar
  };
})();
