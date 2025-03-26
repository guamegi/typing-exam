const quoteApiUrl =
  "https://quoteslate.vercel.app/api/quotes/random?count=10";
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

let data = [];
let seletedTime = DEAULT_WORD_TIME;
let time = seletedTime;
let timer;
let mistakes = 0;
let isPlaying = false;

const getWordData = async () => {
  data = await fetch(wordApiUrl).then((res) => res.json());
  makeRandomData();
  showStarting();
};

const getQuoteData = async () => {
  const datas = await fetch(quoteApiUrl).then((res) => res.json());
  data = datas.map((data) => data.quote);
  makeRandomData();
  showStarting();
};

const makeRandomData = () => {
  const randomIndex = Math.floor(Math.random() * data.length);
  quoteCharsEl.innerText = data[randomIndex];
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
      ) + " %"
    : "0 %";
};

const reset = () => {
  displayResult();
  clearInterval(timer);

  isPlaying = false;
  timeEl.innerText = 0;
  userInputEl.value = "";
  userInputEl.disabled = true;
  showStarting();
};

const showStarting = () => {
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

const checkWordMatch = (e) => {
  if (e.target.value === quoteCharsEl.innerText) {
    displayResult();
    quoteCharsEl.classList.add("success");
    userInputEl.value = "";
    mistakes = 0;

    setTimeout(() => {
      time = seletedTime;
      quoteCharsEl.classList.remove("success");
      makeRandomData();
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
};

const changeRadioButton = (radio) => {
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
};

userInputEl.addEventListener("input", (e) => checkWordMatch(e));

radiosEl.forEach((radio) =>
  radio.addEventListener("change", () => changeRadioButton(radio))
);

window.onload = () => {
  userInputEl.value = "";
  userInputEl.disabled = true;
  getWordData();
};
