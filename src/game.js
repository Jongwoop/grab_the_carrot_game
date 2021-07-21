"use strict";
import * as sound from "./sound.js";
import Field from "./field.js";
import PopUp from "./popup.js";

export default class Game {
  constructor(duration, carrotCount, bugCount) {
    this.duration = duration;
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;

    this.gameBtn = document.querySelector(".game__btn");
    this.timerIndicator = document.querySelector(".game__timer");
    this.gameScore = document.querySelector(".game__score");

    this.gameField = new Field(this.carrotCount, this.bugCount);
    this.gameField.setClickListener(this.onItemClick);

    this.gameFinishBanner = new PopUp();
    this.gameFinishBanner.setEventListener(this.start);

    this.started = false;
    this.score = 0;
    this.timer = undefined;
    this.gameBtn.addEventListener("click", () => {
      if (this.started) {
        this.stop();
      } else {
        this.start();
      }
    });
  }

  onItemClick = (item) => {
    if (!this.started) {
      return;
    }
    if (item === "carrot") {
      this.score++;
      this.updateScoreBoard();
      sound.playCarrot();
      if (this.score === this.carrotCount) {
        this.finish(true);
      }
    } else if (item === "bug") {
      this.finish(false);
    }
  };
  start = () => {
    this.started = true;
    this.initGame();
    this.showStopButton();
    this.showTimerAndScore();
    this.startGameTimer();
    sound.playBg();
  };

  stop() {
    this.started = false;
    this.stopGameTimer();
    this.hideGameButton();
    sound.stopBg();
    sound.playAlert();
    this.gameFinishBanner.showWithText("Replay?");
  }

  finish(win) {
    this.started = false;
    this.stopGameTimer();
    this.hideGameButton();
    sound.stopBg();

    if (win) {
      sound.playWin();
    } else {
      sound.playBug();
    }
    this.gameFinishBanner.showWithText(win ? "YOU WON 🎉" : "YOU LOST 💩");
  }

  setStopListener(onStop) {
    this.onStop = onStop;
  }
  showStopButton() {
    const icon = this.gameBtn.querySelector(".fas");
    icon.classList.add("fa-stop");
    icon.classList.remove("fa-play");
    this.gameBtn.style.visibility = "visible";
  }

  hideGameButton() {
    this.gameBtn.style.visibility = "hidden";
  }

  showTimerAndScore() {
    this.timerIndicator.style.visibility = "visible";
    this.gameScore.style.visibility = "visible";
  }

  startGameTimer() {
    let remainingTimeSec = this.duration;
    this.updateTimerText(remainingTimeSec);
    this.timer = setInterval(() => {
      if (remainingTimeSec <= 0) {
        clearInterval(this.timer);
        this.finish(this.score === this.carrotCount);
        return;
      }
      this.updateTimerText(--remainingTimeSec);
    }, 1000);
  }

  stopGameTimer() {
    clearInterval(this.timer);
  }

  updateTimerText(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    this.timerIndicator.innerHTML = `${minutes}:${seconds}`;
  }

  initGame = () => {
    this.score = 0;
    this.gameScore.innerText = this.carrotCount;
    this.gameField.init();
  };

  updateScoreBoard() {
    this.gameScore.innerText = this.carrotCount - this.score;
  }
}
