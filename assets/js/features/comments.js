/**
 * === features/comments.js ===
 * Tudo que acontece no formulário e na lista de comentários
 * (`_includes/comments.html`):
 *  - contador de caracteres restantes no textarea;
 *  - clicar em "Responder" preenche o campo oculto `parent` (pra virar
 *    uma resposta em thread — ver README-COMENTARIOS.md);
 *  - "Ver comentário completo" em comentários longos;
 *  - curtidas por comentário (via `AMSite.counter`, o mesmo módulo usado
 *    pelas curtidas de post e de portfólio);
 *  - envio do formulário pro Formspree, sem recarregar a página.
 */
(function () {
  var form = document.getElementById('comment-form');
  if (!form) return;

  var status = document.getElementById('comment-form-status');
  var parentInput = document.getElementById('comment-form-parent');
  var replyingBox = document.getElementById('comment-form-replying');
  var replyingName = document.getElementById('comment-form-replying-name');
  var submitBtn = document.getElementById('comment-form-submit');
  var cancelReply = document.getElementById('comment-form-cancel-reply');
  var textarea = document.getElementById('cf-message');
  var contador = document.getElementById('comment-form-counter');
  var LIMITE = 1000;

  function atualizarContador() {
    var restantes = LIMITE - textarea.value.length;
    contador.textContent = restantes + ' caracteres restantes';
    contador.classList.toggle('comment-form__counter--perto', restantes <= 100);
  }
  textarea.addEventListener('input', atualizarContador);
  atualizarContador();

  // --- Responder a um comentário específico (preenche o campo "parent") ---
  document.querySelectorAll('.comment__reply-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      parentInput.value = btn.getAttribute('data-comment-id');
      replyingName.textContent = btn.getAttribute('data-comment-name');
      replyingBox.hidden = false;
      submitBtn.textContent = 'Enviar resposta';
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      document.getElementById('cf-message').focus();
    });
  });

  cancelReply.addEventListener('click', function (e) {
    e.preventDefault();
    parentInput.value = '';
    replyingBox.hidden = true;
    submitBtn.textContent = 'Enviar comentário';
  });

  // --- Expandir comentários longos ---
  document.querySelectorAll('.comment__toggle-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var alvo = document.getElementById(btn.getAttribute('data-target'));
      var recolhido = alvo.classList.toggle('comment__body--collapsed');
      btn.textContent = recolhido ? 'Ver comentário completo' : 'Ver menos';
    });
  });

  // --- Curtidas individuais de cada comentário ---
  document.querySelectorAll('.comment__like-btn').forEach(function (btn) {
    var key = btn.getAttribute('data-like-key');
    var countEl = btn.querySelector('.comment__like-count');
    AMSite.counter.ligarBotaoCurtir(btn, countEl, key);
  });

  // --- Envio do formulário (Formspree, sem recarregar a página) ---
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.hidden = false;
    status.textContent = 'Enviando...';
    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    }).then(function (res) {
      if (res.ok) {
        status.textContent = 'Comentário enviado! Ele aparece aqui assim que for aprovado.';
        form.reset();
        parentInput.value = '';
        replyingBox.hidden = true;
        submitBtn.textContent = 'Enviar comentário';
      } else {
        return res.json().then(function (data) {
          throw new Error((data && data.error) || 'Erro ao enviar');
        });
      }
    }).catch(function (err) {
      status.textContent = 'Não deu pra enviar agora (' + err.message + '). Tenta de novo em instantes.';
    });
  });
})();
