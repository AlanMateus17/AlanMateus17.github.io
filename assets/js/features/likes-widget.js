/*
 * features/likes-widget.js — liga os botões de curtir do site ao
 * core/counter-widget.js. Dois casos nesta mesma página (cada um só
 * roda se encontrar o elemento correspondente):
 *
 *   1) O botão de curtir de UM post (#like-btn, no rodapé do artigo).
 *      A chave usada é o próprio slug do post.
 *   2) Os botões de curtir de CADA projeto do portfólio (.project-like-btn).
 *      A chave já vem pronta no atributo data-like-key de cada botão.
 */

// --- Curtida do post (um botão só por página) ---
(function () {
  var btn = document.getElementById('like-btn');
  if (!btn) return;
  var countEl = document.getElementById('like-count');
  var slug = btn.dataset.slug;

  window.AMCounter.initLikeButton({ btn: btn, key: slug, countEl: countEl });
})();

// --- Curtidas dos cards do Portfólio (vários botões na mesma página) ---
(function () {
  var botoes = document.querySelectorAll('.project-like-btn');
  if (!botoes.length) return;

  botoes.forEach(function (btn) {
    var key = btn.getAttribute('data-like-key');
    var countEl = btn.querySelector('.project-like-btn__count');
    window.AMCounter.initLikeButton({ btn: btn, key: key, countEl: countEl });
  });
})();
