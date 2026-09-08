/*
 * pages/curriculo.js — três recursos específicos da página /curriculo/:
 *
 *   1) QR code que aponta pro cartão de contato digital (/contato/cartao/)
 *   2) Botão "Baixar PDF" (usa a biblioteca html2pdf pra gerar um PDF de
 *      verdade a partir do HTML da página — diferente do botão do post,
 *      que só usa a impressão do navegador)
 *   3) Radar de skills (gráfico poligonal) calculado ao vivo a partir
 *      das linguagens usadas nos repositórios públicos do GitHub
 *
 * Este é um script de PÁGINA (não uma "feature" reaproveitável em outro
 * lugar do site), por isso vive em pages/ e não em features/.
 *
 * Os valores que variam conforme configuração do site (usuário do GitHub,
 * nível de segurança, URL do cartão) vêm de atributos data-* no HTML,
 * não direto de Liquid dentro deste arquivo — assim este .js não precisa
 * ser processado pelo Jekyll, só o HTML que o usa.
 */

// --- QR code do cartão de contato + aviso em telas de toque ---
(function () {
  var qrEl = document.getElementById('cv-qrcode');
  if (!qrEl) return;

  window.addEventListener('load', function () {
    if (typeof QRCode === 'undefined') return;
    new QRCode(qrEl, {
      text: window.location.origin + qrEl.dataset.cartaoUrl,
      width: 88,
      height: 88,
      colorDark: '#0E2E38',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });

    // Em telas de toque o QR não serve pra escanear a própria tela —
    // deixa claro que é um link, não um código pra apontar a câmera.
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
      var legendaQr = document.getElementById('cv-qrcode-legenda');
      if (legendaQr) legendaQr.textContent = 'Toque para abrir o cartão';
    }
  });
})();

// --- Botão "Imprimir" ---
(function () {
  var btn = document.getElementById('cv-imprimir');
  if (!btn) return;
  btn.addEventListener('click', function () { window.print(); });
})();

