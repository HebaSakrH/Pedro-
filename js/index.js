    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext("2d");
    const scoreElement = document.getElementById("score");
    const restartBtn = document.getElementById("restart");
    restartBtn.style.display = "none";

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
    let bulletY = 0;

    //background
    const starsImg = new Image();
    starsImg.src = "./images/space.png";
    let starsX = 0;
    let stars2 = 0;
    let backgroundX = 0; // Initial horizontal position

    //player
    const playerImg = new Image();
    playerImg.src = "./images/pena2.png";
    //obstecals draw
    const mushroomImg = new Image();
    mushroomImg.src = "./images/mushroom.png";

    const escobarImg = new Image();
    escobarImg.src = "./images/pablo.png";

    const beerImg = new Image();
    beerImg.src = "./images/beer.png";

    const groguImg = new Image();
    groguImg.src = "./images/grogu.png";

    const mandoImg = new Image();
    mandoImg.src = "./images/mando.png";

    const gameSound = new Audio("sounds/theFoyer.wav");
    gameSound.volume = 0.1;
    const bulletSound = new Audio("sounds/pe.wav");
    const beerSlurp = new Audio("sounds/beerSlurp.wav");
    const gameOver = new Audio("sounds/damit.mp3");

    //keyboard keys reference
    let isMovingDown = false;
    let isMovingUp = false;
    let isMovingLeft = false;
    let isMovingRight = false;

    //speed and progress
    let isGameOver = false;
    let score = 0;
    let speed = 2;
    if (speed > 10) {
    speed = 10; // Set a max speed
    }


    window.addEventListener("load", () => {
    //obstcales random possion
    let randomYPlacement = () => {
        let max = canvas.width;
        let min = 0;
        let randomY = Math.floor(Math.random() * (max - min + 1) + min);
        return randomY;
    };

    let obstaclesArr = [
        {
        Image: mushroomImg,
        x: 800,
        y: randomYPlacement(),
        width: 80,
        height: 80,
        },
        {
        Image: escobarImg,
        x: 1000,
        y: randomYPlacement(),
        width: 250,
        height: 150,
        },
        { Image: groguImg, x: 800, y: randomYPlacement(), width: 150, height: 150 },
        { Image: mandoImg, x: 900, y: randomYPlacement(), width: 150, height: 100 },
    ];
    let bulletsArr = [];

    //Game Loop
    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(starsImg, 0, 0, canvas.width, canvas.height);
        gameSound.play();
        backgroundX -= 1; // Adjust speed (lower values = slower movement)
        if (backgroundX <= -canvas.width) {
        backgroundX = 0; // Reset position for seamless looping
        }
    
        // Draw the background twice for seamless scrolling
        ctx.drawImage(starsImg, backgroundX, 0, canvas.width, canvas.height);
        ctx.drawImage(starsImg, backgroundX + canvas.width, 0, canvas.width, canvas.height);
        ctx.drawImage(playerImg, playerX, playerY, 300, 250);
        
    playerX = Math.max(0, Math.min(canvas.width - playerWidth, playerX));
    playerY = Math.max(0, Math.min(canvas.height - playerHeight, playerY));
        

        let drawBullet = (bulletX, bulletY) => {
        ctx.drawImage(beerImg, bulletX, bulletY, 80, 50);
        };
        ctx.drawImage(beerImg, beerX, beerY, 150, 70);
        //obstcales loop
        for (let i = 0; i < obstaclesArr.length; i++) {
        ctx.drawImage(
            obstaclesArr[i].Image,
            obstaclesArr[i].x,
            obstaclesArr[i].y,
            obstaclesArr[i].width,
            obstaclesArr[i].height
        );

        obstaclesArr[i].x -= speed;
        console.log(speed);
        if (obstaclesArr[i].x < 0) {
            obstaclesArr[i].x = 900;
            obstaclesArr[i].y = randomYPlacement();
            speed++;
        }

        if (
            playerX + playerWidth > obstaclesArr[i].x &&
            playerX < obstaclesArr[i].x + obstaclesArr[i].width &&
            playerY + playerHeight > obstaclesArr[i].y &&
            playerY < obstaclesArr[i].y + obstaclesArr[i].height
        ) {
            isGameOver = true;
        }

        if (
            playerX < beerX + beerWidth &&
            playerX + playerWidth > beerX &&
            playerY < beerY + beerHeight &&
            playerHeight + playerY > beerY
        ) {
            score++;
            beerX = 1000;
            beerY = randomYPlacement();
            const scoreElement = document.getElementById("score");
    scoreElement.innerHTML = score; // Updates the score correctly

            beerSlurp.play();

            if (score % 10 === 0 && score > 0) {
            speed += 0.5; // Gradually increase speed
            }
        }

        beerX -= 2;
        if (beerX < 0) {
            beerX = 1000;
            beerY = randomYPlacement();
        }
        bulletsArr.forEach((bullet, index) => {
            // Draw the bullet
            drawBullet(bullet.bulletX, bullet.bulletY);

            // Update the bullet's position
            bullet.bulletX += 5;

            // Check if bullet is off-screen
            if (bullet.bulletX > canvas.width) {
            bulletsArr.splice(index, 1); // Remove bullet if off-screen
            }

            // Check collision with obstacles
            for (let i = 0; i < obstaclesArr.length; i++) {
            if (
                bullet.bulletX < obstaclesArr[i].x + obstaclesArr[i].width &&
                bullet.bulletX > obstaclesArr[i].x &&
                bullet.bulletY < obstaclesArr[i].y + obstaclesArr[i].height &&
                bullet.bulletY > obstaclesArr[i].y
            ) {
                score += 10;
                bulletSound.play();
                obstaclesArr[i].x = 3000; // Move obstacle off-screen or reset it
                bulletsArr.splice(index, 1); // Remove the bullet upon collision
                scoreElement.innerHTML = score;
            }
            }
        });
        }

       
    if (isGameOver) {
        restartBtn.style.display = "block";
        restartBtn.style.position = "absolute";
        restartBtn.style.top = "400px"; 
        restartBtn.style.left = "50%";
        restartBtn.style.transform = "translateX(-50%)";
        
        cancelAnimationFrame(animationId);
        ctx.fillStyle = "#FF00FF";
        ctx.shadowColor = "yellow";
        ctx.shadowBlur = 40;
        ctx.font = "bold 30px 'Press Start 2P', cursive";
        ctx.textAlign = "center";
        ctx.fillText("You killed Pedro :(", canvas.width / 2, 200);  // Move text higher
        gameOver.play();
      } else {
        animationId = requestAnimationFrame(animate);
      }

        //player movment
        if (isMovingDown) {
        playerY += 3;
        } else if (isMovingUp) {
        playerY -= 3;
        } else if (isMovingLeft) {
        playerX -= 3;
        } else if (isMovingRight) {
        playerX += 3;
        }
    };

    let restartGame = () => {
        window.location.reload();
    };

    const startGame = () => {
        document.querySelector(".game-intro").style.display = "none";
        document.querySelector("#game-board").style.display = "block";
        animate();
    };

    document.getElementById("start-button").addEventListener("click", () => {
        startGame();
        console.log("startBtn clicked");
    });

    restartBtn.addEventListener("click", () => {
        restartGame();
        console.log("start game");
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "ArrowUp") {
        isMovingUp = true;
        } else if (event.key === "ArrowDown") {
        isMovingDown = true;
        } else if (event.key === "ArrowLeft") {
        isMovingLeft = true;
        } else if (event.key === "ArrowRight") {
        isMovingRight = true;
        }
    });

    document.addEventListener("keydown", (event) => {
        console.log(event);
        if (event.code === "Space") {
        bulletX = playerX + playerWidth / 2;
        bulletY = playerY + 100;
        let bullet = { bulletX, bulletY };
        bulletsArr.push(bullet);
        console.log(bulletsArr);
        console.log("drawBullet");
        }
    });

    document.addEventListener("keyup", function (event) {
        isMovingDown = false;
        isMovingUp = false;
        isMovingLeft = false;
        isMovingRight = false;
    });


    const fullscreenButton = document.createElement('button');
    fullscreenButton.innerText = 'Fullscreen';
    fullscreenButton.style.position = 'absolute';
    fullscreenButton.style.top = '20px';
    fullscreenButton.style.right = '20px';
    fullscreenButton.style.padding = '10px';
    fullscreenButton.style.fontSize = '16px';
    fullscreenButton.style.cursor = 'pointer';

    document.body.appendChild(fullscreenButton);

    fullscreenButton.addEventListener('click', () => {
        if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        }
    });

    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
        fullscreenButton.innerText = 'Fullscreen';
        } else {
        fullscreenButton.innerText = 'Exit Fullscreen';
        }
    });
    });