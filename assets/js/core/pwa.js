/*
 * core/pwa.js — transforma o site num "app instalável" (PWA).
 *
 * Duas responsabilidades bem diferentes neste arquivo:
 *
 * 1) Registrar o Service Worker (sw.js na raiz do site), que é o que
 *    permite o site funcionar parcialmente offline e ser instalado.
 *
 * 2) Controlar o botão "Instalar app" que aparece no rodapé de toda
 *    página — incluindo o caminho especial pro iOS, que não tem o
 *    aviso automático "beforeinstallprompt" que Chrome/Edge/Android têm.
 */

// --- Registra o Service Worker ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js').catch(function () {});
  });
}

// --- Botão "Instalar app" ---
(function () {
  var btn = document.getElementById('install-app-btn');
  if (!btn) return;

  var STORAGE_KEY = 'pwa-install-dismissed';
  var iosModal = document.getElementById('ios-install-modal');
  var iosClose = document.getElementById('ios-install-close');
  var iosDone = document.getElementById('ios-install-done');
  var deferredPrompt = null; // guarda o evento do navegador pra disparar depois

  function isIOS() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  }
  function isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }
  function jaInstalouOuDispensou() {
    return isStandalone() || localStorage.getItem(STORAGE_KEY) === '1';
  }
  function esconderPraSempre() {
    localStorage.setItem(STORAGE_KEY, '1');
    btn.hidden = true;
    if (iosModal) iosModal.hidden = true;
  }

  if (jaInstalouOuDispensou()) return; // já instalou (ou já disse "já instalei") — não mostra mais

  if (isIOS()) {
    // iOS não avisa quando dá pra instalar — mostra o botão direto,
    // e ao clicar explica o passo a passo manual do Safari.
    btn.hidden = false;
    btn.addEventListener('click', function () {
      iosModal.hidden = false;
    });
    if (iosClose) iosClose.addEventListener('click', function () { iosModal.hidden = true; });
    if (iosDone) iosDone.addEventListener('click', esconderPraSempre);
    if (iosModal) {
      iosModal.addEventListener('click', function (e) {
        if (e.target === iosModal) iosModal.hidden = true; // clicou no fundo escuro
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && iosModal && !iosModal.hidden) iosModal.hidden = true;
    });
    return;
  }

  // Chrome/Edge/Android: espera o navegador avisar que dá pra instalar
  window.addEventListener('beforeinstallprompt', function (e) {
    if (jaInstalouOuDispensou()) return;
    e.preventDefault();
    deferredPrompt = e;
    btn.hidden = false;
  });

  btn.addEventListener('click', function () {
    if (!deferredPrompt) return;
    btn.disabled = true;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(function (choice) {
      if (choice.outcome === 'accepted') {
        esconderPraSempre();
      } else {
        btn.hidden = true; // recusou por agora, mas pode aparecer de novo em outra visita
      }
    }).finally(function () {
      deferredPrompt = null;
      btn.disabled = false;
    });
  });

  window.addEventListener('appinstalled', esconderPraSempre);
})();
