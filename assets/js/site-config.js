/**
 * === site-config.js ===
 *
 * Este é o único lugar do JS que "conversa" com o `_config.yml` do Jekyll
 * através de atributos `data-*` no <body> (veja `_layouts/default.html`).
 *
 * Por quê assim, e não com `{{ site.x }}` direto dentro de cada arquivo .js?
 * Porque arquivos `.js` são servidos como estão, sem passar pelo motor do
 * Jekyll — só arquivos `.html` (e `.js` dentro de um front matter `---`)
 * são processados como Liquid. Então a "ponte" entre o YAML e o JS
 * precisa nascer num `.html`. Escolhemos fazer essa ponte UMA vez aqui,
 * como atributos de dados no <body>, em vez de espalhar `{{ site.x }}`
 * dentro de vários `<script>` — assim, se amanhã o namespace do CounterAPI
 * mudar, só se edita `_config.yml`, nunca um arquivo `.js`.
 *
 * Antes desse arquivo existir, a string 'alanmateus17-github-io' (o
 * namespace da conta no CounterAPI) estava copiada à mão em 5 lugares
 * diferentes, em 3 arquivos diferentes. Agora existe uma vez em
 * `_config.yml` → `counterapi_namespace`, e chega até aqui pelo
 * `data-counter-namespace` do <body>.
 */
window.AMSite = window.AMSite || {};

(function () {
  var body = document.body;

  AMSite.config = {
    counterNamespace: body.getAttribute('data-counter-namespace') || ''
  };
})();
