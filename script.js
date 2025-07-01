const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 20;
const canvasSize = 400;
let snake = [{ x: 9 * box, y: 10 * box }];
let food = {};
let score = 0;
let direction = null;
let gameInterval = null;
let isPaused = false;

const gameOverScreen = document.getElementById("gameOverScreen");
const scoreElement = document.getElementById("score");

function randomFood() {
    food = {
        x: Math.floor(Math.random() * (canvasSize / box)) * box,
        y: Math.floor(Math.random() * (canvasSize / box)) * box
    };
}

function draw() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "#00ffcc" : "#00796b";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "#ff4081";
    ctx.fillRect(food.x, food.y, box, box);

    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "LEFT") headX -= box;
    if (direction === "RIGHT") headX += box;
    if (direction === "UP") headY -= box;
    if (direction === "DOWN") headY += box;

    if (headX === food.x && headY === food.y) {
        score++;
        scoreElement.textContent = score;
        randomFood();
    } else {
        snake.pop();
    }

    const newHead = { x: headX, y: headY };

    if (
        headX < 0 || headX >= canvas.width ||
        headY < 0 || headY >= canvas.height ||
        collision(newHead, snake)
    ) {
        clearInterval(gameInterval);
        gameOverScreen.classList.remove("hidden");
        return;
    }

    snake.unshift(newHead);
}

function collision(head, body) {
    return body.some(segment => segment.x === head.x && segment.y === head.y);
}

function startGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = null;
    score = 0;
    scoreElement.textContent = score;
    randomFood();
    gameOverScreen.classList.add("hidden");
    clearInterval(gameInterval);
    gameInterval = setInterval(draw, 150);
}

function pauseGame() {
    if (!isPaused) {
        clearInterval(gameInterval);
        isPaused = true;
    }
}

function resumeGame() {
    if (isPaused) {
        gameInterval = setInterval(draw, 150);
        isPaused = false;
    }
}

function exitGame() {
    clearInterval(gameInterval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake = [];
    score = 0;
    scoreElement.textContent = score;
    direction = null;
    gameOverScreen.classList.add("hidden");
}

document.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("pauseBtn").addEventListener("click", pauseGame);
document.getElementById("resumeBtn").addEventListener("click", resumeGame);
document.getElementById("exitBtn").addEventListener("click", exitGame);
document.getElementById("playAgainBtn").addEventListener("click", startGame);
