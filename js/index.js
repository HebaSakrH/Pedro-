 


const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')
const scoreElement = document.getElementById('score');
const restartBtn = document.getElementById('restart');
restartBtn.style.display = 'none';


let playerX = 0;
let playerY = 0;
let playerWidth = 150;
let playerHeight = 150;
let animationId;
let beerX = 900;
let beerY = 0;
let beerWidth = 150;
let beerHeight = 70;
 
let bulletX = 0;
let bulletY =  0;

//background
const starsImg = new Image()
starsImg.src = './images/space.png'
let starsX = 0;
let stars2 = 0;
//player 
const playerImg = new Image()
playerImg.src = './images/pena2.png'
//obstecals draw
const mushroomImg = new Image()
mushroomImg.src = './images/mushroom.png'

const escobarImg = new Image()
escobarImg.src = './images/pablo.png'

const beerImg = new Image()
beerImg.src = './images/beer.png'

const groguImg = new Image()
groguImg.src = './images/grogu.png'

const mandoImg = new Image()
mandoImg.src =  './images/mando.png'


const gameSound = new Audio('sounds/theFoyer.wav')
gameSound.volume = 0.1;
const bulletSound = new Audio('sounds/pe.wav')
const beerSlurp = new Audio('sounds/beerSlurp.wav')
const gameOver = new Audio ('sounds/damit.mp3')


//keyboard keys reference 
let isMovingDown = false;
let isMovingUp = false;
let isMovingLeft = false;
let isMovingRight = false;

//speed and progress
let isGameOver = false;
let score = 0;
let speed = 2;


window.addEventListener('load', () => {
    
    //obstcales random possion 
let randomYPlacement = () => {
let max = canvas.width ;
let min = 0;
let randomY = Math.floor(Math.random() * (max - min + 1) + min);
return randomY;
}
    
let obstaclesArr = [
{ Image: mushroomImg, x:800,y: randomYPlacement(), width: 80, height: 80 },
{ Image: escobarImg, x: 1000, y: randomYPlacement(), width: 250, height: 150 },
{ Image: groguImg, x: 800, y: randomYPlacement(), width: 150, height: 150 },
{Image: mandoImg, x: 900, y: randomYPlacement(), width: 150, height: 100 }
];   
let bulletsArr = []; 

//Game Loop
const animate = () => {
ctx.clearRect(0 , 0, canvas.width, canvas.height);
ctx.drawImage(starsImg, 0, 0, canvas.width, canvas.height);
gameSound.play()
ctx.drawImage(playerImg, playerX, playerY, 300, 250);

let  drawBullet = (bulletX, bulletY ) => {
ctx.drawImage(beerImg, bulletX, bulletY, 80, 50)
} 
ctx.drawImage(beerImg, beerX, beerY, 150, 70);
//obstcales loop
for (let i = 0; i < obstaclesArr.length; i++) {
ctx.drawImage(
obstaclesArr[i].Image,
obstaclesArr[i].x,
obstaclesArr[i].y,
obstaclesArr[i].width,
obstaclesArr[i].height
)
    
obstaclesArr[i].x -= speed;
console.log(speed)
if(obstaclesArr[i].x < 0) {
obstaclesArr[i].x = 900;
obstaclesArr[i].y = randomYPlacement()
speed++
} 
     
if (
playerX < obstaclesArr[i].x + obstaclesArr[i].width &&
playerX + playerWidth > obstaclesArr[i].x &&
playerY < obstaclesArr[i].y + obstaclesArr[i].height &&
playerHeight + playerY > obstaclesArr[i].y
) {
isGameOver = true;
} 

        
if (
playerX < beerX + beerWidth &&
playerX + playerWidth > beerX &&
playerY < beerY + beerHeight &&
playerHeight + playerY > beerY
) {
score++
beerX = 1000;
beerY = randomYPlacement()
scoreElement.innerHTML = score
beerSlurp.play()
}

beerX -= 2;
if (beerX < 0) {
beerX = 1000;
beerY = randomYPlacement()
}
        


bulletsArr.forEach((bullet, index) => {
drawBullet(bullet.bulletX, bullet.bulletY);
bullet.bulletX += 5;
if (  bullet.bulletX < obstaclesArr[i].x+ obstaclesArr[i].width &&
bullet.bulletX > obstaclesArr[i].x &&
bullet.bulletY < obstaclesArr[i].y + obstaclesArr[i].height &&
bullet.bulletY > obstaclesArr[i].y) {
score += 10; 
bulletSound.play()
obstaclesArr[i].x = 3000;
bulletsArr.splice(index, 1)
scoreElement.innerHTML = score
}
});   
}
    
    

if (isGameOver) {
restartBtn.style.display ='block';
cancelAnimationFrame(animationId);
ctx.fillStyle = '#BF4D28';
ctx.font = "100px Press Start 2P"
ctx.fillText('You killed Pedro :(', 700, 300)
gameOver.play()
//  ctx.drawImage(gameOverImg, gameOverX, gameOverY, 100, 350)
}  else {
animationId = requestAnimationFrame(animate);
}  

    //player movment 
if(isMovingDown){
playerY +=3
} else if (isMovingUp) {
 playerY -=3
} else if (isMovingLeft) {
 playerX -=3 
} else if (isMovingRight) {
playerX +=3
}      
}

let restartGame = () => {
window.location.reload();
}


const startGame = () => {
 document.querySelector('.game-intro').style.display = 'none';
document.querySelector('#game-board').style.display = 'block';
animate()
};


document.getElementById('start-button').addEventListener('click', () => {
startGame()
console.log('startBtn clicked')   
});


restartBtn.addEventListener('click', () => {
restartGame()
console.log( 'start game')
});

document.addEventListener('keydown', function(event) {
if (event.key === 'ArrowUp') {
isMovingUp = true;
} else if (event.key === 'ArrowDown') {
isMovingDown = true;
} else if (event.key === 'ArrowLeft') {
isMovingLeft = true;
} else if (event.key === 'ArrowRight') {
isMovingRight = true;
} 
});

document.addEventListener('keydown', (event) => {
console.log(event, )
if (event.code === 'Space') {
bulletX = playerX + (playerWidth / 2);
bulletY = playerY + 100 ;
let bullet = {bulletX, bulletY};
bulletsArr.push(bullet)
console.log(bulletsArr)
console.log('drawBullet')

 }
});

document.addEventListener('keyup', function(event) {
isMovingDown = false;
isMovingUp = false; 
isMovingLeft = false;
isMovingRight = false;
});
        
});  
    
