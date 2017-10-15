(function () {
  'use strict';
  var canvas = document.querySelector("canvas");
  var drawingSurface = canvas.getContext("2d");

  var sprites = [];
  var assetsToLoad = [];
  var missiles = [];
  var enemies = [];

  var backgroundImage = new Image();
  backgroundImage.addEventListener("load", loadHandler, false);
  backgroundImage.src = "./images/tiles.png";
  assetsToLoad.push(backgroundImage);

  var heroImage = new Image();
  heroImage.addEventListener("load", loadHandler, false);
  heroImage.src = "./images/sprites_player_all.png";
  assetsToLoad.push(heroImage);

  var enemyImg = new Image();
  enemyImg.addEventListener("load", loadHandler, false);
  enemyImg.src = "./images/sprites_yanush_all.png";
  assetsToLoad.push(enemyImg);


  var background = Object.create(spriteObject);
  background.image = backgroundImage;
  background.x = 0;
  background.y = 0;
  background.sourceY = 64;
  background.sourceWidth = 960;
  background.sourceHeight = 640;
  background.width = 960;
  background.height = 640;
  sprites.push(background);


  var hero = Object.create(spriteObject);
  hero.image = heroImage;
  hero.x = canvas.width / 2 - hero.width / 2;
  hero.y = canvas.height - hero.height;
  sprites.push(hero);


  var assetsLoaded = 0;


  var enemyFrequency = 120;
  var enemyTimer = 0;


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


  window.addEventListener("keydown", function (event) {
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


  window.addEventListener("keyup", function (event) {
    switch (event.keyCode) {
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

    switch (gameState) {
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
    if (assetsLoaded === assetsToLoad.length) {

      // for (var i = 0; i < images.length; i++) {
      //   images[i].removeEventListener("load", loadHandler, false);
      // }

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

      var scale = missile.y / canvas.height;

      missile.y += missile.vy * scale;
      missile.width = missile.sourceWidth * scale;
      missile.height = missile.sourceHeight * scale;
      missile.x = -1 * (missile.vectorB() - missile.y) / missile.vectorA();


      if (missile.y < canvas.height * 0.2) {
        removeObject(missile, missiles);
        removeObject(missile, sprites);
        i--;
      }
    }

    enemyTimer++;

    if (enemyTimer === enemyFrequency) {
      makeEnemy();
      enemyTimer = 0;
    }

    for (var i = 0; i < enemies.length; i++) {
      var enemy = enemies[i];

      if (enemy.state === enemy.NORMAL) {

        var scale = enemy.y / canvas.height;
        enemy.y += enemy.vy * scale;
        enemy.x = -1 * (enemy.vectorB() - enemy.y) / enemy.vectorA();
        enemy.width = enemy.sourceWidth * scale;
        enemy.height = enemy.sourceHeight * scale;

      }

      if (enemy.y > canvas.height + enemy.height) {
        removeObject(enemy, enemies);
        removeObject(enemy, sprites);
      }
    }

    for (var i = 0; i < enemies.length; i++) {
      var enemy = enemies[i];
      for (var j = 0; j < missiles.length; j++) {
        var missile = missiles[j];
        if (hitTestRectangle(missile, enemy) && enemy.state === enemy.NORMAL) {
          destroyEnemy(enemy);
          removeObject(missile, missiles);
          removeObject(missile, sprites);
          j--;
        }
      }
    }

  }


  function endGame() {

  }

  function render() {
    drawingSurface.clearRect(0, 0, canvas.width, canvas.height);
    if (sprites.length !== 0) {
      for (var i = 0; i < sprites.length; i++) {
        var sprite = sprites[i];
        drawingSurface.drawImage(
          sprite.image,
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
      // return;
    }
    var missile = Object.create(spriteObject);
    missile.image = backgroundImage;
    missile.sourceX = 194;
    missile.sourceY = 0;
    missile.sourceWidth = 32;
    missile.sourceHeight = 32;
    missile.width = 32;
    missile.height = 32;
    missile.x = hero.centerX() - missile.halfWidth();
    missile.y = canvas.height - (hero.height + missile.height);
    missile.startPointX = canvas.width / 2;
    missile.vy = -8;
    missile.endPointX = missile.x;
    missile.endPointY = missile.y;
    sprites.push(missile);
    missiles.push(missile);
  }

  function removeObject(objectToRemove, array) {
    var i = array.indexOf(objectToRemove);
    if (i !== -1) {
      array.splice(i, 1);
    }
  }

  function makeEnemy() {
    var enemy = Object.create(enemyObject);
    enemy.numberOfFrames = 18;
    enemy.image = enemyImg;
    enemy.sourceX = 0;
    enemy.y = 0.2 * canvas.height; //0 - enemy.height;
    enemy.vy = 1;
    var randomPosition = Math.floor(Math.random() * canvas.width / enemy.width);
    enemy.startPointX = canvas.width / 2;
    enemy.x = enemy.startPointX;
    enemy.endPointX = randomPosition * enemy.width;
    enemy.endPointY = canvas.height;
    enemy.firstAnimationFrame = 0;
    enemy.lastAnimationFrame = 18;
    enemy.startAnimation();
    sprites.push(enemy);
    enemies.push(enemy);
  }

  function destroyEnemy(enemy) {
    enemy.state = enemy.DEAD;
    enemy.update();
    setTimeout(removeEnemy, 2000);

    function removeEnemy() {
      removeObject(enemy, enemies);
      removeObject(enemy, sprites);
    }
  }


}());
