const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const restartBox = document.getElementById('restart');
const startBox = document.getElementById('start');

canvas.setAttribute('width', getComputedStyle(canvas)['width'])
canvas.setAttribute('height', getComputedStyle(canvas)['height'])
////////////////////Start/Restart /////////////////////

function startGame () {
    startBox.style.display = 'none';
    canvas.style.display = 'block';
    isGameStarted = true;
}

function restartGame () {
    restartBox.style.display = 'none';
    isGameOver = false;

    // reset player position
    player.resetPlayer();

    // reset enemy position
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].reset();
    }

    //reset timer
    timer = 30;
}


    


////////////////Game Control///////////////////
//for organization purposes, you may want to get used to putting all your variable declarations at the top of your file
let isGameOver = false; //it's a flag(identify to tell you when something is heppening.)
let isGameStarted = false; // its a flag to start the game
const numEnemies = 30; // control number of enemies being created

// show the game when its over and the restart button
function setGameOver () {
    isGameOver = true;
    restartBox.style.display = 'block';
    

}
//you have some comments in your code, but make sure you do it throughout so that other developers can easily read your code
////////////////////Timer//////////////////////
let clock = document.getElementById('counter');
let clockVar;
let timer = 30;
(function() {
    clockVar = setInterval(()=> {
        clock.innerHTML = timer+'s';
        if (timer === 0) {
            setGameOver();
        }
        if (timer > 0 && !isGameOver && isGameStarted) {
            timer--;
        }
    }, 1000)
})()

////////////////////Character and enemies//////////////////
const enemyColors = ['red', 'blue', 'green', 'pink', 'black'];
//
const constX = [];
for (let xCoordinate = 0; xCoordinate <= 650;) {
    xCoordinate = xCoordinate + 50;
    constX.push(xCoordinate);
}

const constY = setYPos(-50, -300);
const constYStart = setYPos(-100, -400);

function setYPos (start, end) {
    let arr = [];
    for (let yCoordinate = start; yCoordinate > end;) {
        arr.push(yCoordinate);
        yCoordinate = yCoordinate - 50;
    }
    console.log(arr);
    return arr;
}



class Player {
    constructor(x, y, color, width, height, speed){
        this.x = x,
        this.y = y,
        this.color = color,
        this.width = width,
        this.height = height,
        this.speed = speed,
        

        this.fall = function () {
            if (this.y >= 550) return;
            this.y = this.y + this.speed; 
        },

        this.render = function () {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        },

        this.reset = function () {//enemy
            this.color = enemyColors[Math.floor(Math.random() * 5)];
            this.x = constX[Math.floor(Math.random() * constX.length)];
            this.y = constY[Math.floor(Math.random() * constY.length)];
            this.speed = (Math.random() * 8 + 2);
            
        }

        this.resetPlayer = function () {//player
            this.x = canvas.width / 2;
            this.y = 475;
        }

        
        this.checkCollision = function (player) {
            if (this.y + this.height > player.y &&
                this.y < player.y + player.height && 
                this.x + this.width > player.x && 
                this.x < player.x + player.width
            ) {
                setGameOver();
                console.log('hit');
            }
        }
        
    }
}

const player = new Player(canvas.width / 2, 475, 'yellow', 25, 25,)
let enemies = [];
for (let i = 0; i < numEnemies; i++) {
    const randomColorIndex = Math.floor(Math.random() * 5);
    const randomInitX = constX[Math.floor(Math.random() * constX.length)];
    const randomInitY = constYStart[Math.floor(Math.random() * constYStart.length)];
    const randomSpeed = (Math.random() * 8 + 2);
    const enemyObj = new Player(randomInitX, randomInitY, enemyColors[randomColorIndex], 35, 30, randomSpeed);
    enemies.push(enemyObj);
}

////////////////movement////////////////
const movement = (e) => {
    switch (e.keyCode) {
        case (37):
            player.x -= 14
            break
        case (39):
            player.x += 14
            break
    }
}
//////////////game loop///////////////////////
const gameLoop = () => {
    if (isGameOver || !isGameStarted) {
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].fall();
        if (enemies[i].y > 525) {
            enemies[i].reset();
        }
        enemies[i].checkCollision(player); 
        enemies[i].render();
    }
    player.render();
}

document.addEventListener('DOMContentLoaded', function (){
    document.addEventListener('keydown', movement)
    setInterval(gameLoop, 40)
})


/*
Current:
1. Controllable player
2. Randomized enemies falling from random (x,y) coordinate
3. Enemies fall at random speed
4. Have a list of preset x starting coordinates


Todo:
1. At enemy list creation and enemy object reset, assign the x coordinate to a random value from constX array
2. Make each random y coordinate have bigger gaps (Direction: make another constY list. have value from -50 to -350, each item is 50 apart from each other. What could be better is hard code each number, and set them far apart from each other)
3. Make fall speed random but with bigger gaps (Direction: similar approach to constX list. Have a pre-set list is better than true random list) 
4. Learn collusion detection! Soul of the game. (Calculate the overlaps between an enemy and yor player; Notice: find the exact x and y coordinate of an object. calculate the distance between its (x,y) to the edge of the object. Collusion detection basically mean checking if 2 object overlaps. Ex. if Object1 has distance between x,y to edge is in the range of distance between x,y to edge of object2, then they overlapped)
5. Once detect this overlapping. Stop the game.
6. Once time runs out. Stop the game.

*/