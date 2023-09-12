const GAME_TIME = 10;
let score = 0;
let time = GAME_TIME;
let isPlaying = false;
let timeInterval;
let checkInterval;
let words = [];

const wordInput = document.querySelector(".word-input");
const wordDisplay = document.querySelector(".word-display");
const scoreDisplay = document.querySelector(".score");
const timeDisplay = document.querySelector(".time");
const button = document.querySelector(".button");
const image = document.querySelector(".typingImage");

function init() {
  buttonChange("게임로딩중...");
  getWords();
  wordInput.addEventListener("input", (e) => checkMatch(e));
}

function run() {
  image.remove();
  if (isPlaying) return;
  wordInput.removeAttribute("disabled");
  isPlaying = true;
  time = GAME_TIME;
  timeDisplay.innerText = 0;
  wordInput.focus();
  makeWords();
  buttonChange("게임중");
  timeInterval = setInterval(countDown, 1000);
  checkInterval = setInterval(checkStatus, 50);
}

function checkMatch(e) {
  if (e.target.value === wordDisplay.innerText.toLowerCase()) {
    wordInput.value = "";
    if (!isPlaying) return;
    score += 10;
    time = GAME_TIME;
    scoreDisplay.innerText = score;
    makeWords();
  }

  const textLength = e.target.value.length;
  // 매칭 실패시
  if (e.target.value !== wordDisplay.innerText.slice(0, textLength)) {
    score--;
    scoreDisplay.innerText = score;
    wordDisplay.style.color = "#ff0000";
    setTimeout(() => {
      wordDisplay.style.color = "#3b5999";
    }, 500);
  }
}

function makeWords() {
  const randomIndex = Math.floor(Math.random() * words.length);
  wordDisplay.innerText = words[randomIndex];
}

function checkStatus() {
  if (!isPlaying && time === 0) {
    wordDisplay.innerText = "GAME OVER";
    wordInput.value = "";
    wordInput.setAttribute("disabled", "");
    buttonChange("게임시작");
    clearInterval(checkInterval);
  }
}

function getWords() {
  axios
    .get("https://random-word-api.herokuapp.com/word?number=100")
    .then(function (response) {
      words = response.data;
      buttonChange("게임시작");
    })
    .catch(function (error) {
      console.log(error);
    });
}

function countDown() {
  time > 0 ? time-- : (isPlaying = false);
  if (!isPlaying) clearInterval(timeInterval);
  timeDisplay.innerText = time;
}

function buttonChange(text) {
  button.innerText = text;
  text === "게임시작"
    ? button.classList.remove("loading")
    : button.classList.add("loading");
}

init();
