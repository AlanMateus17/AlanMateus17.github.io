/**
 * === core/animations.js ===
 * Animações puramente visuais, sem lógica de negócio: o efeito de máquina
 * de escrever no hero da home, e a revelação suave de blocos (`.fade-in`)
 * conforme a pessoa rola a página.
 */

// --- Efeito "máquina de escrever" no hero da home ---
(function () {
  var el = document.querySelector('.hero__typewriter .text');
  if (!el) return;

  var frases = [
    'Desenvolvedor .NET / C#',
    'Professor de Informática — EMTI',
    'Construindo o ecossistema Aura',
    'Red Team em formação (eJPT → OSCP)',
    'Fundador do Grupo AMtech Digital',
    'Aprendendo em público'
  ];

  var fraseIdx = 0, charIdx = 0, apagando = false, pausado = false;

  function digitar() {
    if (pausado) return;
    var frase = frases[fraseIdx];

    if (!apagando) {
      el.textContent = frase.slice(0, ++charIdx);
      if (charIdx === frase.length) {
        pausado = true;
        setTimeout(function () { apagando = true; pausado = false; }, 2200);
      }
    } else {
      el.textContent = frase.slice(0, --charIdx);
      if (charIdx === 0) {
        apagando = false;
        fraseIdx = (fraseIdx + 1) % frases.length;
      }
    }
    setTimeout(digitar, apagando ? 45 : 80);
  }
  digitar();
})();

// --- Revela elementos com a classe .fade-in conforme entram na tela ---
(function () {
  var itens = document.querySelectorAll('.fade-in');
  if (!itens.length) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  itens.forEach(function (el) { observer.observe(el); });
})();
