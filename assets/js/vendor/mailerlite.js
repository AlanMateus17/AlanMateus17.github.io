/*
 * vendor/mailerlite.js — snippet oficial "MailerLite Universal", copiado
 * direto do painel da MailerLite. Não é pra editar (se precisar trocar
 * de conta, troque só o número em ml('account', '...')). Carrega o
 * script deles de forma assíncrona e prepara a fila de comandos ml(...)
 * usada pelo formulário embutido em _includes/newsletter.html.
 */
(function (w, d, e, u, f, l, n) {
  w[f] = w[f] || function () { (w[f].q = w[f].q || []).push(arguments); };
  l = d.createElement(e);
  l.async = 1;
  l.src = u;
  n = d.getElementsByTagName(e)[0];
  n.parentNode.insertBefore(l, n);
})(window, document, 'script', 'https://assets.mailerlite.com/js/universal.js', 'ml');
ml('account', '2609452');
