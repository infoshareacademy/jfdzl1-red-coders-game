(function (spriteObject, enemyObject, messageObject) {
    'use strict';
    var canvas = document.querySelector('canvas');
    var drawingSurface = canvas.getContext('2d');
    var sprites = [];
    var assetsToLoad = [];
    var missiles = [];
    var enemies = [];
    var messages = [];
    var infoClouds = [];
    var assetsLoaded = 0;
    var enemyFrequency = 120;
    var enemyTimer = 0;
    var LOADING = 0;
    var PLAYING = 1;
    var OVER = 2;
    var SCORE_MESS = 'Score: ';
    var START_LIVES = 5;
    var START_BORING = 6;
    var LIVE_MESS = 'Lives: ';
    var gameState = LOADING;
    var scores = 0;
    var boring = 0;

    //Directions
    var moveRight = false;
    var moveLeft = false;
    var shoot = false;
    var spaceKeyIsDown = false;
    var touchX = canvas.width / 2;
    var touchY = 0;
    var isTouched = false;
    var startTouch = false;

    var backgroundImage = new Image();
    backgroundImage.addEventListener('load', loadHandler, false);
    backgroundImage.src = './images/tiles.png';
    assetsToLoad.push(backgroundImage);

    var heroImage = new Image();
    heroImage.addEventListener('load', loadHandler, false);
    heroImage.src = './images/sprites_player.png';
    assetsToLoad.push(heroImage);

    var enemyImg = new Image();
    enemyImg.addEventListener('load', loadHandler, false);
    enemyImg.src = './images/sprites_yanush.png';
    assetsToLoad.push(enemyImg);

    var infoCloudsImage = new Image();
    infoCloudsImage.addEventListener('load', loadHandler, false);
    infoCloudsImage.src = './images/sprites_yanush.png';
    assetsToLoad.push(infoCloudsImage);


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
    hero.firstAnimationFrame = 0;
    hero.lastAnimationFrame = 2;
    hero.columnCount = 3;
    hero.timerCounter = 15;
    hero.lives = START_LIVES;
    sprites.push(hero);

    var scoreDisplay = Object.create(messageObject);
    scoreDisplay.font = 'normal bold 40px HVD_Peace';
    scoreDisplay.fillStyle = '#008000';
    scoreDisplay.x = Math.floor(canvas.width * 0.02);
    scoreDisplay.y = Math.floor(canvas.height * 0.02);
    scoreDisplay.text = returnScoreText();
    scoreDisplay.visible = true;
    messages.push(scoreDisplay);

    var livesDisplay = Object.create(messageObject);
    livesDisplay.font = 'normal bold 40px HVD_Peace';
    livesDisplay.fillStyle = '#008000';
    livesDisplay.x = Math.floor(canvas.width * 0.3);
    livesDisplay.y = Math.floor(canvas.height * 0.02);
    livesDisplay.text = returnLivesText();
    livesDisplay.visible = true;
    messages.push(livesDisplay);

    var boringMetterMessage = Object.create(messageObject);
    boringMetterMessage.font = 'normal bold 40px HVD_Peace';
    boringMetterMessage.fillStyle = '#15009A';
    boringMetterMessage.x = Math.floor(canvas.width * 0.55);
    boringMetterMessage.y = Math.floor(canvas.height * 0.02);
    boringMetterMessage.text = returnBoringText();
    boringMetterMessage.visible = true;
    messages.push(boringMetterMessage);

    var endGameMessage = Object.create(messageObject);
    endGameMessage.font = 'normal bold 120px Sickness';
    endGameMessage.fillStyle = '#FF2000';
    endGameMessage.x = Math.floor(canvas.width / 2);
    endGameMessage.y = Math.floor(canvas.height / 2);
    endGameMessage.textAlign = 'center';
    endGameMessage.textBaseline = 'middle';
    endGameMessage.text = 'You lose';
    endGameMessage.visible = false;
    messages.push(endGameMessage);


    window.addEventListener('keydown', function (event) {

        switch (event.key) {
            case  'ArrowLeft':
                moveLeft = true;
                event.preventDefault();
                break;
            case 'ArrowRight':
                moveRight = true;
                event.preventDefault();
                break;
            case ' ':
                event.preventDefault();
                if (!spaceKeyIsDown) {
                    shoot = true;
                    spaceKeyIsDown = true;
                }
        }
    }, false);

    window.addEventListener('keyup', function (event) {

        switch (event.key) {
            case 'ArrowLeft':
                moveLeft = false;
                event.preventDefault();
                break;
            case 'ArrowRight':
                moveRight = false;
                event.preventDefault();
                break;
            case  ' ':
                spaceKeyIsDown = false;
                event.preventDefault();
        }
    }, false);

    canvas.addEventListener('touchmove', touchmoveHandler, false);
    canvas.addEventListener('touchstart', touchStartFireHandler, false);
    canvas.addEventListener('touchend', touchEndFireHandler, false);

    function update() {
        requestAnimationFrame(update, canvas);
        switch (gameState) {
            case LOADING:
                console.log('Loading...');
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
            gameState = PLAYING;
        }
    }

    function touchmoveHandler(event) {
        event.preventDefault();
        touchX = event.targetTouches[0].pageX - canvas.offsetLeft;
        touchY = event.targetTouches[0].pageY - canvas.offsetTop;


        var displayedCanvas = $('.canvas');
        var widthOnView = displayedCanvas.width();
        var heightOnView = displayedCanvas.height();
        touchX = touchX * (canvas.width / widthOnView );
        touchY = touchY * (canvas.height / heightOnView);
        var offsetToMakeHeroBigger = hero.width;
        if (touchTestRectangle(touchX, touchY, hero, offsetToMakeHeroBigger)) {
            isTouched = true;
            startTouch = false;
        }
    }

    function touchStartFireHandler() {
        startTouch = true;
    }

    function touchEndFireHandler() {
        if (startTouch) {
            startTouch = false;
            shoot = true;
        }
    }

    function playGame() {
        if (moveLeft && !moveRight) {
            hero.vx = -8;
            hero.updateAnimation();
        }
        if (moveRight && !moveLeft) {
            hero.vx = 8;
            hero.updateAnimation();
        }
        if (!moveRight && !moveLeft) {
            hero.vx = 0;
            hero.currentFrame = 0;
            hero.updateSourceImg();
        }
        if (shoot) {
            fireMissile();
            shoot = false;
        }

        if (isTouched) {
            hero.x = touchX - (hero.halfWidth());
            isTouched = false;
        } else {
            hero.x = Math.max(0, Math.min(hero.x + hero.vx, canvas.width - hero.width));
        }

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
                enemy.updateAnimation();
            }

            if (enemy.NORMAL && enemy.y > (canvas.height + enemy.height)) {
                boring++;
                if (START_BORING - boring < 0) {
                    boring = 0;
                    hero.lives--;
                    if (hero.lives <= 0) {
                        gameState = OVER;
                    }
                }
                boringMetterMessage.text = returnBoringText();
                livesDisplay.text = returnLivesText();
                removeObject(enemy, enemies);
                removeObject(enemy, sprites);
            }

            if (enemy.state === enemy.ESCAPE) {
                enemy.x += enemy.vx;
                enemy.updateAnimation();
                if (enemy.x < (0 - enemy.width) || enemy.x > (canvas.width + enemy.width)) {
                    removeObject(enemy, enemies);
                    removeObject(enemy, sprites);
                }
            }
        }
        checkIfHit();
        checkMonsterTouchHero();

    }

    function endGame() {
        endGameMessage.visible = true;
    }

    function checkIfHit() {
        for (var i = 0; i < enemies.length; i++) {
            var enemy = enemies[i];
            for (var j = 0; j < missiles.length; j++) {
                var missile = missiles[j];
                if (enemy.state === enemy.NORMAL && hitTestRectangle(missile, enemy)) {
                    // destroyEnemy(enemy);

                    escapeEnemy(enemy);
                    scores++;
                    removeObject(missile, missiles);
                    removeObject(missile, sprites);
                    j--;
                    scoreDisplay.text = SCORE_MESS + scores;
                }
            }
        }
    }

    function checkMonsterTouchHero() {
        for (var i = 0; i < enemies.length; i++) {
            var enemy = enemies[i];
            if (hitTestRectangle(enemy, hero)) {
                destroyEnemy(enemy);
                hero.lives--;
                removeObject(enemy, enemies);
                removeObject(enemy, sprites);

                livesDisplay.text = LIVE_MESS + hero.lives;
                if (hero.lives === 0) {
                    gameState = OVER;
                }
            }
        }
    }

    function render() {
        drawingSurface.clearRect(0, 0, canvas.width, canvas.height);
        if (sprites.length !== 0) {
            var sprite;
            sprite = sprites[0];
            drawSprite(sprite);
            for (var i = sprites.length - 1; i > 0; i--) {
                sprite = sprites[i];
                drawSprite(sprite);
            }

            function drawSprite(sprite) {
                drawingSurface.drawImage(
                    sprite.image,
                    sprite.sourceX, sprite.sourceY,
                    sprite.sourceWidth, sprite.sourceHeight,
                    Math.floor(sprite.x), Math.floor(sprite.y),
                    sprite.width, sprite.height
                );
            }
        }
        if (messages.length !== 0) {
            for (var i = 0; i < messages.length; i++) {
                var message = messages[i];
                if (message.visible) {
                    drawingSurface.font = message.font;
                    drawingSurface.fillStyle = message.fillStyle;
                    drawingSurface.textBaseline = message.textBaseline;
                    drawingSurface.textAlign = message.textAlign;
                    drawingSurface.fillText(message.text, message.x, message.y);
                }
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
        missile.x = hero.centerX() + missile.width;
        missile.y = canvas.height - (hero.height - 2 * missile.height);
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
        var enemyType = Math.floor(Math.random() * 2);
        var enemy = Object.create(enemyObject);
        enemy.numberOffFrames = 3;
        enemy.numberOffColumns = 3;
        enemy.image = enemyImg;
        enemy.sourceX = 0;
        enemy.y = 0.2 * canvas.height; //0 - enemy.height;
        enemy.vy = 1;
        var randomPosition = Math.floor(Math.random() * canvas.width / enemy.width);
        enemy.startPointX = canvas.width / 2;
        enemy.x = enemy.startPointX;
        enemy.endPointX = randomPosition * enemy.width;
        enemy.endPointY = canvas.height;
        switch (enemyType) {
            case 0:
                enemy.firstAnimationFrame = 0;
                enemy.lastAnimationFrame = 2;
                break;
            case 1:
                enemy.firstAnimationFrame = 3;
                enemy.lastAnimationFrame = 5;
                break;
        }

        sprites.push(enemy);
        enemies.push(enemy);
    }

    function makeCloudInf(type) {
        var infoCloud = new infoCloudObject;

    }

    function returnBoringText() {
        return 'Boring: ' + '☹'.repeat(boring);
    }

    function returnScoreText() {
        return 'Score: ' + scores;
    }

    function returnLivesText() {
        return 'Lives: ' + hero.lives;
    }

    function escapeEnemy(enemy) {
        enemy.state = enemy.ESCAPE;
        if (enemy.x >= background.halfWidth()) {
            enemy.vx = 2;
        } else {
            enemy.vx = -2;
        }
        enemy.update();
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

//Start here
    update();
}(spriteObject, enemyObject, messageObject));
