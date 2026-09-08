/*
 * features/comments.js — três responsabilidades da seção de comentários
 * de um post:
 *
 *   1) Contador de caracteres restantes no campo de mensagem.
 *   2) Botões "Responder" (preenche o campo escondido "parent" com o id
 *      do comentário respondido, pra virar uma resposta em thread quando
 *      você publicar manualmente — veja README-COMENTARIOS.md) e o botão
 *      "Ver comentário completo" (comentários muito longos começam
 *      recolhidos).
 *   3) Curtidas de cada comentário — reaproveita core/counter-widget.js,
 *      igual ao botão de curtir do post.
 *   4) Envio do formulário pro Formspree (que manda um e-mail pra você;
 *      a publicação de fato é manual, como o README explica).
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
  var counter = document.getElementById('comment-form-counter');
  var LIMITE = 1000;

  // --- Contador de caracteres ---
  function atualizarContador() {
    var restantes = LIMITE - textarea.value.length;
    counter.textContent = restantes + ' caracteres restantes';
    counter.classList.toggle('comment-form__counter--perto', restantes <= 100);
  }
  textarea.addEventListener('input', atualizarContador);
  atualizarContador();

  // --- Botão "Responder" em cada comentário ---
  document.querySelectorAll('.comment__reply-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      parentInput.value = btn.getAttribute('data-comment-id');
      replyingName.textContent = btn.getAttribute('data-comment-name');
      replyingBox.hidden = false;
      submitBtn.textContent = 'Enviar resposta';
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      textarea.focus();
    });
  });

  cancelReply.addEventListener('click', function (e) {
    e.preventDefault();
    parentInput.value = '';
    replyingBox.hidden = true;
    submitBtn.textContent = 'Enviar comentário';
  });

  // --- "Ver comentário completo" nos comentários longos ---
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
    window.AMCounter.initLikeButton({ btn: btn, key: key, countEl: countEl });
  });

  // --- Envio do formulário (via Formspree) ---
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
