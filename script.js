const quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=100";
const wordApiUrl = "https://random-word-api.herokuapp.com/word?number=100";
const quoteSection = document.querySelector("#quote");
const quoteChars = document.querySelector(".quote-chars");
const userInput = document.querySelector("#quote-input");

const DEAULT_TIME = 10;
let quote = "";
let words = [];
let time = DEAULT_TIME;
let timer = "";
let mistakes = 0;
let isPlaying = false;

//Display random quotes
const getData = async () => {
  const data = await fetch(wordApiUrl).then((res) => res.json());
  words = data;
  makeWords();
};

function makeWords() {
  const randomIndex = Math.floor(Math.random() * words.length);
  quoteChars.innerText = words[randomIndex];
}

userInput.addEventListener("input", (e) => {
  if (e.target.value === quoteChars.innerText.toLowerCase()) {
    displayResult();
    quoteChars.classList.add("success");
    userInput.value = "";

    setTimeout(() => {
      time = DEAULT_TIME;
      quoteChars.classList.remove("success");
      makeWords();
    }, 500);
  }

  const textLength = e.target.value.length;
  // 매칭 실패시
  if (e.target.value !== quoteChars.innerText.slice(0, textLength)) {
    quoteChars.classList.add("fail");
  } else {
    quoteChars.classList.remove("fail");
  }
});

function updateTimer() {
  if (time == 0) {
    displayResult();
    clearInterval(timer);
    userInput.value = "";
    isPlaying = false;
    userInput.disabled = true;
  } else {
    document.querySelector("#timer").innerText = --time + "s";
  }
}

const timeReduce = () => {
  time = DEAULT_TIME;
  timer = setInterval(updateTimer, 1000);
};

const displayResult = () => {
  let timeTaken = 1;
  if (time != 0) {
    timeTaken = (DEAULT_TIME - time) / 100;
  }
  document.querySelector("#wpm").innerText =
    (userInput.value.length / 5 / timeTaken).toFixed(2) + " wpm";
  document.querySelector("#accuracy").innerText =
    Math.round(
      ((userInput.value.length - mistakes) / userInput.value.length) * 100
    ) + " %";
};

const start = () => {
  if (isPlaying) return;
  isPlaying = true;
  mistakes = 0;
  timer = "";
  userInput.disabled = false;
  userInput.focus();
  timeReduce();
};

window.onload = () => {
  userInput.value = "";
  userInput.disabled = true;
  getData();
};
