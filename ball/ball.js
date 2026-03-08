const ball = document.getElementById('ball');
const answerDiv = document.getElementById('answer');
const resultMessage = document.getElementById('resultMessage');

const answers = [
    "Undoubtedly",
    "It's a foregone conclusion",
    "No doubt",
    "Definitely yes",
    "You can be sure",
    "I think yes",
    "Most likely",
    "Good prospects",
    "The signs say yes",
    "Yes",
    "Not clear yet",
    "Ask later",
    "It's better not to tell",
    "It's not possible now",
    "Concentrate",
    "Don't even think about it",
    "My answer is no",
    "According to my information, no",
    "Doubtful",
    "Highly doubtful"
];

let isShaking = false;

ball.addEventListener('click', () => {
    if (isShaking) return;

    isShaking = true;

    const randomIndex = Math.floor(Math.random() * answers.length);
    const selectedAnswer = answers[randomIndex];

    answerDiv.textContent = '?';
    ball.classList.add('shake');

    setTimeout(() => {
        ball.classList.remove('shake');
        answerDiv.textContent = '8';
        resultMessage.textContent = selectedAnswer;
        isShaking = false;
    }, 800);
});

resultMessage.textContent = 'Shake';