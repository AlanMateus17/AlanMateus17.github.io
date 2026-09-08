/*
 * core/navigation.js — tudo relacionado à barra de navegação do topo
 * e ao botão "voltar ao topo". Roda em toda página do site.
 *
 * Cada bloco abaixo é independente (uma IIFE = "Immediately Invoked
 * Function Expression", a função `(function () { ... })()` que já
 * executa sozinha). Se um bloco não encontrar o elemento que precisa
 * na página (o `if (!x) return;`), ele simplesmente não faz nada —
 * por isso este mesmo arquivo pode ser carregado em qualquer página
 * sem quebrar nada.
 */

// --- Navegação: transparente no hero, sólida ao rolar a página ---
(function () {
  var nav = document.querySelector('.nav');
  if (!nav) return;

  // Se a página tem um "hero" (banner grande no topo), a navegação
  // começa transparente por cima dele.
  var hero = document.querySelector('.hero, .page-hero, .post-hero');
  if (hero) nav.classList.add('on-hero');

  function update() {
    var scrolled = window.scrollY > 40;
    nav.classList.toggle('scrolled', scrolled);
  }
  window.addEventListener('scroll', update, { passive: true });
  update(); // roda uma vez já ao carregar, caso a página já abra rolada
})();

// --- Menu mobile (hambúrguer) ---
(function () {
  var toggle = document.querySelector('.nav__toggle');
  var links = document.querySelector('.nav__links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', function () {
    var open = toggle.classList.toggle('open');
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });

  // Fechar o menu automaticamente ao clicar em qualquer link dele
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      toggle.classList.remove('open');
      links.classList.remove('open');
    });
  });
})();

// --- Destaca o link da página atual na navegação ---
(function () {
  var path = window.location.pathname;
  document.querySelectorAll('.nav__link').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href !== '/' && path.startsWith(href)) {
      a.classList.add('active');
    }
  });
})();

// --- Botão "voltar ao topo" (aparece depois de rolar um pouco) ---
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
