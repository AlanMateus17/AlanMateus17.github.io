/*
 * pages/trilha.js — lógica específica da página /trilha/ (barra de
 * progresso de leitura, lista de todos os posts marcando os já lidos,
 * e "conquistas" desbloqueadas conforme o histórico de leitura).
 *
 * Depende de window.__studyGuide (definido em features/study-guide.js),
 * que já leu o histórico de leitura do localStorage e a lista de posts
 * vinda de _includes/study-guide-data.html.
 *
 * Observação sobre segurança: os títulos e tags inseridos via innerHTML
 * abaixo vêm sempre do próprio conteúdo do blog (você mesmo escreve os
 * posts) — nunca de um formulário público — por isso não há risco de
 * outra pessoa injetar HTML malicioso aqui.
 */
(function () {
  var listaEl = document.getElementById('trilha-lista');
  if (!listaEl) return;

  var posts = window.__studyGuide.posts;
  var lidos = window.__studyGuide.lidos;

  var lidosCount = 0;
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
  listaEl.innerHTML = html || '<p class="trilha-vazio">Ainda não tem artigos publicados.</p>';

  // --- Barra de progresso ---
  var total = posts.length;
  var pct = total > 0 ? Math.round((lidosCount / total) * 100) : 0;
  document.getElementById('trilha-progresso-fill').style.width = pct + '%';
  document.getElementById('trilha-progresso-texto').textContent =
    total > 0
      ? 'Você leu ' + lidosCount + ' de ' + total + ' artigos publicados (' + pct + '%)'
      : 'Ainda não tem artigos publicados pra acompanhar.';

  // --- Conquistas desbloqueadas conforme o progresso ---
  var conquistas = [];
  if (lidosCount >= 1) conquistas.push({ nome: 'Primeira leitura', desc: 'Leu o primeiro artigo' });
  if (lidosCount >= 5) conquistas.push({ nome: '5 artigos', desc: 'Leu 5 artigos diferentes' });
  if (lidosCount >= 10) conquistas.push({ nome: '10 artigos', desc: 'Leu 10 artigos diferentes' });
  if (total > 0 && lidosCount === total) conquistas.push({ nome: 'Em dia', desc: 'Leu tudo que já foi publicado' });

  // Conquista extra: ler todos os posts de uma mesma tag
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
})();
