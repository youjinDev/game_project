'use strict';

import Field from './field.js';
import * as sound from './sound.js'

export default class GameBuilder {
    withGameDuration(time) {
        this.gameDuration = time;
        return this;
    }

    withRedCarCount(redCarCount) {
        this.redCarCount = redCarCount;
        return this;
    }

    withGreenCarCount(greenCarCount) {
        this.greenCarCount = greenCarCount;
        return this;
    }

    withTruckCount(truckCount) {
        this.truckCount = truckCount;
        return this;
    }

    build() {
        return new Game(
            this.gameDuration,
            this.redCarCount,
            this.greenCarCount,
            this.truckCount
        );
    }
}

class Game {
    constructor(gameDuration, redCarCount, greenCarCount, truckCount) {
        this.gameDuration = gameDuration;
        this.redCarCount = redCarCount;
        this.greenCarCount = greenCarCount;
        this.truckCount = truckCount;

        this.counter = document.querySelector('.game__counter');
        this.timerDisplay = document.querySelector('.game__timer');
        this.btnImg = document.querySelector('.play__btn>.fas');
        this.playBtn = document.querySelector('.play__btn');
        this.scoreSum = document.querySelector('.total__score>span');

        this.playBtn.addEventListener('click', () => {
            if (this.isStarted) {
                this.stop('cancel');
            } else {
                this.start();
            }
        });

        this.gameField = new Field(redCarCount, greenCarCount, truckCount);
        this.gameField.setClickListener(this.onItemClick);

        this.level = 1;
        this.score = 0;
        this.totalScore = 0;
        this.isStarted = false;
        this.setTimer = undefined;
    }

    setGameStopListener(onGameStop) {
        this.onGameStop = onGameStop;
    }

    getRedCarCount() {
        return this.redCarCount;
    }

    nextStage() { 
        this.level++;
        this.greenCarCount += this.level;
        this.truckCount += this.level;
    }

    start() {
        this.isStarted = true;
        this.init();
        this.changeBtnImg();
        sound.playBackground();
    }

    init() {
        this.gameField.initField();
        this.showStartButton();
        this.resetCounter();
        this.startTimer();
    }

    stop(reason) {
        this.isStarted = false;
        sound.stopBackground();
        this.hideStartButton();
        this.stopGameTimer();
        switch(reason) {
            case 'win':
                sound.playWin();
                this.onGameStop && this.onGameStop('win', this.totalScore);
                break;
            case 'cancel':
                this.onGameStop && this.onGameStop('cancel', this.totalScore);
                this.resetTotalScore();
                this.initStage();
                break;
            case 'lose':
                sound.playAlert();
                
                this.onGameStop && this.onGameStop('lose', this.totalScore);
                this.resetTotalScore();
                this.initStage();
                break;
        }
    }

    resetTotalScore() {
        this.totalScore = 0;
        this.scoreSum.innerHTML = this.totalScore;
    }
    
    onItemClick = itemType => {
        if(!this.isStarted) {
            return;
        }

        if (itemType === 'carRight') {
            this.score++;
            this.totalScore++;
            this.scoreSum.innerHTML = this.totalScore;
            this.counter.innerHTML = this.redCarCount - this.score;
            // 시간 내 성공하면
            if (this.score === this.redCarCount) {
                this.stop('win');
                this.nextStage();
                this.gameField.updateField(this.greenCarCount++);
            }
        } else if (itemType === 'carWrong') {
            this.stop('lose');
            this.resetTotalScore();
            this.initStage();
            return;
        }
    }

    hideStartButton() {
        this.playBtn.style.visibility = 'hidden';
    }
    
    showStartButton() {
        this.playBtn.style.visibility = 'visible';
    }
    
    changeBtnImg() {
        this.btnImg.classList.add('fa-pause');
        this.btnImg.classList.remove('fa-play');
    }
    
    resetCounter() {
        this.score = 0; 
        this.counter.innerHTML = this.redCarCount;
    }

    startTimer() {
        let remainTime = this.gameDuration;
        this.updateTimerText(remainTime);
        
        this.setTimer = setInterval(() => {
            --remainTime;
            this.updateTimerText(remainTime);
            // Time Out Lose
            if (remainTime === 0 ) {
                this.stop('lose');
                sound.playAlert();
                this.initStage();
                return;
            }
        }, 1000)
    }

    updateTimerText(remainTime) {
        this.timerDisplay.innerHTML = `0:${remainTime}`;
    }
    
    stopGameTimer() {
        clearInterval(this.setTimer);
    }
    
    initStage() {
        this.redCarCount = 5;
        this.greenCarCount = 5;
        this.truckCount = 5;
        this.level = 1;
        this.totalScore = 0;
        this.gameField.updateField(5);
    }
}