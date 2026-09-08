/**
 * === pages/trilha.js ===
 * Lógica exclusiva da página /trilha/. Usa os dados já carregados por
 * `features/study-guide.js` (que também é quem desenha o widget "continue
 * seus estudos" no topo desta mesma página, automaticamente).
 *
 * Por que dentro de `DOMContentLoaded`: este arquivo é carregado no MEIO
 * do conteúdo da página, então aparece no documento ANTES do
 * `_includes/scripts.html` (que fica perto do fim do `<body>` e é onde
 * `study-guide.js` mora). Mesmo os dois usando `defer`, scripts com defer
 * executam na ordem em que aparecem no documento — então, sem esperar o
 * `DOMContentLoaded`, este arquivo rodaria ANTES de `study-guide.js` e
 * `AMSite.studyGuide` ainda não existiria. `DOMContentLoaded` só dispara
 * depois que TODOS os scripts com defer da página já terminaram de rodar,
 * garantindo a ordem certa sem depender de onde cada tag <script> está.
 */
document.addEventListener('DOMContentLoaded', function () {
  if (!AMSite.studyGuide) return; // página sem os dados do guia de estudos carregados

  var posts = AMSite.studyGuide.posts;
  var lidos = AMSite.studyGuide.lidos;

  var lidosCount = 0;
  var listaEl = document.getElementById('trilha-lista');
  var html = '';
  var checkSvg = '<svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M4 10.5L8 14.5L16 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  posts.forEach(function (post, i) {
    var foiLido = lidos.indexOf(post.slug) !== -1;
    if (foiLido) lidosCount++;
    html += '<a href="' + post.url + '" class="trilha-item ' + (foiLido ? 'trilha-item--lido' : '') + '">' +
      '<span class="trilha-item__check">' + (foiLido ? checkSvg : (i + 1)) + '</span>' +
      '<span class="trilha-item__titulo">' + post.title + '</span>' +
      '</a>';
  });
  listaEl.innerHTML = html || '<p class="text-muted">Ainda não tem artigos publicados.</p>';

  var total = posts.length;
  var pct = total > 0 ? Math.round((lidosCount / total) * 100) : 0;
  document.getElementById('trilha-progresso-fill').style.width = pct + '%';
  document.getElementById('trilha-progresso-texto').textContent =
    total > 0
      ? 'Você leu ' + lidosCount + ' de ' + total + ' artigos publicados (' + pct + '%)'
      : 'Ainda não tem artigos publicados pra acompanhar.';

  // --- Conquistas ---
  var conquistas = [];
  if (lidosCount >= 1) conquistas.push({ nome: 'Primeira leitura', desc: 'Leu o primeiro artigo' });
  if (lidosCount >= 5) conquistas.push({ nome: '5 artigos', desc: 'Leu 5 artigos diferentes' });
  if (lidosCount >= 10) conquistas.push({ nome: '10 artigos', desc: 'Leu 10 artigos diferentes' });
  if (total > 0 && lidosCount === total) conquistas.push({ nome: 'Em dia', desc: 'Leu tudo que já foi publicado' });

  var porTag = {};
  posts.forEach(function (post) {
    if (!post.tag) return;
    if (!porTag[post.tag]) porTag[post.tag] = { total: 0, lidos: 0 };
    porTag[post.tag].total++;
    if (lidos.indexOf(post.slug) !== -1) porTag[post.tag].lidos++;
  });
  Object.keys(porTag).forEach(function (tag) {
    if (porTag[tag].total > 1 && porTag[tag].lidos === porTag[tag].total) {
      conquistas.push({ nome: 'Especialista: ' + tag, desc: 'Leu todos os artigos sobre ' + tag });
    }
  });

  if (conquistas.length > 0) {
    var grid = document.getElementById('conquistas-grid');
    grid.innerHTML = conquistas.map(function (c) {
      return '<div class="conquista-badge"><p class="conquista-badge__nome">' + c.nome + '</p>' +
        '<p class="conquista-badge__desc">' + c.desc + '</p></div>';
    }).join('');
    document.getElementById('conquistas-secao').hidden = false;
  }
});
