/**
 * === features/quiz.js ===
 * Motor do quiz que aparece no fim de alguns posts (`_includes/quiz-post.html`).
 *
 * Os dados que só existem em tempo de build no Jekyll (slug do post, título,
 * ID do Formspree) chegam aqui via atributos `data-*` no container
 * `#quiz-post` — não por uma chamada de função inline, porque este arquivo
 * carrega com `defer` (só executa depois que a página inteira já carregou),
 * então um `<script>` inline mais acima no HTML rodaria ANTES deste arquivo
 * sequer existir. Ler os dados do próprio DOM evita esse problema de ordem.
 */
(function () {
  var container = document.getElementById('quiz-post');
  if (!container) return;

  var slug = container.getAttribute('data-post-slug');
  var titulo = container.getAttribute('data-post-title');
  var formspreeId = container.getAttribute('data-formspree-id');
  var CHAVE_QUIZ = 'quizzes-concluidos';

  var concluidos = JSON.parse(localStorage.getItem(CHAVE_QUIZ) || '[]');
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
    localStorage.setItem(CHAVE_QUIZ, JSON.stringify(concluidos));

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
