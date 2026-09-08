/**
 * === core/navigation.js ===
 * Tudo relacionado à barra de navegação do topo: transparência sobre o
 * hero, o menu "hambúrguer" no celular, e o destaque do link da seção atual.
 */

// --- Navegação: transparente sobre o hero, sólida ao rolar a página ---
(function () {
  var nav = document.querySelector('.nav');
  if (!nav) return;

  var hero = document.querySelector('.hero, .page-hero, .post-hero');
  if (hero) nav.classList.add('on-hero');

  function atualizar() {
    var scrolled = window.scrollY > 40;
    nav.classList.toggle('scrolled', scrolled);
  }
  window.addEventListener('scroll', atualizar, { passive: true });
  atualizar();
})();

// --- Menu mobile (abre/fecha, e fecha sozinho ao clicar num link) ---
(function () {
  var toggle = document.querySelector('.nav__toggle');
  var links = document.querySelector('.nav__links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', function () {
    var open = toggle.classList.toggle('open');
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });

  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      toggle.classList.remove('open');
      links.classList.remove('open');
    });
  });
})();

// --- Destaca o link da página atual no menu ---
(function () {
  var path = window.location.pathname;
  document.querySelectorAll('.nav__link').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href !== '/' && path.startsWith(href)) {
      a.classList.add('active');
    }
  });
})();

// --- Botão "voltar ao topo" (aparece depois de rolar bastante, em qualquer página) ---
(function () {
  var btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', function () {
    btn.hidden = window.scrollY < 500;
  });
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
