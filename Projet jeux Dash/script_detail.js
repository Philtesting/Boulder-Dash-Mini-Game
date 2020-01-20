

// Variables
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

var canvas = document.getElementById("myCanvas");          // Prend dans l'index.html le canvas
var ctx = canvas.getContext("2d");                         // Le transform en 2d pour pouvoir dessiner (rectangle, triangle...)
var player = document.getElementById("player");            //Prend dans l'index.html l'image du joueur
var boulder = document.getElementById("Boulder");          //Prend dans l'index.html la image du Boulder
var dirtLight = document.getElementById("Dirt-light");     //Prend dans l'index.html la image de la terre
var dirtDark = document.getElementById("Dirt-dark");       //Prend dans l'index.html la image de la terre
var exit = document.getElementById("Exit");                //Prend dans l'index.html la image de la sortis
var key = document.getElementById("Key");                  //Prend dans l'index.html la image de la clé
var wall = document.getElementById("Wall");                //Prend dans l'index.html la image du mur
var playerX= 0;                                            // coordonée X du joueur (coordonée horizontale de gauche a droite) avec x = 0 tout a gauche et x = 500px(taille du canvas) tout a droite
var playerY= 0;                                            // coordonée Y du joueur (coordonée verticale de haut en bas) avec y = 0 tout en haut et y = -500px(taille du canvas) tout en bas
var playerWidth = (canvas.width)*1/10;                     // Width du joueur (on divise le canvas par 10)
var playerHeight = (canvas.width)*1/10;                    // Height du joueur (on divise le canvas par 10)
var matrixWidth = playerWidth;                             // Width de un carré dans la matrix (même que dans playerWidth)
var matrixHeight = playerHeight;                           // Height de un carré dans la matrix (même que dans playerHeight)
var boulderNum = 0;                                        // Valeur initial des Boulder pour plus tard en avoir 10
var keys = 0;                                              // Valeur initial des Clé pour plus tard faire aparaitre la sortie

var matrix = [];                                           // matrix est une liste
for(var c=-1; c<11; c++) {                                 // matrix vas de -1 à 10 (soit 12 case à cause du 0) avec c = colone
    matrix[c] = [];                                        // ce qu'il y a dans la colone c
    for(var r=-1; r<11; r++) {                             // r = "row" = "ligne" en anglais
        matrix[c][r] = { x: 0, y: 0, status: 1, wall: 0};  // dictionnaire a l'interieur de r, avec
                                                           // x = coordonée de X(voir ligne 14) dans canvas
                                                           // y = coordonée de Y(voir ligne 14) dans canvas
                                                           // status = determine si c'est de la terre, boulder, clé, sortie, mûre
                                                           // wall = verifie si le joueur peux passer a travers
    }
}
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Mouvement
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function moveright(){                                                     // fonction pour aller a droite (quand on click sur le button "right" il fait cette fonction)
  for(var c=0; c<10; c ++) {                                              // parcourir toute la matrix 10 colone et 10 ligne (parceque on compte le 0)
      for(var r=0; r<10; r ++) {
        if(
           playerX == matrix[c][r].x &&                                   //Si la coordenée de X du joueur == la coordonée de X de la matrix
           playerY == matrix[c][r].y &&                                   //Si la coordenée de Y du joueur == la coordonée de Y de la matrix
           playerX < canvas.width-playerWidth                             //Si la coordenée de X du joueur ne depasse pas la taille du canvas
          ){
             if(matrix[c+1][r].status == 3 &&                             //Si la case de droite est une Boulder
                matrix[c+2][r].status == 0    ){                          //et la case a coté du Boulder est vide
                    matrix[c+1][r].status = 0;                            //case Boulder devient vide
                    matrix[c+2][r].status = 3;                            //case vide devient un Boulder
                    matrix[c+1][r].wall = false;                          //on peux traverser l'ancienne case Boulder
                    matrix[c+2][r].wall = true;                           //on ne peux plus traverser l'ancienne case vide
                }
              if(!matrix[c+1][r].wall) {                                  // Si on peux traverser la case (la case n'est pas wall)
                playerX += playerWidth;                                   // le joueur bouje une case a droite
                c=10;                                                     // arrete le 1er for
                break;                                                    // arrete le 2eme for
              }
        }
      }
  }
}

