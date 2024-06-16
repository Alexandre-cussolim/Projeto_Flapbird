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
let birdX = boardWidth / 8
let birdY = boardHeight / 2

let birdUpImg;
let birdDownImg;
let birdMidImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidht,
    height: birdHeight,
}

//pipe
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg
let bottonPipeImg

//physics
let velocityX = -2; //cano vai se mover para esquerda
let velocityY = 0; // velocidade que o passaro vai pular
let gravity = 0.4;


let gameOver = false
let score = 0

//score logic
let scoreImage = [];
for (let i = 0; i < 10; i++){
    let img = new Image()
    img.src = `./assets/${1}.png`;
    scoreImage.push(img)
}

//audio
let hitSound;
let wingSound;
let pointSound;


window.onload = function () {
    board = document.getElementById('gameCanvas')
    board.height = boardHeight
    board.width = boardWidth
    context = board.getContext('2d')


    // load images

    onloadImg = new Image()
    onloadImg.src = './assets/message.png'
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
    birdUpImg.src = './assets/redbird-upflap.png'

    birdDownImg = new Image()
    birdDownImg.src = '/assets/redbird-downflap.png'

    birdMidImg = new Image()
    birdMidImg.src = '/assets/redbird-midflap.png'
    birdMidImg.onload = function (){
        context.drawImage(
            birdMidImg,
            bird.x,
            bird.y,
            bird.width,
            bird.height,
        )
    }
    
    topPipeImg = new Image()
    topPipeImg.src = '/assets/toppipe.png'

    bottonPipeImg = new Image()
    bottonPipeImg.src = './assets/bottompipe.png'

    gameOverImg = new Image()
    gameOverImg.src = './assets/gameover.png'


    //load sounds

    hitSound = new Audio('./assets/audios/assets_audios_hit.wav')
    wingSound = new Audio('./assets/audios/assets_audios_wing.wav')
    pointSound = new Audio('./assets/audios/assets_audios_point.wav')

}

window.addEventListener('keydown',() =>{
    
    if (!gameStarted){
        gameStarted = true

        starGame()
    }
})

function starGame(){
    requestAnimationFrame(update)
    window.addEventListener('keydown', moveBird)
}

function update(){
    requestAnimationFrame(update)
    if (gameOver) {
        return;
    }
    
    context.clearRect(0, 0, board.width, board.height)


    //bird
    velocityY += gravity
    let birdImgToUse;
    if(velocityY < 0){
        birdImgToUse = birdUpImg
    } else if ( velocityY > 0 ){
        birdImgToUse = birdDownImg
    } else {
        birdImgToUse = birdMidImg
    }

    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImgToUse, bird.x, bird.y, bird.width, bird.height)

    if(bird.y > board.height){
        gameOver = true
      }
  
      if(gameOver){
          hitSound.play()
          context.drawImage(
              gameOverImg,
              (board.width - gameOverImg.width)/2,
              (board.height - gameOverImg.height)/2,
          )
          return
    }

}

function placePipes () {


}

function moveBird () {
    velocityY = -9
    wingSound.play()
    
}

function detecCollision() {


}

function drawScore () {


}