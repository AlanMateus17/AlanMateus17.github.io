/*
 * features/quiz.js — quiz de múltipla escolha que aparece no fim de
 * alguns posts (só quando o post tem "quiz:" no front matter — veja
 * _includes/quiz-post.html). Ao acertar todas as perguntas, oferece
 * avisar o professor por e-mail (Formspree) com o nome de quem terminou.
 *
 * Os dados de cada pergunta (índice e resposta certa) vêm em atributos
 * data-* no próprio HTML de cada pergunta, gerados pelo Jekyll a partir
 * do front matter do post. O slug do post, o título e o ID do Formspree
 * vêm em atributos data-* no container principal (#quiz-post).
 */
(function () {
  var container = document.getElementById('quiz-post');
  if (!container) return;

  var slug = container.dataset.slug;
  var titulo = container.dataset.titulo;
  var formspreeId = container.dataset.formspreeId;
  var chaveQuiz = 'quizzes-concluidos';

  // Se esse quiz já foi concluído antes (guardado no navegador), nem
  // mostra as perguntas de novo — só a mensagem de "já concluído".
  var concluidos = JSON.parse(localStorage.getItem(chaveQuiz) || '[]');
  if (concluidos.indexOf(slug) !== -1) {
    document.getElementById('quiz-post-perguntas').hidden = true;
    document.getElementById('quiz-post-concluido').hidden = false;
    return;
  }

  var perguntas = container.querySelectorAll('.quiz-post__pergunta');
  var respondidasCorretamente = {};

  perguntas.forEach(function (pergunta) {
    var indice = pergunta.dataset.indice;
    var correta = parseInt(pergunta.dataset.correta, 10);
    var botoes = pergunta.querySelectorAll('.quiz-post__opcao');
    var feedback = pergunta.querySelector('.quiz-post__feedback');

    botoes.forEach(function (botao) {
      botao.addEventListener('click', function () {
        var escolhida = parseInt(botao.dataset.opcao, 10);
        botoes.forEach(function (b) { b.disabled = true; });

        if (escolhida === correta) {
          botao.classList.add('quiz-post__opcao--certa');
          feedback.textContent = 'Certinho!';
          feedback.className = 'quiz-post__feedback quiz-post__feedback--certa';
          respondidasCorretamente[indice] = true;
        } else {
          botao.classList.add('quiz-post__opcao--errada');
          botoes[correta].classList.add('quiz-post__opcao--certa');
          feedback.textContent = 'Não foi dessa vez — a certa está destacada.';
          feedback.className = 'quiz-post__feedback quiz-post__feedback--errada';
          respondidasCorretamente[indice] = false;
        }
        feedback.hidden = false;

        var todasRespondidas = perguntas.length === Object.keys(respondidasCorretamente).length;
        var todasCertas = todasRespondidas && Object.values(respondidasCorretamente).every(function (v) { return v; });
        if (todasCertas) {
          document.getElementById('quiz-post-nome-form').hidden = false;
        }
      });
    });
  });

  document.getElementById('quiz-post-enviar').addEventListener('click', function () {
    var nome = document.getElementById('quiz-post-nome').value.trim();
    var status = document.getElementById('quiz-post-status');

    concluidos.push(slug);
    localStorage.setItem(chaveQuiz, JSON.stringify(concluidos));

    // Se não tiver nome, ou o Formspree do quiz ainda não estiver
    // configurado em _config.yml, só marca como concluído e pronto —
    // sem tentar avisar ninguém por e-mail.
    if (!nome || !formspreeId || formspreeId === 'SEU_ID_AQUI') {
      document.getElementById('quiz-post-nome-form').hidden = true;
      document.getElementById('quiz-post-concluido').hidden = false;
      return;
    }

    status.textContent = 'Enviando...';

    var dados = new FormData();
    dados.append('nome', nome);
    dados.append('post', titulo);
    dados.append('mensagem', nome + ' concluiu o quiz do post: ' + titulo);

    fetch('https://formspree.io/f/' + formspreeId, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: dados
    }).then(function () {
      document.getElementById('quiz-post-nome-form').hidden = true;
      document.getElementById('quiz-post-concluido').hidden = false;
    }).catch(function () {
      status.textContent = 'Não deu pra avisar o professor agora, mas seu progresso foi salvo.';
      setTimeout(function () {
        document.getElementById('quiz-post-nome-form').hidden = true;
        document.getElementById('quiz-post-concluido').hidden = false;
      }, 1500);
    });
  });
})();
