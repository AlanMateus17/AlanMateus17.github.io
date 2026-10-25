/*
 * sw.js — service worker: deixa o site abrir mais rápido e funcionar offline.
 *
 * Regras (v4):
 *  - Só mexe em pedidos GET do PRÓPRIO site. Scripts e APIs de fora
 *    (MailerLite, CounterAPI, GitHub, Formspree…) passam direto, sem cache —
 *    antes, quando um deles falhava (bloqueador de anúncio, sem sinal),
 *    o SW devolvia o HTML da página 404 no lugar do script e a página quebrava.
 *  - Arquivos de /_next/static/ têm nome único por versão: cache primeiro.
 *  - Páginas: rede primeiro; sem internet, usa a cópia salva da página
 *    (ou a Home); o 404.html só é usado para páginas, nunca para scripts.
 *  - O resto (ícones, imagens, vCard…): usa o cache e atualiza em segundo plano.
 */
const VERSION = 'alanmateus-v4';
const STATIC = VERSION + '-static';
const PAGES = VERSION + '-pages';
const PRECACHE = ['/', '/404.html', '/manifest.json', '/assets/icons/icon-192.png'];
const MAX_PAGES = 40;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(PAGES).then((c) => c.addAll(PRECACHE)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function trim(cacheName, max) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // serviços de fora: o navegador resolve sozinho
  if (url.pathname.startsWith('/admin')) return;

  // Arquivos versionados do Next: cache primeiro
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(STATIC).then((c) => c.put(req, copy));
            }
            return res;
          })
      )
    );
    return;
  }

  // Páginas (navegação): rede primeiro, cópia salva se estiver offline
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(PAGES).then((c) => c.put(req, copy).then(() => trim(PAGES, MAX_PAGES)));
          }
          return res;
        })
        .catch(() =>
          caches.match(req).then((hit) => hit || caches.match('/').then((home) => home || caches.match('/404.html')))
        )
    );
    return;
  }

  // Dados de navegação do Next (?_rsc=…): só rede — se falhar, o Next recarrega a página sozinho
  if (url.searchParams.has('_rsc')) return;

  // Demais arquivos do site: cache e atualiza em segundo plano
  event.respondWith(
    caches.open(STATIC).then((cache) =>
      cache.match(req).then((hit) => {
        const net = fetch(req)
          .then((res) => {
            if (res.ok) cache.put(req, res.clone());
            return res;
          })
          .catch(() => hit || Response.error());
        return hit || net;
      })
    )
  );
});
