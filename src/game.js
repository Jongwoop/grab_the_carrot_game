"use strict";
import * as sound from "./sound.js";
import { Field, ItemType } from "./field.js";
import PopUp from "./popup.js";

const Reason = Object.freeze({
  win: "win",
  lose: "lose",
  cancel: "cancel",
});
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
        this.stop(Reason.cancel);
      } else {
        this.start();
      }
    });
  }

  onItemClick = (item) => {
    if (!this.started) {
      return;
    }
    if (item === ItemType.carrot) {
      this.score++;
      this.updateScoreBoard();
      sound.playCarrot();
      if (this.score === this.carrotCount) {
        this.stop(Reason.win);
      }
    } else if (item === ItemType.bug) {
      this.stop(Reason.lose);
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

  stop(Reason) {
    this.started = false;
    this.stopGameTimer();
    this.hideGameButton();
    sound.stopBg();
    sound.playAlert();
    this.onGameStop && this.onGameStop(Reason);
  }

  onGameStop(reason) {
    let message;
    switch (reason) {
      case Reason.win:
        sound.playWin();
        message = "YOU WON 🎉";
        break;
      case Reason.lose:
        sound.playBug();
        message = "YOU LOST 💩";
        break;
      case Reason.cancel:
        sound.playAlert();
        message = "Replay?";
        break;
      default:
        throw new Error("not valid reason");
    }
    this.gameFinishBanner.showWithText(message);
  }

  // setStopListener(onStop) {
  //   this.onStop = onStop;
  // }

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
        this.stop(this.score === this.carrotCount ? Reason.win : Reason.lose);
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
