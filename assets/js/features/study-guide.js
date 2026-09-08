/*
 * features/study-guide.js — widget "Continue seus estudos" que aparece
 * no fim de cada post, sugerindo o próximo post ainda não lido (na
 * mesma ordem cronológica do plano de estudos).
 *
 * Os dados de TODOS os posts (slug, título, url) são gerados pelo Jekyll
 * em formato JSON dentro de _includes/study-guide-data.html, num
 * <script type="application/json" id="study-guide-data">. Isso é dado,
 * não lógica — por isso continua embutido no HTML (o Jekyll precisa
 * processá-lo com Liquid a cada build). Este arquivo só lê esse JSON
 * e decide o que mostrar.
 */
window.__studyGuide = window.__studyGuide || {};

(function () {
  var dataEl = document.getElementById('study-guide-data');
  if (!dataEl) return;

  var posts = JSON.parse(dataEl.textContent);
  var lidos = JSON.parse(localStorage.getItem('posts-lidos') || '[]');

  window.__studyGuide.posts = posts;
  window.__studyGuide.lidos = lidos;

  /** Retorna o primeiro post (em ordem cronológica) que ainda não foi lido. */
  window.__studyGuide.proximoNaoLido = function () {
    for (var i = 0; i < posts.length; i++) {
      if (lidos.indexOf(posts[i].slug) === -1) return posts[i];
    }
    return null; // leu tudo!
  };

  /** Marca com um selinho os posts já lidos, na listagem do blog. */
  window.__studyGuide.marcarLidosNaListagem = function () {
    document.querySelectorAll('[data-slug]').forEach(function (card) {
      var slug = card.getAttribute('data-slug');
      if (lidos.indexOf(slug) !== -1) {
        var badge = card.querySelector('.blog-post-item__read-badge');
        if (badge) badge.hidden = false;
      }
    });
  };

  /** Desenha o widget "Continue seus estudos" dentro do elemento indicado. */
  window.__studyGuide.renderizarContinuarWidget = function (containerId) {
    var el = document.getElementById(containerId);
    if (!el) return;
    var proximo = window.__studyGuide.proximoNaoLido();

    if (!proximo) {
      el.innerHTML = '<p class="study-guide__done">Você está em dia com todos os artigos publicados até agora!</p>';
    } else {
      // Criamos os elementos com createElement (em vez de innerHTML com
      // texto colado) só por segurança: assim, se um título de post algum
      // dia tiver caracteres especiais, eles nunca são interpretados como HTML.
      el.innerHTML = '';
      var label = document.createElement('p');
      label.className = 'study-guide__label';
      label.textContent = 'Continue seus estudos';
      var link = document.createElement('a');
      link.className = 'study-guide__link';
      link.href = proximo.url;
      link.textContent = proximo.title + ' →';
      el.appendChild(label);
      el.appendChild(link);
    }
    el.hidden = false;
  };

  // Aproveita e já marca os posts lidos na listagem do blog, se houver
  // algum '[data-slug]' na página (nas páginas que não têm listagem,
  // isso simplesmente não encontra nada e não faz diferença).
  window.__studyGuide.marcarLidosNaListagem();

  // As três páginas que usam este widget (post, listagem do blog e a
  // página /trilha/) sempre usam o mesmo id de container — por isso já
  // desenhamos o widget aqui, sem precisar de mais um <script> em cada
  // página chamando isso manualmente.
  window.__studyGuide.renderizarContinuarWidget('study-guide-widget');
})();
