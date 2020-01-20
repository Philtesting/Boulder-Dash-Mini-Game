var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var player = document.getElementById("player");
var boulder = document.getElementById("Boulder");
var dirtLight = document.getElementById("Dirt-light");
var dirtDark = document.getElementById("Dirt-dark");
var exit = document.getElementById("Exit");
var key = document.getElementById("Key");
var wall = document.getElementById("Wall");
var playerX= 0;
var playerY= 0;
var playerWidth = (canvas.width)*1/10;
var playerHeight = (canvas.width)*1/10;
var matrixWidth = playerWidth;
var matrixHeight = playerHeight;
var boulderNum = 0;
var keys = 0;
var stop = false;

var matrix = [];
for(var c=-1; c<11; c++) {
    matrix[c] = [];
    for(var r=-1; r<11; r++) {
        matrix[c][r] = { x: 0, y: 0, status: 1, wall: 0};
    }
}

function moveright(){
  for(var c=0; c<10; c ++) {
      for(var r=0; r<10; r ++) {
        if(playerX == matrix[c][r].x && playerY == matrix[c][r].y && playerX < canvas.width-playerWidth){
          if(matrix[c+1][r].status == 3 && matrix[c+2][r].status == 0 ){
              matrix[c+1][r].status = 0;
              matrix[c+2][r].status = 3;
              matrix[c+1][r].wall = false;
              matrix[c+2][r].wall = true;
          }
          if(!matrix[c+1][r].wall) {
            playerX += playerWidth;
            c=10;
            break;
          }
        }
      }
  }
}

function moveleft(){
  for(var c=0; c<10; c ++) {
      for(var r=0; r<10; r ++) {
        if(playerX == matrix[c][r].x && playerY == matrix[c][r].y && playerX > 0){
          if(matrix[c-1][r].status == 3 && matrix[c-2][r].status == 0 ){
            matrix[c-1][r].status = 0;
            matrix[c-2][r].status = 3;
            matrix[c-1][r].wall = false;
            matrix[c-2][r].wall = true;
          }
          if(!matrix[c-1][r].wall) {
            playerX -= playerWidth;
            c=10;
            break;
          }
        }
      }
  }
}

function moveup(){
  for(var c=0; c<10; c ++) {
      for(var r=0; r<10; r ++) {
        if(playerX == matrix[c][r].x && playerY == matrix[c][r].y){
          if(playerY > 0 && !matrix[c][r-1].wall) {
            playerY -= playerHeight;
            c=10;
            break;
          }
        }
      }
  }
}

function movedown(){
  for(var c=0; c<10; c ++) {
      for(var r=0; r<10; r ++) {
        if(playerX == matrix[c][r].x && playerY == matrix[c][r].y && playerY < canvas.width-playerHeight){
          if(!matrix[c][r+1].wall) {
            playerY += playerHeight;
            c=10;
            break;
          }
        }
      }
  }
}


document.addEventListener("keydown", keyDownHandler, false);
window.addEventListener("keydown", noscroll, false);

function keyDownHandler(e) {
  if(e.keyCode == 39) {
      moveright();
  }
  else if(e.keyCode == 37) {
      moveleft();
  }
  else if(e.keyCode == 38){
      moveup();
  }
  else if(e.keyCode == 40){
      movedown();
  }
}

function noscroll(e){
  if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
    e.preventDefault();
  }
}

function drawWall(){
  for(var c=0; c<10; c ++) {
      for(var r=0; r<10; r ++) {
        if (c == 3 || c == 6){
          if(r < 3 || r > 6){
            matrix[c][r].status = 6;
            matrix[c][r].wall = 1;
            continue;
          }
        }
      }
  }
}


function checkPlayerInBlock() {
    for(var c=0; c<10; c++) {
        for(var r=0; r<10; r++) {
            if (c==0&&r==0){
              continue;
            }

            var d = matrix[c][r];
            if(playerX >= d.x  && playerX < d.x+matrixWidth-4 && playerY >= d.y && playerY < d.y+matrixHeight-4) {
              if(d.status == 1) {
                d.status = 0;
                }
              if(d.status == 4){
                document.location.reload();
              }
              if(d.status == 3){
                document.getElementById("myfilter").style.display = "block";
                document.getElementById("myrestartbutton").style.display = "block";
                stop = true;
              }
              if(d.status == 5){
                keys++;
                d.status = 0;
              }
            }
        }
    }
}



