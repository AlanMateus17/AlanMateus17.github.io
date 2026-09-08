/*
 * core/counter-widget.js — todo o site usa o mesmo serviço externo
 * (CounterAPI) pra contar curtidas e visualizações em três lugares
 * diferentes: o botão de curtir de cada post, o botão de curtir de
 * cada comentário, e o botão de curtir de cada projeto do portfólio.
 *
 * Antes, cada um desses três lugares tinha sua PRÓPRIA cópia da lógica
 * de "buscar o valor, guardar no localStorage pra não deixar curtir
 * duas vezes, mostrar o contador". Esse arquivo existe pra ter essa
 * lógica escrita uma vez só, num objeto global `window.AMCounter`,
 * que os outros arquivos (features/likes-widget.js, features/comments.js)
 * chamam.
 *
 * Precisa ser carregado DEPOIS de site-config.js (usa window.AM_CONFIG)
 * e ANTES de qualquer arquivo que use window.AMCounter.
 */
window.AMCounter = (function () {
  var NAMESPACE = window.AM_CONFIG.counterApiNamespace;

  function urlDe(tipo, chave) {
    // tipo: "like" ou "view"
    return 'https://counterapi.com/api/' + NAMESPACE + '/' + tipo + '/' + chave;
  }

  /**
   * Liga um botão de curtir a uma "chave" (identificador único da coisa
   * curtida — pode ser o slug de um post, o id de um comentário, etc).
   *
   * options:
   *   btn      - o elemento <button>
   *   key      - string única pra essa curtida
   *   countEl  - elemento onde o número deve aparecer
   */
  function initLikeButton(options) {
    var btn = options.btn;
    var key = options.key;
    var countEl = options.countEl;
    var storageKey = 'liked:' + key;
    var baseUrl = urlDe('like', key);

    // Busca o valor atual sem contar como uma nova curtida (readOnly=true)
    fetch(baseUrl + '?readOnly=true')
      .then(function (res) { return res.json(); })
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
      fetch(baseUrl)
        .then(function (res) {
          if (!res.ok) throw new Error('falhou');
          return res.json();
        })
        .then(function (data) {
          localStorage.setItem(storageKey, '1');
          btn.setAttribute('aria-pressed', 'true');
          btn.classList.add('is-liked');
          countEl.textContent = data.value || (parseInt(countEl.textContent, 10) || 0) + 1;
        })
        .catch(function () {
          // silencioso: curtida é algo leve, não vale interromper a leitura com erro
        })
        .finally(function () {
          btn.disabled = false;
        });
    });
  }

  /** Busca a contagem de visualizações de um slug, SEM incrementar. */
  function fetchViewCount(slug) {
    return fetch(urlDe('view', slug) + '?readOnly=true')
      .then(function (res) { return res.json(); })
      .then(function (data) { return data.value || 0; });
  }

  /** Incrementa e retorna a nova contagem de visualizações de um slug. */
  function incrementViewCount(slug) {
    return fetch(urlDe('view', slug))
      .then(function (res) { return res.json(); })
      .then(function (data) { return data.value || 1; });
  }

  // API pública deste módulo
  return {
    initLikeButton: initLikeButton,
    fetchViewCount: fetchViewCount,
    incrementViewCount: incrementViewCount
  };
})();
