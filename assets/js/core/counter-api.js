/**
 * === core/counter-api.js ===
 *
 * Centraliza toda a comunicação com o CounterAPI (counterapi.com), o serviço
 * externo que guarda os números de "visualizações" e "curtidas" do site
 * (sem precisar de banco de dados próprio).
 *
 * Usado por:
 *  - features/view-counter.js   → visualizações de um post
 *  - features/likes-widget.js   → curtidas de um post e dos cards do portfólio
 *  - features/comments.js       → curtidas de cada comentário
 *  - features/most-read.js      → lê as visualizações de todos os posts pra ranquear
 *
 * Precisa de `site-config.js` carregado ANTES deste arquivo (ele lê
 * `AMSite.config.counterNamespace`).
 */
window.AMSite = window.AMSite || {};

(function () {
  function montarUrl(tipo, chave) {
    var namespace = AMSite.config.counterNamespace;
    return 'https://counterapi.com/api/' + namespace + '/' + tipo + '/' + chave;
  }

  /**
   * Lê o valor atual de um contador SEM incrementar (`?readOnly=true`).
   * Usado ao carregar a página, pra mostrar "12 visualizações" sem que o
   * simples carregamento da página já conte como uma view extra.
   * @returns {Promise<{value: number}>}
   */
  function lerContador(tipo, chave) {
    return fetch(montarUrl(tipo, chave) + '?readOnly=true').then(function (res) {
      return res.json();
    });
  }

  /**
   * Incrementa um contador em 1 e retorna o novo valor.
   * Usado quando alguém curte algo, ou (pra "view") a cada carregamento de post.
   * @returns {Promise<{value: number}>}
   */
  function incrementarContador(tipo, chave) {
    return fetch(montarUrl(tipo, chave)).then(function (res) {
      if (!res.ok) throw new Error('CounterAPI: falha ao incrementar ' + tipo + '/' + chave);
      return res.json();
    });
  }

  /**
   * Liga um botão de "curtir" genérico a um contador de curtidas — funciona
   * pra curtida de post, de comentário ou de card do portfólio, contanto que
   * cada um passe seu próprio botão, elemento de contagem e chave única.
   *
   * Comportamento: ao carregar, busca o valor atual (sem incrementar) e
   * marca como "já curtido" se este navegador já curtiu antes (localStorage).
   * Ao clicar, incrementa uma vez só por navegador.
   *
   * @param {HTMLElement} btn      - o botão clicável
   * @param {HTMLElement} countEl  - onde escrever o número de curtidas
   * @param {string} chave         - identificador único desta curtida (ex.: slug do post, ou "slug--c-123" pra um comentário)
   */
  function ligarBotaoCurtir(btn, countEl, chave) {
    if (!btn || !countEl || !chave) return;
    var storageKey = 'liked:' + chave;

    lerContador('like', chave)
      .then(function (data) {
        countEl.textContent = data.value || 0;
        btn.disabled = false;
        if (localStorage.getItem(storageKey)) {
          btn.setAttribute('aria-pressed', 'true');
          btn.classList.add('is-liked');
        }
      })
      .catch(function () {
        countEl.textContent = '0';
        btn.disabled = false;
      });

    btn.addEventListener('click', function () {
      if (localStorage.getItem(storageKey)) return; // já curtiu neste navegador
      btn.disabled = true;
      incrementarContador('like', chave)
        .then(function (data) {
          localStorage.setItem(storageKey, '1');
          btn.setAttribute('aria-pressed', 'true');
          btn.classList.add('is-liked');
          countEl.textContent = data.value || (parseInt(countEl.textContent, 10) || 0) + 1;
        })
        .catch(function () {
          // Silencioso de propósito: curtida é uma interação leve,
          // não vale a pena interromper a leitura com uma mensagem de erro.
        })
        .finally(function () {
          btn.disabled = false;
        });
    });
  }

  AMSite.counter = {
    lerContador: lerContador,
    incrementarContador: incrementarContador,
    ligarBotaoCurtir: ligarBotaoCurtir
  };
})();
