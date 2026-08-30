/* === ALAN MATEUS — Site JS === */

// --- Navegação: transparente no hero, sólida ao scroll ---
(function() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const hero = document.querySelector('.hero, .page-hero, .post-hero');
  if (hero) nav.classList.add('on-hero');

  const update = () => {
    const scrolled = window.scrollY > 40;
    nav.classList.toggle('scrolled', scrolled);
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// --- Menu mobile ---
(function() {
  const toggle = document.querySelector('.nav__toggle');
  const links  = document.querySelector('.nav__links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = toggle.classList.toggle('open');
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });

  // Fechar ao clicar num link
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      links.classList.remove('open');
    });
  });
})();

// --- Efeito typewriter no hero ---
(function() {
  const el = document.querySelector('.hero__typewriter .text');
  if (!el) return;

  const phrases = [
    'Desenvolvedor .NET / C#',
    'Professor de Informática — EMTI',
    'Construindo o ecossistema Aura',
    'Red Team em formação (eJPT → OSCP)',
    'Fundador do Grupo AMtech Digital',
    'Aprendendo em público'
  ];

  let phraseIdx = 0, charIdx = 0, deleting = false, pause = false;

  const type = () => {
    if (pause) return;
    const phrase = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = phrase.slice(0, ++charIdx);
      if (charIdx === phrase.length) {
        pause = true;
        setTimeout(() => { deleting = true; pause = false; }, 2200);
      }
    } else {
      el.textContent = phrase.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? 45 : 80);
  };
  type();
})();

// --- Animações de entrada ao scroll ---
(function() {
  const items = document.querySelectorAll('.fade-in');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    }),
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  items.forEach(el => observer.observe(el));
})();

// --- Barra de progresso de leitura (posts) ---
(function() {
  const bar = document.querySelector('.reading-progress');
  const body = document.querySelector('.post-body');
  if (!bar || !body) return;

  const update = () => {
    const rect = body.getBoundingClientRect();
    const total = body.offsetHeight - window.innerHeight;
    const read = Math.max(0, -rect.top);
    bar.style.width = Math.min(100, (read / total) * 100) + '%';
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// --- Filtros do portfólio ---
(function() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.sistema-card');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.status === filter;
        card.style.display = match ? '' : 'none';
      });
    });
  });
})();

// --- Contador animado nas estatísticas ---
(function() {
  const nums = document.querySelectorAll('.stat__num[data-target]');
  if (!nums.length) return;

  const observer = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      let start = 0;
      const step = Math.ceil(target / 40);
      const timer = setInterval(() => {
        start = Math.min(start + step, target);
        el.textContent = start + suffix;
        if (start >= target) clearInterval(timer);
      }, 35);
      observer.unobserve(el);
    }),
    { threshold: 0.5 }
  );

  nums.forEach(el => observer.observe(el));
})();

// --- Highlight de link ativo na navegação ---
(function() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav__link').forEach(a => {
    const href = a.getAttribute('href');
    if (href !== '/' && path.startsWith(href)) {
      a.classList.add('active');
    }
  });
})();

// --- Copiar bloco de código ao clicar ---
(function() {
  document.querySelectorAll('pre').forEach(pre => {
    const btn = document.createElement('button');
    btn.textContent = 'Copiar';
    btn.style.cssText = 'position:absolute;top:0.75rem;right:0.75rem;padding:0.25rem 0.6rem;font-size:0.7rem;border-radius:4px;background:rgba(255,255,255,0.1);color:rgba(255,255,255,0.7);cursor:pointer;border:1px solid rgba(255,255,255,0.15);font-family:var(--font-mono)';
    pre.style.position = 'relative';
    pre.appendChild(btn);
    btn.addEventListener('click', () => {
      const code = pre.querySelector('code');
      navigator.clipboard.writeText(code ? code.textContent : pre.textContent).then(() => {
        btn.textContent = 'Copiado!';
        btn.style.color = '#00C2A8';
        setTimeout(() => { btn.textContent = 'Copiar'; btn.style.color = 'rgba(255,255,255,0.7)'; }, 1800);
      });
    });
  });
})();
