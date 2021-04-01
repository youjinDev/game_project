'use strict';

import * as sound from './sound.js'

const IMG_SIZE = 90;


export default class Field {
    constructor(RED_CAR_COUNT, GREEN_CAR_COUNT, TRUCK_CAR_COUNT) {
        this.redCarCount = RED_CAR_COUNT;
        this.greenCarCount = GREEN_CAR_COUNT;
        this.truckCarCount = TRUCK_CAR_COUNT;
        
        this.field = document.querySelector('.game__field');
        this.fieldRect = this.field.getBoundingClientRect();
        // 클래스 안의 멤버함수를 다른 콜백으로 전달할 때는 this 정보가 함께 전달되지 않는다
        // 따라서 (event) => this.onClick(event) 이렇게 arrow function으로 넘겨주거나
        // 멤버 함수를 정의할 때 arrow function 으로 정의한다
        // 이러한 this binding을 통해 onclick이 호출되었을 때, 그 안의 onItemClick의 this가 클래스를 가리킨다고 알려줘야함
        this.field.addEventListener('click', this.onClick);
    }

    updateField(itemCount) {
        this.greenCarCount = itemCount;
        this.truckCarCount = itemCount;
    }

    initField() {
        this.field.innerHTML = '';
        this._createItems('car green', this.greenCarCount, './carrot/img/car--green.png');
        this._createItems('car red', this.redCarCount, './carrot/img/car--red.png');
        this._createItems('car truck', this.truckCarCount, './carrot/img/car--truck.png');
    }

    setClickListener(onItemClick) {
        this.onItemClick = onItemClick;
    }

    _createItems(className, count, imgPath) {
        const x1 = 0;
        const y1 = 0;
        const x2 = this.fieldRect.width - IMG_SIZE;
        const y2 = this.fieldRect.height - IMG_SIZE;
        
        for (let i = 0; i < count ; i++) {
            const item = document.createElement('img');
    
            item.setAttribute('class', className);
            item.setAttribute('src', imgPath);
    
            item.style.width = `${IMG_SIZE}px`;
            item.style.height = `${IMG_SIZE}px`;
            item.style.position = 'absolute';
            item.style.cursor = 'pointer';
    
            const x = randomNum(x1, x2);
            const y = randomNum(y1, y2);
    
            item.style.left = `${x}px`;
            item.style.top = `${y}px`;
    
            this.field.appendChild(item);
        }
    }

    // arrow function은 내부 자체적인 this가 없기 때문에 가장 가까운 scope를 가리킨다
    onClick = (event) => {
        const target = event.target;
        if (target.matches('.car.red')) {
            sound.playRight();
            target.remove();
            this.onItemClick && this.onItemClick('carRight');
        } else if (target.matches('.car.green') || target.matches('.car.truck')) {
            this.onItemClick && this.onItemClick('carWrong');
        }
    }
}

function randomNum (min, max) {
    return Math.random() * (max - min) + min;
}
