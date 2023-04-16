// Touch and keyboard supported Responsive Snake Games

let gameInterval, snake, snakeHead, food, score, highScore, snakeX, snakeY, snakeBody, velocityX, velocityY;

let speed = 125 // milliseconds

const gameBoard = document.getElementById("gameBoard");

// Init Musics
let bgMusic = new Audio("audio/bg.mp3");

let playBgMusicLoop = () => {
    bgMusic.addEventListener("ended", () => {
        bgMusic.currentTime = 0;
        bgMusic.play();
    })
}

let eatMusic = new Audio("audio/eat.mp3");
let gameOverMusic = new Audio("audio/gameOver.mp3");

const currentScore = document.getElementById("currentScore");
const highestScore = document.getElementById("highestScore");


// Check and Set game High Score
function setHighScore(check) {
    if (!(check)) {
        highScore = localStorage.getItem("snakeGameHighScore") ?? 0;
    } else {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("snakeGameHighScore", highScore);
        }
    }

    highestScore.innerText = highScore;
}


// Set the game State to Primary

function setGameStateTo0() {
    snake = document.getElementsByClassName("snake");
    snakeHead = document.getElementById("snakeHead");
    food = document.getElementById("food");

    score = 0;
    currentScore.innerText = score;
    setHighScore();

    snakeX = 2;
    snakeY = 3;

    snakeBody = [
        [snakeX, snakeY],
        [snakeX, snakeY - 1]
    ];

    // console.log(snakeBody);

    velocityX = 0;
    velocityY = 0;
}

// Check the keyboard Control
window.addEventListener("keydown", (e) => {
    // Start game if it is not running
    if (gameInterval == null) {
        bgMusic.play();
        playBgMusicLoop();
        gameInterval = setInterval(initGame, speed);
    }

    if (e.key == "ArrowUp" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;

        snakeHead.style.borderRadius = `50% 50% 0 0`
    } else if (e.key == "ArrowDown" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;

        snakeHead.style.borderRadius = `0 0 50% 50%`
    } else if (e.key == "ArrowLeft" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;

        snakeHead.style.borderRadius = `50% 0 0 50%`
    } else if (e.key == "ArrowRight" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;

        snakeHead.style.borderRadius = `0 50% 50% 0`
    } else if (e.key == " ") {
        bgMusic.pause();
        clearInterval(gameInterval)
        gameInterval = null;
    }
})

// Detect user touch
// Store initial touch coordinates
let startX, startY;

// Add event listener for touchstart event
document.addEventListener('touchstart', function (event) {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
}, false);

// Add event listener for touchend event
document.addEventListener('touchend', function (event) {
    speed = 200;
    // Start game if it is not running
    if (gameInterval == null) {
        bgMusic.play();
        playBgMusicLoop();
        gameInterval = setInterval(initGame, speed);
    }

    // Get current touch coordinates
    let endX = event.changedTouches[0].clientX;
    let endY = event.changedTouches[0].clientY;

    // Calculate horizontal and vertical differences
    let deltaX = endX - startX;
    let deltaY = endY - startY;

    // Check if horizontal or vertical movement is greater
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal movement
        if (deltaX > 0  && velocityY !== -1) { // right
            velocityX = 0;
            velocityY = 1;

            snakeHead.style.borderRadius = `0 50% 50% 0`
        } else if (velocityY !== 1){ // left
            velocityX = 0;
            velocityY = -1;

            snakeHead.style.borderRadius = `50% 0 0 50%`
        }
    } else {
        // Vertical movement
        if (deltaY > 0 && velocityX !== -1) { // down
            velocityX = 1;
            velocityY = 0;

            snakeHead.style.borderRadius = `0 0 50% 50%`
        } else if(velocityX !== 1) { // up
            velocityX = -1;
            velocityY = 0;

            snakeHead.style.borderRadius = `50% 50% 0 0`
        }
    }

}, false);

// Check for GameOver or Point
function checkGameOver() {
    let bodyPositions = snakeBody.slice(1);
    // console.log(bodyPositions)

    if (snakeBody[0][0] == foodX && snakeBody[0][1] == foodY) { // if snake eats food, score up!
        eatMusic.play();
        score += 1;
        currentScore.innerText = score;
        setHighScore(true);

        changeFoodPosition();
        newBodyPart = document.createElement("div")
        newBodyPart.classList.add("snakeBody")
        newBodyPart.classList.add("snake")
        gameBoard.appendChild(newBodyPart);
        snakeBody.push([foodX, foodY]);

    } else if ((snakeBody[0][0] == -1 || snakeBody[0][0] == 21 || snakeBody[0][1] == -1 || snakeBody[0][1] == 21) || (bodyPositions.some(arr => JSON.stringify(arr) === JSON.stringify(snakeBody[0])))) { // GameOver, if snake goes beyond game area OR it eats itself!
        bgMusic.pause();
        gameOverMusic.play();
        alert("GameOver");
        clearInterval(gameInterval);
        gameInterval = null;
        restartGame();
        return true;
    }

    return false;
}


// Restart Game
function restartGame() {
    gameBoard.innerHTML = `<div class="food" id="food"></div><div class="snakeHead snake" id="snakeHead"></div><div class="snakeBody snake"></div>`

    setGameStateTo0();
    setSnakePosition();
    changeFoodPosition();
}

// Get random position for Food
function changeFoodPosition() {
    let newPositionX = Math.floor(Math.random() * 20);
    // We don't expect 0!
    while (newPositionX == 0) {
        newPositionX = Math.floor(Math.random() * 20);
    }

    let newPositionY = Math.floor(Math.random() * 20);
    while (newPositionY == 0) {
        newPositionY = Math.floor(Math.random() * 20);
    }

    foodX = newPositionX;
    foodY = newPositionY;


    // set the food to the position
    food.style.cssText = `grid-row: ${foodX}; grid-column: ${foodY};`

    // console.log("changed " + foodX + " " + foodY)
}

// Set the position of Snake Body
function setSnakePosition() {
    for (let i = 0; i < snake.length; i++) {
        snake[i].style.gridArea = `${snakeBody[i][0]} / ${snakeBody[i][1]} / auto / auto`

    }
}

// Initialize Game
function initGame() {
    if (velocityX === 0 && velocityY === 0) {
        return
    }

    if (checkGameOver()) {
        return
    }

    // Change snake position
    snakeX += velocityX;
    snakeY += velocityY;

    // For every body part, give it's position of the body part before it (Except Head)
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];

    // console.log(snakeBody)
    setSnakePosition();
}

setGameStateTo0();
changeFoodPosition();
