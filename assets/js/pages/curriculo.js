/**
 * === pages/curriculo.js ===
 * Lógica exclusiva da página /curriculo/.
 *
 * Os dados que só existem em tempo de build no Jekyll (URL do cartão de
 * contato, usuário do GitHub, nível de segurança autoavaliado) chegam aqui
 * via atributos `data-*` na seção `.cv` — não por uma chamada de função
 * inline, porque este arquivo carrega com `defer` (só roda depois que a
 * página inteira já carregou); um `<script>` inline antes dele no HTML
 * rodaria cedo demais, antes deste arquivo sequer existir.
 *
 * Três responsabilidades independentes, cada uma guardada por sua própria
 * checagem de "o elemento existe?":
 *  1) QR code do cartão de contato + aviso em telas de toque
 *  2) Botões "Imprimir" e "Baixar PDF"
 *  3) Radar de skills (Backend/Frontend/DevOps calculados ao vivo pela
 *     linguagem dos repositórios públicos do GitHub; Segurança é
 *     autoavaliação manual, vinda do front matter)
 */
(function () {
  var cv = document.querySelector('.cv');
  if (!cv) return;

  var urlCartao = cv.getAttribute('data-cartao-url');
  var usuarioGithub = cv.getAttribute('data-github-user');
  var nivelSeguranca = parseInt(cv.getAttribute('data-nivel-seguranca'), 10) || 1;

  // --- 1) QR code do cartão de contato ---
  window.addEventListener('load', function () {
    if (typeof QRCode !== 'undefined') {
      new QRCode(document.getElementById('cv-qrcode'), {
        text: window.location.origin + urlCartao,
        width: 88,
        height: 88,
        colorDark: '#0E2E38',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });
    }

    // Em telas de toque o QR não serve pra escanear a própria tela — deixa claro que é um link.
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
      var legendaQr = document.getElementById('cv-qrcode-legenda');
      if (legendaQr) legendaQr.textContent = 'Toque para abrir o cartão';
    }

    // --- 2) Imprimir / Baixar PDF ---
    var btnImprimir = document.getElementById('cv-imprimir');
    if (btnImprimir) btnImprimir.addEventListener('click', function () { window.print(); });

    var btnPdf = document.getElementById('cv-baixar-pdf');
    if (btnPdf) {
      btnPdf.addEventListener('click', function () {
        if (typeof html2pdf === 'undefined') {
          alert('Ainda carregando o gerador de PDF — espera 2 segundos e tenta de novo.');
          return;
        }
        html2pdf().set({
          margin: 0.4,
          filename: 'curriculo-alan-mateus.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        }).from(cv).save();
      });
    }
  });

  // --- 3) Radar de skills ---
  iniciarRadarDeSkills(usuarioGithub, nivelSeguranca);

  function iniciarRadarDeSkills(usuarioGithub, nivelSeguranca) {
    var CENTRO = 200, RAIO_MAX = 160;
    var NOMES_ETAPA = { 1: 'Etapa 1 — Fundamentos', 2: 'Etapa 2 — Praticando', 3: 'Etapa 3 — Aplicado', 4: 'Etapa 4 — Avançado' };
    var MAPA = {
      backend: ['C#', 'Java', 'Python', 'PHP', 'Ruby', 'Go', 'TSQL', 'PLpgSQL'],
      frontend: ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'Vue', 'SCSS'],
      devops: ['Dockerfile', 'Shell', 'PowerShell', 'YAML', 'Makefile']
    };

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

    var pSeg = desenharPonto('radar-ponto-seguranca', nivelSeguranca, 'left');
    document.getElementById('radar-texto-seguranca').textContent = NOMES_ETAPA[nivelSeguranca];

    var pTop0 = desenharPonto('radar-ponto-backend', 1, 'top');
    var pRight0 = desenharPonto('radar-ponto-frontend', 1, 'right');
    var pBottom0 = desenharPonto('radar-ponto-devops', 1, 'bottom');
    atualizarPoligono(pTop0, pRight0, pBottom0, pSeg);

    fetch('https://api.github.com/users/' + usuarioGithub + '/repos?per_page=100')
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
          'Não foi possível carregar os dados do GitHub agora (recarregue a página). Segurança já é exibida normalmente.';
        ['backend', 'frontend', 'devops'].forEach(function (c) {
          document.getElementById('radar-texto-' + c).textContent = 'indisponível agora';
        });
      });
  }
})();
