const API_KEY = `zHrUsAYXvCDsygrhtoBqRoBAvbgHm9UvpLJ87w1c`;
const API_URL = `https://quizapi.io/api/v1/questions?apiKey=${API_KEY}`;
let totalLife = 3;
let score = 0;
let scoreText = document.getElementById('score');
scoreText.innerHTML = score;
//Função para buscar as questôes na API
function getQuestions(qtdQuestions, difficulty, category) {
  let FINAL_URL = `${API_URL}&limit=${qtdQuestions}`;
  if (difficulty) {
    FINAL_URL = FINAL_URL.concat(`&difficulty=${difficulty}`);
  }
  if (category) {
    FINAL_URL = FINAL_URL.concat(`&category=${category}`);
  }
  return (
    fetch(FINAL_URL)
      // the JSON body is taken from the response
      .then((res) => res.json())
      .then((res) => {
        // The response has an `any` type, so we need to cast
        // it to the `User` type, and return it from the promise
        return res;
      })
  );
}

const question = document.getElementById('question');
const opt1 = document.getElementById('opt1');
const opt2 = document.getElementById('opt2');
const opt3 = document.getElementById('opt3');
const opt4 = document.getElementById('opt4');
const opt5 = document.getElementById('opt5');
const opt6 = document.getElementById('opt6');

let fetchedQuestion = null;
let difficultyValue = undefined;
getAndPopulate();

function getAndPopulate() {
  setDifficultyValue();
  getQuestions(1, difficultyValue, undefined).then((questions) => {
    fetchedQuestion = questions[0];
    console.log(fetchedQuestion);
    populateQuestionAndAnswers();
  });
}

function setDifficultyValue() {
  if (localStorage.getItem('difficulty')) {
    difficultyValue = localStorage.getItem('difficulty');
    if (difficultyValue === 'any') {
      difficultyValue = undefined;
    }
  }
}

function populateQuestionAndAnswers() {
  //POPULA RESPOSTAS COM TEXTO E MOSTRA A DIV DA RESPOSTA
  //POPULA QUESTAO COM TEXTO
  question.innerHTML = fetchedQuestion.question.toString();
  let answers = fetchedQuestion.answers;

  hideAnswers();
  clearColors();
  document.getElementById('answer-text').innerHTML = '';

  if (answers.answer_a) {
    opt1.parentElement.style.display = 'block';
    opt1.innerHTML = answers.answer_a
      .toString()
      .replace('<', '&lt;')
      .replace('>', '&gt;');
  }
  if (answers.answer_b) {
    opt2.parentElement.style.display = 'block';
    opt2.innerHTML = answers.answer_b
      .toString()
      .replace('<', '&lt;')
      .replace('>', '&gt;');
  }
  if (answers.answer_c) {
    opt3.parentElement.style.display = 'block';
    opt3.innerHTML = answers.answer_c
      .toString()
      .replace('<', '&lt;')
      .replace('>', '&gt;');
  }
  if (answers.answer_d) {
    opt4.parentElement.style.display = 'block';
    opt4.innerHTML = answers.answer_d
      .toString()
      .replace('<', '&lt;')
      .replace('>', '&gt;');
  }
  if (answers.answer_e) {
    opt5.parentElement.style.display = 'block';
    opt5.innerHTML = answers.answer_e
      .toString()
      .replace('<', '&lt;')
      .replace('>', '&gt;');
  }
  if (answers.answer_f) {
    opt6.parentElement.style.display = 'block';
    opt6.innerHTML = answers.answer_f
      .toString()
      .replace('<', '&lt;')
      .replace('>', '&gt;');
  }
}

function hideAnswers() {
  opt1.parentElement.style.display = 'none';
  opt2.parentElement.style.display = 'none';
  opt3.parentElement.style.display = 'none';
  opt4.parentElement.style.display = 'none';
  opt5.parentElement.style.display = 'none';
  opt6.parentElement.style.display = 'none';
}

//Funções de seleção da resposta

let selectedAnswer;

function selectOpt1() {
  clearColors();
  opt1.parentElement.style.backgroundColor = 'var(--yellow)';
  opt1.style.backgroundColor = 'var(--yellow)';
  selectedAnswer = 'answer_a_correct';
}

function selectOpt2() {
  clearColors();
  opt2.parentElement.style.backgroundColor = 'var(--yellow)';
  opt2.style.backgroundColor = 'var(--yellow)';
  selectedAnswer = 'answer_b_correct';
}

function selectOpt3() {
  clearColors();
  opt3.parentElement.style.backgroundColor = 'var(--yellow)';
  opt3.style.backgroundColor = 'var(--yellow)';
  selectedAnswer = 'answer_c_correct';
}

function selectOpt4() {
  clearColors();
  opt4.parentElement.style.backgroundColor = 'var(--yellow)';
  opt4.style.backgroundColor = 'var(--yellow)';
  selectedAnswer = 'answer_d_correct';
}

function selectOpt5() {
  clearColors();
  opt5.parentElement.style.backgroundColor = 'var(--yellow)';
  opt5.style.backgroundColor = 'var(--yellow)';
  selectedAnswer = 'answer_e_correct';
}

