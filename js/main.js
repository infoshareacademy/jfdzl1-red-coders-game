(function(){
  'use strict';
  var canvas = document.querySelector("canvas");
  var drawingSurface = canvas.getContext("2d");

  var sprites = [];
  var assetsToLoad = [];
  var missiles = [];



  var background = Object.create(spriteObject);
  background.x = 0;
  background.y = 0;
  background.sourceY = 64;
  background.sourceWidth = 960;
  background.sourceHeight = 640;
  background.width = 960;
  background.height = 640;
  sprites.push(background);

  var hero = Object.create(spriteObject);
  hero.x = canvas.width / 2 - hero.width / 2;
  hero.y =canvas.height - hero.height;
  sprites.push(hero);


  var image = new Image();
  image.addEventListener("load", loadHandler, false);
  image.src = "./images/tiles.png";
  assetsToLoad.push(image);

  var assetsLoaded = 0;

  var LOADING = 0;
  var PLAYING = 1;
  var OVER = 2;
  var gameState = LOADING;

  //Key codes and directions

  var RIGHT = 39;
  var LEFT = 37;
  var SPACE = 32;

  var moveRight = false;
  var moveLeft = false;
  var shoot = false;
  var spaceKeyIdDown = false;


  window.addEventListener("keydown", function(event) {
    switch (event.keyCode) {
      case  LEFT:
        moveLeft = true;
        break;
      case RIGHT:
        moveRight = true;
        break;
      case SPACE:
        if (!spaceKeyIdDown) {
        shoot = true;
        spaceKeyIdDown = true;
      }


    }
  }, false);


  window.addEventListener("keyup", function(event){
    switch(event.keyCode){
      case LEFT:
        moveLeft = false;
        break;
      case RIGHT:
        moveRight = false;
        break;
      case  SPACE:
        spaceKeyIdDown = false;
    }
  }, false);


//Start here
  update();

  function update() {
    requestAnimationFrame(update, canvas);

    switch(gameState){
      case LOADING:
        console.log("Loading...");
        break;
      case PLAYING:
        playGame();
        break;
      case OVER:
        endGame();
        break;
    }
    render();
  }

  function loadHandler() {
    assetsLoaded++;
    if(assetsLoaded === assetsToLoad.length) {
      image.removeEventListener("load", loadHandler, false);
      gameState = PLAYING;

    }

  }

  function playGame() {
    if (moveLeft && !moveRight) {
      hero.vx = -8;
    }
    if (moveRight && !moveLeft) {
      hero.vx = 8;
    }
    if (!moveRight && !moveLeft) {
      hero.vx = 0;
    }
    if (shoot) {
      fireMissile();
      shoot = false;
    }

    hero.x = Math.max(0, Math.min(hero.x + hero.vx, canvas.width - hero.width));

    for (var i = 0; i < missiles.length; i++) {
      var missile = missiles[i];
      missile.y += missile.vy;
      if (missile.y < 0 - missile.height) {
        removeObject(missile, missiles);
        removeObject(missile, sprites);
        i--;
      }
    }

  }


  function endGame() {

  }

  function render() {
    drawingSurface.clearRect(0, 0, canvas.width, canvas.height);
    if (sprites.length !== 0){
      for (var i = 0; i < sprites.length; i++) {
        var sprite = sprites[i];
        drawingSurface.drawImage(
          image,
          sprite.sourceX, sprite.sourceY,
          sprite.sourceWidth, sprite.sourceHeight,
          Math.floor(sprite.x), Math.floor(sprite.y),
          sprite.width, sprite.height
        );
      }

    }
  }

  function fireMissile() {

    if (missiles.length >= 3) {
      return;
    }
    var missile = Object.create(spriteObject);
    missile.sourceX = 128;
    missile.sourceY = 0;
    missile.sourceWidth = 32;
    missile.sourceHeight = 32;
    missile.width = 32;
    missile.height = 32;

    missile.x = hero.centerX() -  missile.halfWidth();
    missile.y = canvas.height - (hero.height + missile.height);
    missile.vy = -8;
    sprites.push(missile);
    missiles.push(missile);

  }

  function removeObject(objectToRemowe, array){
    var i = array.indexOf(objectToRemowe);
    if (i !== -1) {
      array.splice(i);
    }

  }

}());
