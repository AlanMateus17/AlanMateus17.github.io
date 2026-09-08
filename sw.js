const CACHE_NAME = 'alanmateus-v2';
const OFFLINE_URL = '/404.html';

// Arquivos essenciais pra sempre ter em cache. O JS agora está dividido em
// vários arquivos pequenos (assets/js/core, features, pages) em vez de um
// main.js só — pré-cachear cada um aqui não vale a pena (a lista mudaria
// toda vez que um arquivo novo for criado). A estratégia de "rede primeiro,
// cache como reserva" no evento fetch abaixo já cacheia sozinha qualquer
// arquivo .js conforme a pessoa navega, então só precisamos garantir aqui o
// mínimo pra abrir o site offline: a página inicial e o CSS.
const PRECACHE = [
  '/',
  '/assets/css/main.css',
  '/assets/icons/icon-192.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Estratégia: tenta a rede primeiro (conteúdo sempre atualizado quando tem
// internet); se falhar (sem sinal), usa o que já está salvo em cache.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {});
        return response;
      })
      .catch(() =>
        caches.match(event.request).then((cached) => cached || caches.match(OFFLINE_URL))
      )
  );
});
