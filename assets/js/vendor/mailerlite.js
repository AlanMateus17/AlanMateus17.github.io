/**
 * === vendor/mailerlite.js ===
 * Snippet oficial "MailerLite Universal" (carregado em toda página, no <head>
 * de `_layouts/default.html`). Não é código nosso — é o loader padrão que a
 * MailerLite fornece pra puxar o script deles de forma assíncrona.
 * O ID da conta ('2609452') é o de Alan; se a conta mudar, troca só aqui.
 */
(function (w, d, e, u, f, l, n) {
  w[f] = w[f] || function () { (w[f].q = w[f].q || []).push(arguments); };
  l = d.createElement(e); l.async = 1; l.src = u;
  n = d.getElementsByTagName(e)[0]; n.parentNode.insertBefore(l, n);
})(window, document, 'script', 'https://assets.mailerlite.com/js/universal.js', 'ml');
ml('account', '2609452');
