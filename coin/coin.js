const coin = document.getElementById('coin');
const resultDiv = document.getElementById('result');
const totalFlipsSpan = document.getElementById('totalFlips');
const headsCountSpan = document.getElementById('headsCount');
const tailsCountSpan = document.getElementById('tailsCount');

let totalFlips = 0;
let heads = 0;
let tails = 0;
let isFlipping = false;

const originalTransition = coin.style.transition;

coin.addEventListener('click', () => {
    if (isFlipping) return;

    isFlipping = true;

    const isHeads = Math.random() < 0.5;
    const fullRotations = 1 + Math.floor(Math.random() * 2); // 3-6 оборотов
    const baseAngle = isHeads ? 0 : 180;
    const targetAngle = baseAngle + fullRotations * 360;

    // Сброс без анимации
    coin.style.transition = 'none';
    coin.style.transform = 'rotateY(0deg)';
    void coin.offsetHeight; // форсируем перерисовку

    // Запускаем анимацию
    coin.style.transition = originalTransition || 'transform 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)';
    coin.style.transform = `rotateY(${targetAngle}deg)`;

    setTimeout(() => {
        if (isHeads) {
            resultDiv.textContent = 'Head!';
            heads++;
        } else {
            resultDiv.textContent = 'Tails!';
            tails++;
        }
        totalFlips++;

        totalFlipsSpan.textContent = totalFlips;
        headsCountSpan.textContent = heads;
        tailsCountSpan.textContent = tails;

        isFlipping = false;
    }, 800);
});

resultDiv.textContent = 'Flip a coin';