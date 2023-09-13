const quoteApiUrl =
  "https://api.quotable.io/quotes/random?limit=50&minLength=80&maxLength=100";
const wordApiUrl = "https://random-word-api.herokuapp.com/word?number=100";

const quoteCharsEl = document.querySelector(".quote-chars");
const userInputEl = document.querySelector("#quote-input");
const startBtnEl = document.querySelector("#start-test");
const radiosEl = document.querySelectorAll(
  'input[type=radio][name="chk_info"]'
);
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
  startBtnEl.innerText = "게임시작";
  startBtnEl.classList.remove("loading");
  makeWords();
};

const getQuoteData = async () => {
  const datas = await fetch(quoteApiUrl).then((res) => res.json());
  words = datas.map((data) => data.content);
  startBtnEl.innerText = "게임시작";
  startBtnEl.classList.remove("loading");
  makeWords();
};

const makeWords = () => {
  const randomIndex = Math.floor(Math.random() * words.length);
  quoteCharsEl.innerText = words[randomIndex];
};

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
    userInputEl.value.length / timeTaken
  ).toFixed(0);
  document.querySelector("#accuracy").innerText = userInputEl.value.length
    ? Math.round(
        ((userInputEl.value.length - mistakes) / userInputEl.value.length) * 100
      )
    : 0 + " %";
};

const reset = () => {
  displayResult();
  clearInterval(timer);

  isPlaying = false;
  timeEl.innerText = 0;
  userInputEl.value = "";
  userInputEl.disabled = true;
  startBtnEl.innerText = "게임시작";
  startBtnEl.classList.remove("loading");
};

const showLoading = () => {
  startBtnEl.innerText = "로딩중";
  startBtnEl.classList.add("loading");
};

const start = () => {
  if (isPlaying) return;
  isPlaying = true;
  mistakes = 0;
  timer = "";
  userInputEl.disabled = false;
  startBtnEl.innerText = "게임중";
  startBtnEl.classList.add("loading");
  userInputEl.focus();
  timeReduce();
};

userInputEl.addEventListener("input", (e) => {
  if (e.target.value === quoteCharsEl.innerText) {
    displayResult();
    quoteCharsEl.classList.add("success");
    userInputEl.value = "";
    mistakes = 0;

    setTimeout(() => {
      time = seletedTime;
      quoteCharsEl.classList.remove("success");
      makeWords();
    }, 500);
  }

  const textLength = e.target.value.length;
  // 매칭 실패시
  if (e.target.value !== quoteCharsEl.innerText.slice(0, textLength)) {
    mistakes += 1;
    quoteCharsEl.classList.add("fail");
  } else {
    quoteCharsEl.classList.remove("fail");
  }
  document.querySelector("#mistakes").innerText = mistakes;
});

radiosEl.forEach((radio) =>
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

window.onload = () => {
  userInputEl.value = "";
  userInputEl.disabled = true;
  getWordData();
};
