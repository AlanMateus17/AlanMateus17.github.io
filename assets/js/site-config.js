---
# Este arquivo TEM front matter (as três linhas de traço acima e abaixo),
# mesmo sendo um .js. É assim que se avisa o Jekyll: "processe este arquivo
# com Liquid antes de publicar", exatamente como ele já faz com os .html.
# Sem essas linhas, o Jekyll copiaria o arquivo sem processar o {{ }} abaixo.
---
/*
 * site-config.js — ponte entre o _config.yml e o JavaScript do site.
 *
 * Por quê existe: alguns valores (namespace do CounterAPI, ID do Formspree)
 * ficam configurados em _config.yml, não no código. Só o Jekyll (que roda
 * no build, não no navegador) consegue ler o _config.yml. Este arquivo
 * usa Liquid ({{ site.xxx }}) pra "imprimir" esses valores como um objeto
 * JavaScript comum, que os outros arquivos de assets/js podem usar.
 *
 * Precisa ser o PRIMEIRO <script> carregado (antes de qualquer outro
 * assets/js), porque os outros dependem de window.AM_CONFIG já existir.
 */
window.AM_CONFIG = {
  // Namespace usado pelo CounterAPI (contador de curtidas e visualizações).
  // Definido uma única vez em _config.yml -> counterapi_namespace.
  counterApiNamespace: {{ site.counterapi_namespace | jsonify }},

  // ID do formulário do Formspree usado no formulário de comentários.
  formspreeId: {{ site.formspree_id | jsonify }},

  // ID do formulário do Formspree usado quando alguém conclui um quiz.
  // Enquanto não for configurado em _config.yml, vem como "SEU_ID_AQUI"
  // e o código em features/quiz.js sabe que isso significa "recurso desligado".
  formspreeQuizId: {{ site.formspree_quiz_id | jsonify }}
};
