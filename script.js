const quoteApiUrl =
  "https://api.quotable.io/quotes/random?limit=50&minLength=80&maxLength=100";
const wordApiUrl = "https://random-word-api.herokuapp.com/word?number=100";

const quoteSection = document.querySelector("#quote");
const quoteChars = document.querySelector(".quote-chars");
const userInput = document.querySelector("#quote-input");
const startBtn = document.querySelector("#start-test");
const radios = document.querySelectorAll('input[type=radio][name="chk_info"]');
const timeEl = document.querySelector("#timer");

const DEAULT_WORD_TIME = 10;
const DEAULT_QUOTE_TIME = 60;

let quote = "";
let words = [];
let seletedTime = DEAULT_WORD_TIME;
let time = seletedTime;
let timer = "";
let mistakes = 0;
let isPlaying = false;

const getWordData = async () => {
  const data = await fetch(wordApiUrl).then((res) => res.json());
  words = data;
  startBtn.innerText = "게임시작";
  startBtn.classList.remove("loading");
  makeWords();
};

const getQuoteData = async () => {
  const datas = await fetch(quoteApiUrl).then((res) => res.json());
  words = datas.map((data) => data.content);
  startBtn.innerText = "게임시작";
  startBtn.classList.remove("loading");
  makeWords();
};

const makeWords = () => {
  const randomIndex = Math.floor(Math.random() * words.length);
  quoteChars.innerText = words[randomIndex];
};

userInput.addEventListener("input", (e) => {
  // console.log(e.target.value, quoteChars.innerText);
  if (e.target.value === quoteChars.innerText) {
    displayResult();
    quoteChars.classList.add("success");
    userInput.value = "";
    mistakes = 0;

    setTimeout(() => {
      time = seletedTime;
      quoteChars.classList.remove("success");
      makeWords();
    }, 500);
  }

  const textLength = e.target.value.length;
  // 매칭 실패시
  if (e.target.value !== quoteChars.innerText.slice(0, textLength)) {
    mistakes += 1;
    quoteChars.classList.add("fail");
  } else {
    quoteChars.classList.remove("fail");
  }
  document.querySelector("#mistakes").innerText = mistakes;
});

radios.forEach((radio) =>
  radio.addEventListener("change", () => {
    showLoading();

    if (radio.value === "word") {
      getWordData();
      seletedTime = DEAULT_WORD_TIME;
    } else if (radio.value === "quote") {
      getQuoteData();
      seletedTime = DEAULT_QUOTE_TIME;
    }
    reset();
    time = seletedTime;
  })
);

const updateTimer = () => {
  if (time == 0) {
    reset();
  } else {
    timeEl.innerText = --time;
  }
};

const timeReduce = () => {
  time = seletedTime;
  timer = setInterval(updateTimer, 1000);
};

const displayResult = () => {
  let timeTaken = 1;
  if (time != 0) {
    timeTaken = (seletedTime - time) / 60;
  }

  document.querySelector("#wpm").innerText = (
    userInput.value.length / timeTaken
  ).toFixed(0);
  document.querySelector("#accuracy").innerText = userInput.value.length
    ? Math.round(
        ((userInput.value.length - mistakes) / userInput.value.length) * 100
      )
    : 0 + " %";
};

const reset = () => {
  displayResult();
  clearInterval(timer);

  isPlaying = false;
  timeEl.innerText = 0;
  userInput.value = "";
  userInput.disabled = true;
  startBtn.innerText = "게임시작";
  startBtn.classList.remove("loading");
};

const showLoading = () => {
  startBtn.innerText = "로딩중";
  startBtn.classList.add("loading");
};

const start = () => {
  if (isPlaying) return;
  isPlaying = true;
  mistakes = 0;
  timer = "";
  userInput.disabled = false;
  startBtn.innerText = "게임중";
  startBtn.classList.add("loading");
  userInput.focus();
  timeReduce();
};

window.onload = () => {
  userInput.value = "";
  userInput.disabled = true;
  getWordData();
};
