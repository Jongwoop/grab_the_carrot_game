"use strict";
const CARROT_SIZE = 80;
const CARROT_COUNT = 10;
const BUG_COUNT = 8;
const GAME_DURATION = 10;

const field = document.querySelector(".game__field");
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector(".game__btn");
const gameTimer = document.querySelector(".game__timer");
const gameScore = document.querySelector(".game__score");

const popUp = document.querySelector(".pop-up");
const popUpText = document.querySelector(".pop-up__message");
const popUpRefresh = document.querySelector(".pop-up__refresh");

const bg = new Audio("sound/bg.mp3");
const alertSound = new Audio("sound/alert.wav");
const bugSound = new Audio("sound/bug_pull.mp3");
const carrotSound = new Audio("sound/carrot_pull.mp3");
const gameWin = new Audio("sound/game_win.mp3");

let started = false;
let score = 0;
let timer = undefined;

field.addEventListener("click", onFieldClick);

gameBtn.addEventListener("click", () => {
  if (started) {
    stopGame();
  } else {
    startGame();
  }
});

popUpRefresh.addEventListener("click", () => {
  startGame();
  hidePopUp();
});

function startGame() {
  started = true;
  initGame();
  showStopBtn();
  showTimerAndScore();
  startGameTimer();
  playSound(bg);
}

function stopGame() {
  started = false;
  stopGameTimer();
  hideGameButton();
  showPopUpWithText("REPLAY?");
  playSound(alertSound);
  stopSound(bg);
}

function finishGame(win) {
  started = false;
  hideGameButton();
  if (win) {
    playSound(gameWin);
  } else {
    playSound(bugSound);
  }
  stopGameTimer();
  stopSound(bg);
  showPopUpWithText(win ? "You Won!" : "You Lost!");
}

function showStopBtn() {
  const icon = gameBtn.querySelector(".fas");
  icon.classList.remove("fa-play");
  icon.classList.add("fa-stop");
  gameBtn.style.visibility = "visible";
}

function hideGameButton() {
  gameBtn.style.visibility = "hidden";
}

function showTimerAndScore() {
  gameTimer.style.visibility = "visible";
  gameScore.style.visibility = "visible";
}

function startGameTimer() {
  let remainingTimeSec = GAME_DURATION;
  updateTimerText(remainingTimeSec);
  timer = setInterval(() => {
    if (remainingTimeSec <= 0) {
      clearInterval(timer);
      finishGame(score === CARROT_COUNT);
      return;
    }
    updateTimerText(--remainingTimeSec);
  }, 1000);
}

function stopGameTimer() {
  clearInterval(timer);
}

function updateTimerText(time) {
  const min = Math.floor(time / 60);
  const sec = time % 60;
  gameTimer.innerText = `${min}:${sec}`;
}

function showPopUpWithText(text) {
  popUpText.innerText = `${text}`;
  popUp.classList.remove("pop-up--hide");
}
function hidePopUp() {
  popUp.classList.add("pop-up--hide");
}

function initGame() {
  score = 0;
  field.innerHTML = "";
  gameScore.innerHTML = CARROT_COUNT;
  addItem("carrot", CARROT_COUNT);
  addItem("bug", BUG_COUNT);
}

function onFieldClick(event) {
  if (!started) {
    return;
  }
  const target = event.target;
  if (target.matches(".carrot")) {
    target.remove();
    score++;
    playSound(carrotSound);
    updateScoreBoard();
    if (score === CARROT_COUNT) {
      finishGame(true);
    }
  } else if (target.matches(".bug")) {
    finishGame(false);
  }
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}
function stopSound(sound) {
  sound.pause();
}

function updateScoreBoard() {
  gameScore.innerText = CARROT_COUNT - score;
}

function addItem(className, count) {
  const x1 = 0;
  const y1 = 0;
  const x2 = fieldRect.width - CARROT_SIZE;
  const y2 = fieldRect.height - CARROT_SIZE;
  for (let i = 0; i < count; i++) {
    const item = document.createElement("img");
    item.setAttribute("class", className);
    item.setAttribute("src", `img/${className}.png`);
    item.style.position = "absolute";
    const x = randomNumber(x1, x2);
    const y = randomNumber(y1, y2);
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    field.appendChild(item);
  }
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

// v1. create - 10 carrots, 10 bugs
// v2. relocate - random location

// v3. carrot.Click -> remove carrots
// 4. bug.Click -> game over

// v5. addinng timer
// 6. activate play/stop button
// v7. Adding showing countdown div
// v7. Adding showing count of carrot # div
// 9. Sound
