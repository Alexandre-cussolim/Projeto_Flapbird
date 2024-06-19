// board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;
let gameStarted = false;

let gameOverImg;

//onload game
let onloadImg;

//bird
let birdWidht = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;

let birdUpImg;
let birdDownImg;
let birdMidImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidht,
    height: birdHeight
}

//pipe
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottonPipeImg;

//physics
let velocityX = -2; //cano vai se mover para esquerda
let velocityY = 0; // velocidade que o passaro vai pular
let gravity = 0.4;


let gameOver = false
let score = 0

//score logic
let scoreImage = [];
for (let i = 0; i < 10; i++) {
    let img = new Image();
    img.src = `./assets/${i}.png`;
    scoreImage.push(img);
}

//audio
let hitSound;
let wingSound;
let pointSound;


window.onload = function () {
    board = document.getElementById("gameCanvas");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");


    // load images

    onloadImg = new Image()
    onloadImg.src = "./assets/message.png"
    onloadImg.onload = function (){
        context.drawImage(
            onloadImg,
            (boardWidth - onloadImg.width) / 2,
            (boardHeight - onloadImg.height) / 2,
            onloadImg.width,
            onloadImg.height
        )
    }

    birdUpImg = new Image()
    birdUpImg.src = './assets/redbird-upflap.png';

    birdDownImg = new Image()
    birdDownImg.src = '/assets/redbird-downflap.png';

    birdMidImg = new Image()
    birdMidImg.src = '/assets/redbird-midflap.png';
    birdMidImg.onload = function (){
        context.drawImage(
            birdMidImg,
            bird.x,
            bird.y,
            bird.width,
            bird.height,
        );
    }
    
    topPipeImg = new Image();
    topPipeImg.src = '/assets/toppipe.png';

    bottonPipeImg = new Image();
    bottonPipeImg.src = './assets/bottompipe.png';

    gameOverImg = new Image();
    gameOverImg.src = './assets/gameover.png';


    //load sounds

    hitSound = new Audio('./assets/audios/assets_audios_hit.wav');
    wingSound = new Audio('./assets/audios/assets_audios_wing.wav');
    pointSound = new Audio('./assets/audios/assets_audios_point.wav');

}

window.addEventListener('keydown',() =>{
    
    if (!gameStarted){
        gameStarted = true;

        starGame();
    }
})

function starGame(){
    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
    window.addEventListener("keydown", moveBird);
}

function update(){
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    
    context.clearRect(0, 0, board.width, board.height);


    //bird
    velocityY += gravity;
    let birdImgToUse;
    if(velocityY < 0){
        birdImgToUse = birdUpImg;
    } else if ( velocityY > 0 ){
        birdImgToUse = birdDownImg;
    } else {
        birdImgToUse = birdMidImg;
    }

    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImgToUse, bird.x, bird.y, bird.width, bird.height);

    if(bird.y > board.height){
        gameOver = true;
      }


      //pipe
    for(let i = 0; i < pipeArray.length; i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
         context.drawImage(
            pipe.img,
            pipe.x,
            pipe.y,
            pipe.width,
            pipe.height,
        );

         if(!pipe.passed && bird.x > pipe.x + pipe.width){
            score += 0.5;
            pipe.passed = true;
            pointSound.play();
        }

        if(detecCollision(bird, pipe)){
           gameOver = true;
        }
    }

    //clear pipe
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth){
        pipeArray.shift();
    }

    //score
    drawScore(score)

      if(gameOver){
          hitSound.play();
          context.drawImage(
              gameOverImg,
              (board.width - gameOverImg.width) / 2,
              (board.height - gameOverImg.height) / 2
          );
    }

}

function placePipes () {
    if(gameOver){
        return;
    }
    
    let randompipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 4;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randompipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false

    }
    pipeArray.push(topPipe)

    let bottomPipe = {
        img: bottonPipeImg,
        x: pipeX,
        y: randompipeY  + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false

    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if(e.code == "Space" || e.code == "ArrowUp" || e.code == "keyX"){
        velocityY = -6;
        wingSound.play();
        if(gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false
        }
    }   
}

function detecCollision(a, b) {
    return a.x < b.x + b.width && 
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y+ a.height > b.y;

}

function drawScore(score) {
    let scoreStr = score.toString();
    let digiWidth = scoreImage[0].width;
    let digiHeight = scoreImage[0].height;
    let totalWidth = digiWidth * scoreStr.length;
    
    let startX = (boardWidth - totalWidth) / 2;

    for (let i = 0; i < scoreStr.length; i++) {
        let digit = parseInt(scoreStr[i]);
        let x = startX + i * digiWidth;
        let y = 140;
        context.drawImage(scoreImage[digit], x, y, digiWidth, digiHeight);
    }
}