function selectOpt6() {
  clearColors();
  opt6.parentElement.style.backgroundColor = 'var(--yellow)';
  opt6.style.backgroundColor = 'var(--yellow)';
  selectedAnswer = 'answer_f_correct';
}
let skipCount = 0;
function skip() {
  skipCount++;
  document.getElementById(`skipButton`).innerHTML = `Skip (${3 - skipCount})`;
  getAndPopulate();
  if (skipCount >= 3) {
    document.getElementById(`skipButton`).disabled = 'true';
  }
}

function answer() {
  if (selectedAnswer != null) {
    if (fetchedQuestion.correct_answers[selectedAnswer] == 'true') {
      changeColorCorrect(selectedAnswer);
      document.getElementById('answer-text').innerHTML = 'CORRECT ANSWER!';
      document.getElementById('answer-text').style.color = 'var(--green)';
      changeScore();
      selectedAnswer = null;
      getAndPopulate();
    } else {
      changeColorWrong(selectedAnswer);
      document.getElementById('answer-text').innerHTML = 'WRONG ANSWER!';
      document.getElementById('answer-text').style.color = 'var(--red)';
      selectedAnswer = null;
      changeLife();
    }
  }
}

function clearColors() {
  opt1.parentElement.style.backgroundColor = 'var(--base3)';
  opt1.style.backgroundColor = 'var(--base3)';

  opt2.parentElement.style.backgroundColor = 'var(--base3)';
  opt2.style.backgroundColor = 'var(--base3)';

  opt3.parentElement.style.backgroundColor = 'var(--base3)';
  opt3.style.backgroundColor = 'var(--base3)';

  opt4.parentElement.style.backgroundColor = 'var(--base3)';
  opt4.style.backgroundColor = 'var(--base3)';

  opt5.parentElement.style.backgroundColor = 'var(--base3)';
  opt5.style.backgroundColor = 'var(--base3)';

  opt6.parentElement.style.backgroundColor = 'var(--base3)';
  opt6.style.backgroundColor = 'var(--base3)';
}

function changeColorCorrect(selectedAnswerArg) {
  switch (selectedAnswerArg) {
    case 'answer_a_correct':
      opt1.parentElement.style.backgroundColor = 'var(--green)';
      opt1.style.backgroundColor = 'var(--green)';
      break;
    case 'answer_b_correct':
      opt2.parentElement.style.backgroundColor = 'var(--green)';
      opt2.style.backgroundColor = 'var(--green)';
      break;
    case 'answer_c_correct':
      opt3.parentElement.style.backgroundColor = 'var(--green)';
      opt3.style.backgroundColor = 'var(--green)';
      break;
    case 'answer_d_correct':
      opt4.parentElement.style.backgroundColor = 'var(--green)';
      opt4.style.backgroundColor = 'var(--green)';
      break;
    case 'answer_e_correct':
      opt5.parentElement.style.backgroundColor = 'var(--green)';
      opt5.style.backgroundColor = 'var(--green)';
      break;
    case 'answer_f_correct':
      opt6.parentElement.style.backgroundColor = 'var(--green)';
      opt6.style.backgroundColor = 'var(--green)';
      break;

    default:
      break;
  }
}

function changeColorWrong(selectedAnswerArg) {
  switch (selectedAnswerArg) {
    case 'answer_a_correct':
      opt1.parentElement.style.backgroundColor = 'var(--red)';
      opt1.style.backgroundColor = 'var(--red)';
      break;
    case 'answer_b_correct':
      opt2.parentElement.style.backgroundColor = 'var(--red)';
      opt2.style.backgroundColor = 'var(--red)';
      break;
    case 'answer_c_correct':
      opt3.parentElement.style.backgroundColor = 'var(--red)';
      opt3.style.backgroundColor = 'var(--red)';
      break;
    case 'answer_d_correct':
      opt4.parentElement.style.backgroundColor = 'var(--red)';
      opt4.style.backgroundColor = 'var(--red)';
      break;
    case 'answer_e_correct':
      opt5.parentElement.style.backgroundColor = 'var(--red)';
      opt5.style.backgroundColor = 'var(--red)';
      break;
    case 'answer_f_correct':
      opt6.parentElement.style.backgroundColor = 'var(--red)';
      opt6.style.backgroundColor = 'var(--red)';
      break;

    default:
      break;
  }
}

function changeScore() {
  score += 10;
  scoreText.innerHTML = score;
}

function changeLife() {
  totalLife--;
  switch (totalLife) {
    case 2:
      document.getElementById('heart3').style.color = 'var(--text-color)';
      break;
    case 1:
      document.getElementById('heart2').style.color = 'var(--text-color)';
      break;
    case 0:
      document.getElementById('heart1').style.color = 'var(--text-color)';
      break;
    default:
      break;
  }
  if (totalLife <= 0) {
    document.getElementById('answer-text').innerHTML = 'GAME OVER!';
    document.getElementById('again').style.display = 'block';
    document.getElementById('answerButton').disabled = true;
    document.getElementById('skipButton').disabled = true;
    opt1.disabled = true;
    opt2.disabled = true;
    opt3.disabled = true;
    opt4.disabled = true;
    opt5.disabled = true;
    opt6.disabled = true;
  } else {
    getAndPopulate();
  }
}
