
const alert_sound = new Audio('carrot/sound/alert.wav');
const back_sound = new Audio('carrot/sound/bg.mp3');
const win_sound = new Audio('carrot/sound/game_win.wav');
const right_car_sound = new Audio('carrot/sound/car_pickup.wav');

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

function stopSound(sound) {
    sound.pause();
}

export function playAlert() {
    playSound(alert_sound);
}

export function playWin() {
    playSound(win_sound);
}

export function playRight() {
    playSound(right_car_sound);
}

export function playBackground() {
    playSound(back_sound);
}

export function stopBackground() {
    stopSound(back_sound);
}