/**
 * === core/pwa.js ===
 * Tudo relacionado a "instalar o site como app" (Progressive Web App):
 *  1) registra o Service Worker (`sw.js`), que permite funcionar parcialmente offline;
 *  2) controla o botão "Instalar app" — o fluxo é diferente em Android/Chrome
 *     (o navegador avisa quando pode instalar) e em iOS/Safari (não avisa,
 *     então mostramos instruções manuais).
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
  var deferredPrompt = null;

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