function moveleft(){                                                      //même que moveright mais avec x qui vas a gauche
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

function moveup(){                                                      //même que moveright mais attention y = 0 est en haut et y = -500 est en bas
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

function movedown(){                                                   //même que moveright mais attention y = 0 est en haut et y = -500 est en bas
  for(var c=0; c<10; c ++) {
      for(var r=0; r<10; r ++) {
        if(
            playerX == matrix[c][r].x &&
            playerY == matrix[c][r].y &&
            playerY < canvas.width-playerHeight
          ){
              if(!matrix[c][r+1].wall) {
                playerY += playerHeight;
                c=10;
                break;
              }
            }
      }
  }
}


document.addEventListener("keydown", keyDownHandler, false);           //quand on click dans le clavier il fait la fonction keyDownHandler
window.addEventListener("keydown", noscroll, false);                   //appelle fonction pour que les fleche ne bouje pas la page web

function keyDownHandler(e) {
  if(e.keyCode == 39) {                                                //s'il cilque dans la fleche de droite dans le clavier
      moveright();                                                     //fait fonction moveright
  }
  else if(e.keyCode == 37) {                                           //s'il cilque dans la fleche de gauche dans le clavier
      moveleft();
  }
  else if(e.keyCode == 38){                                            //s'il cilque dans la fleche du haut dans le clavier
      moveup();
  }
  else if(e.keyCode == 40){                                            //s'il cilque dans la fleche de bas dans le clavier
      movedown();
  }
}
function noscroll(e){
  if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
    e.preventDefault();
  }
}
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Animation
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function drawMatrix() {                                              //dessine la matrix
    for(var c=0; c<10; c++) {
        for(var r=0; r<10; r++) {
          var b = matrix[c][r];
          matrix[0][0].status=0;                                    //dans la case 0x0 on a de la terre noir
          if (keys == 0){                                           //si on atrappe la 1er clé on ne la redessine pas
            matrix[0][9].status = 5;                                //dans la case 0x9 on a une clé
            matrix[9][0].status = 5;
            matrix[9][9].status = 5;

          }
          if (keys == 3){                                          //Quand on a les 3 clé la sortis apparait
            matrix[4][0].status=4;
          }
          var matrixX = (c*(matrixWidth));                        //la coordonné X de la matrice
          var matrixY = (r*(matrixHeight));                       //la coordonné Y de la matrice
          b.x = matrixX;
          b.y = matrixY;
          if(b.status == 4) {                                     //si le status == 4 alors dessiné la sortie
            ctx.beginPath();
            ctx.drawImage(exit,matrixX,matrixY, playerWidth , playerHeight); //drawImage(variable ,coordonné X, coordonné Y, Width, Height)
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


function checkPlayerInBlock() { //voir si la coordonée du joueur touche d'autre block
    for(var c=0; c<10; c++) {
        for(var r=0; r<10; r++) {
            if (c==0&&r==0){
              continue;
            }

            var d = matrix[c][r];
            if(playerX >= d.x  && playerX < d.x+matrixWidth-4 && playerY >= d.y && playerY < d.y+matrixHeight-4) {
              if(d.status == 1) { //s'il touche la terre marron
                d.status = 0; // elle devient noir
                }
              if(d.status == 4){ //s'il touche la sortie
                document.location.reload(); //refresh de la page
              }
              if(d.status == 3){
                document.getElementById("myfilter").style.display = "block"; //fait apparaitre le rectagle gris en changent le display de null-->block
                document.getElementById("myrestartbutton").style.display = "block";
                cancelAnimationFrame(game); //arrete l'animation
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
          if (rng >= 0.9){
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
  ctx.clearRect(0, 0, canvas.width, canvas.width); // efface tout le canvas
  drawMatrix();                                    // redessine la matrix
  randomBoulder();
  checkPlayerInBlock();
  drawWall();
  drawplayer();
  var game = requestAnimationFrame(draw);        //continue de faire la fonction draw a l'infinit
}

draw();
setInterval(moveBoulder, 300);                  // fait la fonction mouveBoulder avec une vitesse de 300fps