function randomBoulder() {
  while(boulderNum <10 ){
    for(var c=0; c<10; c++) {
        for(var r=0; r<10; r++) {
          var rng = Math.random();
          if(c==0||r==0||c==9||r==9||c==3||c==6){
            continue;
          }
          if (rng >= 0.8){
            if (matrix[c][r].status != 6){
              matrix[c][r].status = 3;
              matrix[c][r].wall = true;
              boulderNum++;
            }
          }
          if (boulderNum == 10){
            c=10;
            break;
          }
        }
    }
  }
}

function drawMatrix() {
    for(var c=0; c<10; c++) {
        for(var r=0; r<10; r++) {
          var b = matrix[c][r];
          matrix[0][0].status=0;
          if (keys == 0){
            matrix[0][9].status = 5;
            matrix[9][0].status = 5;
            matrix[9][9].status = 5;

          }
          if (keys == 3){
            matrix[4][0].status=4;
          }
          var matrixX = (c*(matrixWidth));
          var matrixY = (r*(matrixHeight));
          b.x = matrixX;
          b.y = matrixY;
          if(b.status == 4) {
            ctx.beginPath();
            ctx.drawImage(exit,matrixX,matrixY, playerWidth , playerHeight);
            ctx.closePath();
          }
          if(b.status == 1) {
            ctx.beginPath();
            ctx.drawImage(dirtLight,matrixX,matrixY, playerWidth, playerHeight);
            ctx.closePath();
          }
          if (b.status == 3){
            ctx.beginPath();
            ctx.drawImage(boulder,matrixX,matrixY, playerWidth, playerHeight);
            ctx.closePath();
          }
          if(b.status == 0){
            ctx.beginPath();
            ctx.drawImage(dirtDark,matrixX,matrixY, playerWidth, playerHeight);
            ctx.closePath();
          }
          if(b.status == 5){
            ctx.beginPath();
            ctx.drawImage(key,matrixX,matrixY, playerWidth, playerHeight);
            ctx.closePath();
          }
          if(b.status == 6){
            ctx.beginPath();
            ctx.drawImage(wall,matrixX,matrixY, playerWidth, playerHeight);
            ctx.closePath();
          }
        }
    }
}


function drawplayer() {
  ctx.beginPath();
  ctx.drawImage(player,playerX,playerY, playerWidth, playerHeight);
  ctx.closePath();
}

function moveBoulder(){
  for(var c = 0; c < 10; c++) {
      for(var r = 0; r < 10; r++) {
        if(matrix[c][r].status == 3 ){
           if( matrix[c][r+1].status == 0 ){
             matrix[c][r].status = 0;
             matrix[c][r+1].status = 3;
             matrix[c][r].wall = false;
             matrix[c][r+1].wall = true;
             break;
           }
           if( matrix[c+1][r].status == 0 && matrix[c+1][r+1].status == 0 && matrix[c][r+1].status == 3){
             matrix[c][r].status = 0;
             matrix[c+1][r].status = 3;
             matrix[c][r].wall = false;
             matrix[c+1][r].wall = true;
             c=10;
             break;
           }
           if( matrix[c-1][r].status == 0 && matrix[c-1][r+1].status == 0 && matrix[c][r+1].status == 3){
             matrix[c][r].status = 0;
             matrix[c-1][r].status = 3;
             matrix[c][r].wall = false;
             matrix[c-1][r].wall = true;
             c=10;
             break;
           }
        }
      }
  }
}




function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.width);
  drawMatrix();
  randomBoulder();
  checkPlayerInBlock();
  drawWall();
  drawplayer();
  var game = requestAnimationFrame(draw);
  if (stop){
    cancelAnimationFrame(game);
  }
}

draw();
setInterval(moveBoulder, 400);
