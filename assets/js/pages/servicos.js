/*
 * pages/servicos.js — envio do formulário de orçamento (seção
 * #orcamento da página /servicos/) via Formspree, com feedback de
 * status pro usuário (mesmo padrão usado no formulário de comentários
 * e no quiz — mas cada um mora no seu próprio arquivo porque cada
 * formulário tem campos e regras diferentes).
 */
(function () {
  var form = document.getElementById('orcamento-form');
  if (!form) return;
  var status = document.getElementById('orcamento-status');

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
        status.textContent = 'Pedido enviado! Você recebe uma resposta em breve.';
        form.reset();
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
