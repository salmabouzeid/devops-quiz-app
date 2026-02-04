// app.js
let data = [];
let current = 0;
let topic = '';
let filteredQuestions = [];

fetch('data/questions.json')
  .then(r => r.json())
  .then(q => {
    data = q;
    initTopic();
  });

function initTopic() {
  const sel = document.getElementById('topicSelect');
  const topics = [...new Set(data.map(q => q.topic))];

  topics.forEach(t => sel.add(new Option(t, t)));

  sel.onchange = () => {
    topic = sel.value;
    startQuiz();
  };
}

function startQuiz() {
  filteredQuestions = data.filter(q => q.topic === topic);
  current = 0;
  showQuestion();
}

function showQuestion() {
  if (current >= filteredQuestions.length) {
    document.getElementById('quizBox').classList.add('hidden');
    return;
  }

  const q = filteredQuestions[current];
  document.getElementById('question').textContent = q.question;

  const optDiv = document.getElementById('options');
  optDiv.innerHTML = '';

  q.options.forEach((o, i) => {
    const btn = document.createElement('button');
    btn.textContent = o;
    btn.onclick = () => check(i, q);
    optDiv.appendChild(btn);
  });

  document.getElementById('quizBox').classList.remove('hidden');
}

function check(idx, q) {
  const fb = document.getElementById('feedback');
  const buttons = document.querySelectorAll('#options button');

  buttons.forEach(b => b.disabled = true);

  if (idx === q.answerIndex) {
    fb.textContent = 'Correct! ' + q.explanation;
    fb.className = 'correct';
  } else {
    fb.textContent = 'Incorrect. ' + q.explanation;
    fb.className = 'incorrect';
  }

  current++;
  setTimeout(() => {
    fb.textContent = '';
    fb.className = '';
    showQuestion();
  }, 1500);
}
