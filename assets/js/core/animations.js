/*
 * core/animations.js — pequenas animações usadas em várias páginas:
 * efeito de "máquina de escrever" no hero da home, elementos que
 * aparecem suavemente ao rolar a página, e a barra de progresso
 * de leitura no topo dos posts.
 */

// --- Efeito typewriter (máquina de escrever) no hero da home ---
(function () {
  var el = document.querySelector('.hero__typewriter .text');
  if (!el) return;

  var phrases = [
    'Desenvolvedor .NET / C#',
    'Professor de Informática — EMTI',
    'Construindo o ecossistema Aura',
    'Red Team em formação (eJPT → OSCP)',
    'Fundador do Grupo AMtech Digital',
    'Aprendendo em público'
  ];

  var phraseIdx = 0, charIdx = 0, deleting = false, pause = false;

  function type() {
    if (pause) return;
    var phrase = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = phrase.slice(0, ++charIdx);
      if (charIdx === phrase.length) {
        pause = true;
        setTimeout(function () { deleting = true; pause = false; }, 2200);
      }
    } else {
      el.textContent = phrase.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? 45 : 80);
  }
  type();
})();

// --- Elementos que aparecem suavemente conforme entram na tela ---
// Basta adicionar a classe "fade-in" em qualquer elemento do HTML;
// quando ele entra na área visível, ganha a classe "visible" (o CSS
// cuida da transição — veja .fade-in em assets/css/main.css).
(function () {
  var items = document.querySelectorAll('.fade-in');
  if (!items.length) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target); // já apareceu, não precisa observar de novo
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  items.forEach(function (el) { observer.observe(el); });
})();

// --- Barra de progresso de leitura (só nas páginas de post) ---
(function () {
  var bar = document.querySelector('.reading-progress');
  var body = document.querySelector('.post-body');
  if (!bar || !body) return;

  function update() {
    var rect = body.getBoundingClientRect();
    var total = body.offsetHeight - window.innerHeight;
    var read = Math.max(0, -rect.top);
    bar.style.width = Math.min(100, (read / total) * 100) + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();