// --- Botão "Baixar PDF" (gera um PDF de verdade com html2pdf.js) ---
(function () {
  var btnPdf = document.getElementById('cv-baixar-pdf');
  if (!btnPdf) return;

  btnPdf.addEventListener('click', function () {
    if (typeof html2pdf === 'undefined') {
      alert('Ainda carregando o gerador de PDF — espera 2 segundos e tenta de novo.');
      return;
    }
    var elemento = document.querySelector('.cv');
    var opcoes = {
      margin: 0.4,
      filename: 'curriculo-alan-mateus.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opcoes).from(elemento).save();
  });
})();

// --- Radar de skills (backend / frontend / devops / segurança) ---
(function () {
  var wrap = document.querySelector('.radar-chart-wrap[data-github-user]');
  if (!wrap) return;

  var USUARIO_GITHUB = wrap.dataset.githubUser;
  var nivelSeguranca = parseInt(wrap.dataset.nivelSeguranca, 10) || 1;
  var CENTRO = 200, RAIO_MAX = 160;

  var NOMES_ETAPA = { 1: 'Etapa 1 — Fundamentos', 2: 'Etapa 2 — Praticando', 3: 'Etapa 3 — Aplicado', 4: 'Etapa 4 — Avançado' };

  // Quais linguagens do GitHub contam pra cada categoria do radar
  var MAPA = {
    backend: ['C#', 'Java', 'Python', 'PHP', 'Ruby', 'Go', 'TSQL', 'PLpgSQL'],
    frontend: ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'Vue', 'SCSS'],
    devops: ['Dockerfile', 'Shell', 'PowerShell', 'YAML', 'Makefile']
  };

  // Quanto mais bytes de código numa categoria, mais avançada a etapa (1 a 4)
  function bytesParaEtapa(bytes) {
    if (bytes <= 0) return 1;
    if (bytes < 10000) return 2;
    if (bytes < 80000) return 3;
    return 4;
  }

  function raioDaEtapa(etapa) { return (etapa / 4) * RAIO_MAX; }

  function desenharPonto(idCirculo, etapa, eixo) {
    var r = raioDaEtapa(etapa);
    var circulo = document.getElementById(idCirculo);
    var x = CENTRO, y = CENTRO;
    if (eixo === 'top') y = CENTRO - r;
    if (eixo === 'right') x = CENTRO + r;
    if (eixo === 'bottom') y = CENTRO + r;
    if (eixo === 'left') x = CENTRO - r;
    circulo.setAttribute('cx', x);
    circulo.setAttribute('cy', y);
    return { x: x, y: y };
  }

  function atualizarPoligono(pTop, pRight, pBottom, pLeft) {
    var pontos = pTop.x + ',' + pTop.y + ' ' + pRight.x + ',' + pRight.y + ' ' + pBottom.x + ',' + pBottom.y + ' ' + pLeft.x + ',' + pLeft.y;
    document.getElementById('radar-poligono').setAttribute('points', pontos);
  }

  // Segurança é autoavaliação manual (não vem do GitHub) — já desenha direto
  var pSeg = desenharPonto('radar-ponto-seguranca', nivelSeguranca, 'left');
  document.getElementById('radar-texto-seguranca').textContent = NOMES_ETAPA[nivelSeguranca];

  // Enquanto os dados do GitHub não chegam, desenha tudo na etapa 1
  var pTop0 = desenharPonto('radar-ponto-backend', 1, 'top');
  var pRight0 = desenharPonto('radar-ponto-frontend', 1, 'right');
  var pBottom0 = desenharPonto('radar-ponto-devops', 1, 'bottom');
  atualizarPoligono(pTop0, pRight0, pBottom0, pSeg);

  // ATENÇÃO: a API pública do GitHub tem limite de 60 requisições por
  // hora, por IP, sem autenticação. Este código faz 1 requisição pra
  // listar os repositórios + 1 requisição POR repositório não-fork.
  // Em redes compartilhadas ou em recarregamentos repetidos, esse limite
  // pode estourar — nesse caso a mensagem de erro abaixo aparece.
  fetch('https://api.github.com/users/' + USUARIO_GITHUB + '/repos?per_page=100')
    .then(function (r) { if (!r.ok) throw new Error('falhou'); return r.json(); })
    .then(function (repos) {
      var repositorios = repos.filter(function (r) { return !r.fork; });
      var promessas = repositorios.map(function (repo) {
        return fetch(repo.languages_url).then(function (r) { return r.json(); }).catch(function () { return {}; });
      });
      return Promise.all(promessas);
    })
    .then(function (todasLinguagens) {
      var totais = { backend: 0, frontend: 0, devops: 0 };
      todasLinguagens.forEach(function (linguagens) {
        Object.keys(linguagens).forEach(function (nomeLinguagem) {
          var bytes = linguagens[nomeLinguagem];
          Object.keys(MAPA).forEach(function (categoria) {
            if (MAPA[categoria].indexOf(nomeLinguagem) !== -1) totais[categoria] += bytes;
          });
        });
      });

      var etapaBackend = bytesParaEtapa(totais.backend);
      var etapaFrontend = bytesParaEtapa(totais.frontend);
      var etapaDevops = bytesParaEtapa(totais.devops);

      var pTop = desenharPonto('radar-ponto-backend', etapaBackend, 'top');
      var pRight = desenharPonto('radar-ponto-frontend', etapaFrontend, 'right');
      var pBottom = desenharPonto('radar-ponto-devops', etapaDevops, 'bottom');
      atualizarPoligono(pTop, pRight, pBottom, pSeg);

      document.getElementById('radar-texto-backend').textContent = NOMES_ETAPA[etapaBackend];
      document.getElementById('radar-texto-frontend').textContent = NOMES_ETAPA[etapaFrontend];
      document.getElementById('radar-texto-devops').textContent = NOMES_ETAPA[etapaDevops];

      document.getElementById('radar-chart-legenda').textContent =
        'Backend, Frontend e DevOps calculados ao vivo pelo código real nos repositórios públicos do GitHub. Segurança é autoavaliação, atualizada manualmente por marco.';
    })
    .catch(function () {
      document.getElementById('radar-chart-legenda').textContent =
        'Não foi possível carregar os dados do GitHub agora (limite de requisições da API pode ter sido atingido — tenta de novo mais tarde). Segurança já é exibida normalmente.';
      ['backend', 'frontend', 'devops'].forEach(function (c) {
        document.getElementById('radar-texto-' + c).textContent = 'indisponível agora';
      });
    });
})();
