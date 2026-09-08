/**
 * === features/study-guide.js ===
 * Lê os dados de todos os posts (gerados em `_includes/study-guide-data.html`,
 * um `<script type="application/json">` só com dados, sem lógica) e cruza
 * com o histórico de leitura (`localStorage`, escrito por `post-status.js`).
 *
 * Expõe `AMSite.studyGuide` com:
 *  - `.posts`              → lista de todos os posts, em ordem cronológica
 *  - `.lidos`              → slugs já lidos
 *  - `.proximoNaoLido()`   → próximo post ainda não lido (ou null se leu tudo)
 *  - `.renderizarContinuarWidget(containerId)` → desenha o card "continue
 *     seus estudos" dentro do elemento com esse id
 *
 * Usado por:
 *  - `_layouts/post.html` (widget de "continuar" no fim de cada post)
 *  - `/trilha/` (lista completa + barra de progresso + conquistas, em pages/trilha.js)
 *
 * Este arquivo já cuida sozinho de renderizar o widget "continuar estudos"
 * em qualquer página que tenha um elemento `#study-guide-widget` — não
 * precisa chamar nada manualmente depois de incluir este script.
 */
window.AMSite = window.AMSite || {};

(function () {
  var dataEl = document.getElementById('study-guide-data');
  if (!dataEl) return;

  var posts = JSON.parse(dataEl.textContent);
  var lidos = JSON.parse(localStorage.getItem('posts-lidos') || '[]');

  function proximoNaoLido() {
    for (var i = 0; i < posts.length; i++) {
      if (lidos.indexOf(posts[i].slug) === -1) return posts[i];
    }
    return null;
  }

  function marcarLidosNaListagem() {
    document.querySelectorAll('[data-slug]').forEach(function (card) {
      var slug = card.getAttribute('data-slug');
      if (lidos.indexOf(slug) !== -1) {
        var badge = card.querySelector('.blog-post-item__read-badge');
        if (badge) badge.hidden = false;
      }
    });
  }

  function renderizarContinuarWidget(containerId) {
    var el = document.getElementById(containerId);
    if (!el) return;
    var proximo = proximoNaoLido();
    if (!proximo) {
      el.innerHTML = '<p class="study-guide__done">Você está em dia com todos os artigos publicados até agora!</p>';
    } else {
      el.innerHTML = '<p class="study-guide__label">Continue seus estudos</p>' +
        '<a href="' + proximo.url + '" class="study-guide__link">' + proximo.title + ' →</a>';
    }
    el.hidden = false;
  }

  AMSite.studyGuide = {
    posts: posts,
    lidos: lidos,
    proximoNaoLido: proximoNaoLido,
    marcarLidosNaListagem: marcarLidosNaListagem,
    renderizarContinuarWidget: renderizarContinuarWidget
  };

  // Roda automaticamente em qualquer página: marca os cards já lidos
  // (não faz nada se não houver nenhum elemento [data-slug] na página) e
  // renderiza o widget "continuar estudos" se ele existir nesta página
  // (existe em posts e na página /trilha/). Evita repetir essas chamadas
  // manualmente em cada arquivo .html que usa esses recursos — e evita o
  // problema de um <script> inline (que rodaria antes deste arquivo
  // carregar, por causa do defer).
  marcarLidosNaListagem();
  if (document.getElementById('study-guide-widget')) {
    renderizarContinuarWidget('study-guide-widget');
  }
})();
