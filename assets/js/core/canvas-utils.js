/**
 * === core/canvas-utils.js ===
 *
 * Funções de desenho em <canvas> reaproveitadas por TODAS as features que
 * geram uma imagem pra compartilhar: o cartão de LinkedIn e a citação em
 * imagem (features/share-post.js), o Story global (features/share-global.js)
 * e o gerador de citação de aula (pages/citacao.js).
 *
 * Antes da limpeza, essas mesmas funções existiam copiadas e coladas em
 * 3 arquivos diferentes, com pequenas diferenças entre as cópias — ou seja,
 * um bug corrigido numa cópia podia continuar existindo nas outras duas.
 * Agora existe uma única versão, e tudo abaixo é acessível via `AMSite.canvas`.
 */
window.AMSite = window.AMSite || {};

(function () {
  /**
   * Desenha um retângulo com cantos arredondados no canvas.
   * (O canvas nativo só sabe desenhar retângulo reto ou círculo — isso aqui
   * simula o "border-radius" do CSS, mas dentro de uma imagem gerada.)
   */
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  /**
   * Quebra um texto longo em várias linhas que cabem dentro de `maxWidth`,
   * medindo o texto de verdade com a fonte atual do canvas (`ctx.font`).
   * O canvas não quebra linha sozinho como o HTML faz — precisa desse cálculo manual.
   * Retorna um array de strings, uma por linha.
   */
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

  /**
   * Depois de gerar a imagem final, decide o que fazer com ela:
   *  - se o navegador suporta compartilhar arquivos nativamente (celular),
   *    abre a folha de compartilhamento do sistema;
   *  - senão (desktop), simplesmente baixa a imagem.
   *
   * @param {HTMLCanvasElement} canvas
   * @param {HTMLElement} overlay      - a caixa "Gerando sua imagem..." pra esconder no final
   * @param {HTMLElement} overlayText  - o texto dentro da caixa, pra mudar a mensagem final
   * @param {boolean} linkCopiado      - se true, avisa que o link também foi copiado
   * @param {string} nomeArquivo       - nome do arquivo .png baixado
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

  /**
   * Copia a URL atual pra área de transferência (sem travar nada se falhar).
   * Retorna uma função que, quando chamada depois, diz se a cópia deu certo
   * — porque `navigator.clipboard.writeText` é assíncrono, mas geramos a
   * imagem antes de saber se copiou.
   */
  function copiarLinkAtual() {
    var copiado = false;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(function () { copiado = true; }).catch(function () {});
    }
    return function () { return copiado; };
  }

  AMSite.canvas = {
    roundRect: roundRect,
    wrapText: wrapText,
    baixarOuCompartilhar: baixarOuCompartilhar,
    copiarLinkAtual: copiarLinkAtual
  };
})();
