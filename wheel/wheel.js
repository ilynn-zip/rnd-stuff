const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const resultMessage = document.getElementById('resultMessage');
const wordList = document.getElementById('wordList');
const newWordInput = document.getElementById('newWordInput');
const addWordBtn = document.getElementById('addWordBtn');
const clearAllBtn = document.getElementById('clearAllBtn');

// Загрузка слов из localStorage или начальные значения
let words = [];
const savedWords = localStorage.getItem('wheelWords');
if (savedWords) {
    try {
        words = JSON.parse(savedWords);
    } catch (e) {
        words = ['tag 1', 'tag 2', 'tag 3'];
    }
} else {
    words = ['tag 1', 'tag 2', 'tag 3'];
}

let currentAngle = 0;
let isSpinning = false;
let spinAnimationId = null;

// Цвета для секторов
const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
    '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22', '#2ECC71',
    '#F1C40F', '#E74C3C', '#1ABC9C', '#E67E22', '#95A5A5'
];

// Сохранение в localStorage
function saveWordsToStorage() {
    localStorage.setItem('wheelWords', JSON.stringify(words));
}

// Отрисовка колеса
function drawWheel(angle) {
    const count = words.length;
    if (count === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(150, 150, 140, 0, 2 * Math.PI);
        ctx.fillStyle = '#e2e8f0';
        ctx.fill();
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#334155';
        ctx.font = 'bold 16px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Empty', 150, 150);
        return;
    }

    const angleStep = (2 * Math.PI) / count;
    const radius = 140;
    const centerX = 150;
    const centerY = 150;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < count; i++) {
        const startAngle = i * angleStep + angle * Math.PI / 180;
        const endAngle = (i + 1) * angleStep + angle * Math.PI / 180;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Текст
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + angleStep / 2);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 14px Inter, sans-serif';
        let displayText = words[i];
        if (displayText.length > 6) {
            displayText = displayText.slice(0, 5) + '…';
        }
        if (count > 8) {
            displayText = i + 1 + ':' + displayText;
        }
        ctx.fillText(displayText, radius * 0.7, 0);
        ctx.restore();
    }

    // Центральный круг
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#f8fafc';
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Обновить список слов в интерфейсе
function updateWordList() {
    wordList.innerHTML = '';
    words.forEach((word, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${word}</span>
            <button class="delete-word" data-index="${index}">✕</button>
        `;
        wordList.appendChild(li);
    });

    document.querySelectorAll('.delete-word').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            if (!isSpinning) {
                words.splice(index, 1);
                saveWordsToStorage();         // сохраняем после удаления
                updateWordList();
                drawWheel(currentAngle);
            }
        });
    });

    drawWheel(currentAngle);
}

// Добавить слово
addWordBtn.addEventListener('click', () => {
    const newWord = newWordInput.value.trim();
    if (newWord && !isSpinning) {
        words.push(newWord);
        saveWordsToStorage();                 // сохраняем после добавления
        updateWordList();
        newWordInput.value = '';
    } else if (!newWord) {
        alert('Enter something');
    }
});

// Очистить все слова
clearAllBtn.addEventListener('click', () => {
    if (!isSpinning && words.length > 0) {
        if (confirm('Clear all?')) {
            words = [];
            saveWordsToStorage();              // сохраняем после очистки
            updateWordList();
            drawWheel(currentAngle);
            resultMessage.textContent = 'Spin the wheel';
        }
    }
});

// Функция вращения
function spinWheel() {
    if (isSpinning) return;
    if (words.length === 0) {
        alert('Add something before spin');
        return;
    }

    isSpinning = true;

    const spinRevolutions = 5 + Math.floor(Math.random() * 5); // 5-9 оборотов
    const targetSector = Math.floor(Math.random() * words.length);
    const targetAngle = 360 * spinRevolutions + targetSector * (360 / words.length);

    const startAngle = currentAngle;
    const startTime = performance.now();
    const duration = 3000; // 3 секунды

    function animateSpin(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        currentAngle = startAngle + (targetAngle - startAngle) * easeProgress;

        drawWheel(currentAngle);

        if (progress < 1) {
            spinAnimationId = requestAnimationFrame(animateSpin);
        } else {
            currentAngle = targetAngle % 360;
            drawWheel(currentAngle);

            const normalized = (currentAngle % 360 + 360) % 360;
            const sectorSize = 360 / words.length;
            let index = Math.floor(normalized / sectorSize);
            if (index >= words.length) index = words.length - 1;

            resultMessage.textContent = `${words[index]}`;

            isSpinning = false;
            spinAnimationId = null;
        }
    }

    spinAnimationId = requestAnimationFrame(animateSpin);
}

// Запуск вращения по клику на canvas
canvas.addEventListener('click', spinWheel);

// Инициализация
updateWordList();
resultMessage.textContent = 'Spin the wheel';