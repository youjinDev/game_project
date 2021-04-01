'use strict';

export default class Popup {
    constructor() {
        this.popUp = document.querySelector('.popup');
        this.popUpText = document.querySelector('.message');
        this.popUpRestart = document.querySelector('.restart__btn');
        this.popUpNextStage = document.querySelector('.next__btn');
        
        this.popUpRestart.addEventListener('click', () => {
            this.onClick && this.onClick();
            this.hide();
        });

        this.popUpNextStage.addEventListener('click', () => {
            this.onClick && this.onClick();
            this.hide();
        });
    }

    setClickListener(onClick) {
        this.onClick = onClick;
    }

    setNextClickListener(onClickNextLevel) {
        this.onClickNextLevel = onClickNextLevel;
    }

    showWithText(text) {
        this.popUp.classList.remove('invisible');
        this.popUpText.innerHTML = text;
    }

    hide() {
        this.popUp.classList.add('invisible');
    }
}