/*
 * pages/home.js — widget "Atividade recente no GitHub" da página
 * inicial: busca os últimos commits públicos e mostra os 6 mais
 * recentes, com o tempo relativo ("há 2h", "há 3 dias"...).
 *
 * O usuário do GitHub vem do atributo data-github-user do próprio
 * container (preenchido com Liquid a partir de site.author.github em
 * _config.yml) — assim o nome de usuário só precisa existir escrito
 * num lugar do projeto inteiro.
 */
(function () {
  var container = document.getElementById('github-atividade');
  if (!container) return;
  var USUARIO_GITHUB = container.dataset.githubUser;

  function tempoRelativo(dataISO) {
    var diffMs = Date.now() - new Date(dataISO).getTime();
    var minutos = Math.floor(diffMs / 60000);
    if (minutos < 60) return 'há ' + Math.max(minutos, 1) + ' min';
    var horas = Math.floor(minutos / 60);
    if (horas < 24) return 'há ' + horas + 'h';
    var dias = Math.floor(horas / 24);
    if (dias < 30) return 'há ' + dias + ' dia' + (dias > 1 ? 's' : '');
    var meses = Math.floor(dias / 30);
    return 'há ' + meses + ' mês' + (meses > 1 ? 'es' : '');
  }

  fetch('https://api.github.com/users/' + USUARIO_GITHUB + '/events/public?per_page=30')
    .then(function (r) { if (!r.ok) throw new Error('falhou'); return r.json(); })
    .then(function (eventos) {
      var commits = [];
      eventos.forEach(function (evento) {
        if (evento.type !== 'PushEvent') return;
        var repoNome = evento.repo.name.split('/')[1];
        evento.payload.commits.forEach(function (c) {
          commits.push({
            repo: repoNome,
            mensagem: c.message.split('\n')[0],
            data: evento.created_at,
            url: 'https://github.com/' + evento.repo.name + '/commit/' + c.sha
          });
        });
      });

      if (commits.length === 0) {
        container.innerHTML = '<p class="github-atividade__vazio">Nenhuma atividade pública recente — a construção continua, só não apareceu no GitHub esta semana.</p>';
        return;
      }

      var html = commits.slice(0, 6).map(function (c) {
        return '<a href="' + c.url + '" target="_blank" rel="noopener" class="github-atividade__item">' +
          '<span class="github-atividade__repo">' + c.repo + '</span>' +
          '<span class="github-atividade__msg">' + c.mensagem + '</span>' +
          '<span class="github-atividade__tempo">' + tempoRelativo(c.data) + '</span>' +
          '</a>';
      }).join('');
      container.innerHTML = html;
    })
    .catch(function () {
      container.innerHTML = '<p class="github-atividade__vazio">Não foi possível carregar a atividade do GitHub agora.</p>';
    });
})();
