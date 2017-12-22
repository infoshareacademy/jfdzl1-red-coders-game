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
    var velocity = 1;
    var enemyTimer = 0;
    var LOADING = 0;
    var PLAYING = 1;
    var OVER = 2;
    var LEVEL_COMPLETE = 3;
    var INSTRUCTION_DISPLAY = 4;
    var SCORE_MESS = 'Score: ';
    var START_LIVES = 5;
    var START_BORING = 6;
    var LIVE_MESS = 'Lives: ';
    var gameState = LOADING;
    var scores = 0;
    var boring = 0;
    var scaleCalibration = 1.2;
    var weaponMissilesType = missileObject.BOOK;
    var numberKillsToWinLevel = 10;
    var infoBackground = true;

    //new variables for game difficulty raise
    var levelOfDifficulty = [];

    for (var j = 0; j < 5; j++) {
        levelOfDifficulty.push(j+1);
    }
    var levelChangeTimer = 0;
    var levelCounter = 1;

    var numberOfCurrentLevel = 0;
    var numberOfLevels = 5;

    //Directions
    var moveRight = false;
    var moveLeft = false;
    var shoot = false;
    var spaceKeyIsDown = false;
    var touchX = canvas.width / 2;
    var touchY = 0;
    var isTouched = false;
    var startTouch = false;
    var changeWeapon = false;
    var displayInstruction = false;

    var backgroundImage = new Image();
    backgroundImage.addEventListener('load', loadHandler, false);
    backgroundImage.src = './images/tiles.jpg';
    assetsToLoad.push(backgroundImage);

    var heroImage = new Image();
    heroImage.addEventListener('load', loadHandler, false);
    heroImage.src = './images/sprites_player.png';
    assetsToLoad.push(heroImage);

    var heroImageHurted = new Image();
    heroImageHurted.addEventListener('load', loadHandler, false);
    heroImageHurted.src = './images/sprites_player_hurted.png';
    assetsToLoad.push(heroImageHurted);

    var enemyImg = new Image();
    enemyImg.addEventListener('load', loadHandler, false);
    enemyImg.src = './images/sprites_yanush.png';
    assetsToLoad.push(enemyImg);

    var infoCloudsImage = new Image();
    infoCloudsImage.addEventListener('load', loadHandler, false);
    infoCloudsImage.src = './images/sprites_clouds.png';
    assetsToLoad.push(infoCloudsImage);

    var missileImage = new Image();
    missileImage.addEventListener('load', loadHandler, false);
    missileImage.src = './images/sprites_missiles.png';
    assetsToLoad.push(missileImage);

    //fonts

    var fontHVD_Peace  = new Font();
    fontHVD_Peace.src = 'HVD_Peace font';

    var fontSickness  = new Font();
    fontSickness.src = 'Sickness';

    var fontFriday  = new Font();
    fontFriday.src = 'Friday';

    var fontHowlinmad  = new Font();
    fontHowlinmad.src = 'Howllinmad';

    var background = Object.create(spriteObject);
    background.image = backgroundImage;
    background.x = 0;
    background.y = 0;
    background.sourceY = 0;
    background.sourceWidth = 960;
    background.sourceHeight = 3200;
    background.width = 960;
    background.height = 3200;
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

    var missileSymbol = Object.create(missileObject);
    missileSymbol.image = missileImage;
    missileSymbol.state = weaponMissilesType;
    missileSymbol.update();
    missileSymbol.x = Math.floor(canvas.width * 0.015);
    missileSymbol.y = Math.floor(canvas.height * 0.03);
    sprites.push(missileSymbol);

    var scoreDisplay = Object.create(messageObject);
    scoreDisplay.font = 'normal bold 37px Howlinmad';
    scoreDisplay.fillStyle = '#2ecc71';
    scoreDisplay.x = Math.floor(canvas.width * 0.07);
    scoreDisplay.y = Math.floor(canvas.height * 0.02);
    scoreDisplay.text = returnScoreText();
    scoreDisplay.visible = true;
    messages.push(scoreDisplay);

    var livesDisplay = Object.create(messageObject);
    livesDisplay.font = 'normal bold 37px Howlinmad';
    livesDisplay.fillStyle = '#d30019';
    livesDisplay.x = Math.floor(canvas.width * 0.28);
    livesDisplay.y = Math.floor(canvas.height * 0.02);
    livesDisplay.text = returnLivesText();
    livesDisplay.visible = true;
    messages.push(livesDisplay);

    var boringMetterMessage = Object.create(messageObject);
    boringMetterMessage.font = 'normal bold 37px Howlinmad';
    boringMetterMessage.fillStyle = '#14b2ff';
    boringMetterMessage.x = Math.floor(canvas.width * 0.47);
    boringMetterMessage.y = Math.floor(canvas.height * 0.02);
    boringMetterMessage.text = returnBoringText();
    boringMetterMessage.visible = true;
    messages.push(boringMetterMessage);

    var levelDisplay = Object.create(messageObject);
    levelDisplay.visible = true;
    levelDisplay.font = 'normal bold 37px Howlinmad';
    levelDisplay.fillStyle = '#ffffff';
    levelDisplay.text = returnLevelText();
    levelDisplay.x = Math.floor(canvas.width * 0.89);
    levelDisplay.y = Math.floor(canvas.height * 0.02);
    messages.push(levelDisplay);

    var endGameMessage = Object.create(messageObject);
    endGameMessage.font = 'normal bold 140px Friday';
    endGameMessage.fillStyle = '#c60019';
    endGameMessage.x = Math.floor(canvas.width / 2);
    endGameMessage.y = Math.floor(canvas.height / 2);
    endGameMessage.textAlign = 'center';
    endGameMessage.textBaseline = 'middle';
    endGameMessage.text = 'You lose';
    endGameMessage.visible = false;
    messages.push(endGameMessage);

    var endGameRestartMessage = Object.create(messageObject);
    endGameRestartMessage.font = 'normal bold 40px Friday';
    endGameRestartMessage.fillStyle = '#3457e1';
    endGameRestartMessage.x = Math.floor(canvas.width / 2);
    endGameRestartMessage.y = Math.floor(canvas.height / 2 + 150);
    endGameRestartMessage.textAlign = 'center';
    endGameRestartMessage.textBaseline = 'middle';
    endGameRestartMessage.text = 'Press space to restart';
    endGameRestartMessage.visible = false;
    messages.push(endGameRestartMessage);

    var levelCompleteDisplay = Object.create(messageObject);
    levelCompleteDisplay.font = 'normal bold 50px Friday';
    levelCompleteDisplay.fillStyle = '#c60019';
    levelCompleteDisplay.text = 'Congratulations! Level completed.';
    levelCompleteDisplay.textAlign = 'center';
    levelCompleteDisplay.textBaseline = 'middle';
    levelCompleteDisplay.x = Math.floor(canvas.width / 2);
    levelCompleteDisplay.y = Math.floor(canvas.height /2);
    levelCompleteDisplay.visible = false;
    messages.push(levelCompleteDisplay);

    var instructionMessage = Object.create(messageObject);
    instructionMessage.font = 'normal bold 30px Howlinmad';
    instructionMessage.fillStyle = '#e9262e';
    instructionMessage.text = returnInstructionText();
    instructionMessage.textAlign = 'center';
    instructionMessage.textBaseline = 'middle';
    instructionMessage.x = Math.floor(canvas.width / 2);
    instructionMessage.y = Math.floor(canvas.height / 2 - 50);
    instructionMessage.visible = false;
    messages.push(instructionMessage);

    var getCanvas = document.querySelector('.canvas');

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
                break;
            case 'b':
                changeWeapon = true;
                event.preventDefault();
                break;
            case 'i':
                displayInstruction = true;
                event.preventDefault();
                break;
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
            case LEVEL_COMPLETE:
                levelComplete();
                break;
            case INSTRUCTION_DISPLAY:
                instructionDisplay();
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
            gameState = INSTRUCTION_DISPLAY;
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

    function touchEndFireHandler(event) {
        touchX = event.targetTouches.pageX - canvas.offsetLeft;
        touchY = event.targetTouches.pageY - canvas.offsetTop;
        var displayedCanvas = $('.canvas');
        var widthOnView = displayedCanvas.width();
        var heightOnView = displayedCanvas.height();
        touchX = touchX * (canvas.width / widthOnView );
        touchY = touchY * (canvas.height / heightOnView);
        if (touchTestRectangle(touchX, touchY, missileSymbol, missileSymbol.width)) {
            changeWeapon = true;
        } else if (startTouch) {
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

        if (changeWeapon) {
            weaponMissilesType++;
            if (weaponMissilesType > 3) {
                weaponMissilesType = 0;
            }
            missileSymbol.state = weaponMissilesType;
            missileSymbol.update();
            missileSymbol.updateSourceImg();
            changeWeapon = false;
        }

        if (displayInstruction) {
            gameState = INSTRUCTION_DISPLAY;
        }

        if (isTouched) {
            hero.x = touchX - (hero.halfWidth());
            isTouched = false;
        } else {
            hero.x = Math.max(0, Math.min(hero.x + hero.vx, canvas.width - hero.width));
        }

        for (var i = 0; i < missiles.length; i++) {
            var missile = missiles[i];
            var scale = missile.y / canvas.height * scaleCalibration;
            missile.y += missile.vy * scale;
            missile.width = missile.sourceWidth * scale;
            missile.height = missile.sourceHeight * scale;
            missile.x = -1 * (missile.vectorB() - missile.y) / missile.vectorA();
            missile.updateAnimation();

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
                var scale = (enemy.y / canvas.height) * scaleCalibration;
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
                i--;
            }

            if (enemy.state === enemy.ESCAPE) {
                enemy.x += enemy.vx;
                var borderX = -1 * (enemy.vectorB() - enemy.y) / enemy.vectorA();
                if (enemy.x < (borderX - enemy.width) && enemy.x < (canvas.width / 2)) {
                    enemy.sourceX++;
                    enemy.width--;
                } else if (enemy.x > borderX && enemy.x > (canvas.width / 2)) {
                    enemy.width--;
                }
                enemy.updateAnimation();
                if (enemy.width < 1 || enemy.x < (0 - enemy.width) || enemy.x > (canvas.width + enemy.width)) {
                    removeObject(enemy, enemies);
                    removeObject(enemy, sprites);
                    i--;
                }
            }
        }
        checkIfHit();
        checkMonsterTouchHero();
        moveInfoClouds();
    }

    function endGame() {
        endGameMessage.visible = true;
        endGameRestartMessage.visible = true;
        if (shoot) {
           restartGame()
        }
    }

    function instructionDisplay() {
        instructionMessage.visible = true;
        displayInstruction = false;
        if (shoot) {
            instructionMessage.visible = false;
            gameState = PLAYING;
        }
    }

    function shakeScreenStart() {
        getCanvas.classList.add('shake-effect');
    }

    function shakeScreenStop() {
        getCanvas.classList.remove('shake-effect');
    }

    function hitEffect2Start() {
        getCanvas.classList.add('hit-effect2');
    }

    function hitEffect2Stop() {
        getCanvas.classList.remove('hit-effect2');
    }

    function hitEffect3Start() {
        getCanvas.classList.add('hit-effect3');
    }

    function hitEffect3Stop() {
        getCanvas.classList.remove('hit-effect3');
    }

    function hitEffect4Start() {
        getCanvas.classList.add('hit-effect4');
    }

    function hitEffect4Stop() {
        getCanvas.classList.remove('hit-effect4');
    }

    function hitEffect5Start() {
        getCanvas.classList.add('hit-effect5');
    }

    function hitEffect5Stop() {
        getCanvas.classList.remove('hit-effect5');
    }

    function checkIfHit() {
        for (var i = 0; i < enemies.length; i++) {
            var enemy = enemies[i];
            for (var j = 0; j < missiles.length; j++) {
                var missile = missiles[j];
                if (enemy.state === enemy.NORMAL && hitTestRectangle(missile, enemy)) {
                    //destroyEnemy(enemy);
                    escapeEnemy(missile.state, enemy);
                    scores++;
                    removeObject(missile, missiles);
                    removeObject(missile, sprites);
                    j--;
                    scoreDisplay.text = SCORE_MESS + scores;
                    if (scores >= numberKillsToWinLevel) {
                        gameState = LEVEL_COMPLETE;
                    }
                }
            }
        }

    }

    function levelComplete() {

        levelCompleteDisplay.visible = true;
        levelChangeTimer++;
        if (levelChangeTimer === 120) {
            loadNextLevel();
        }

        function loadNextLevel() {
            numberOfCurrentLevel++;
            if (numberOfCurrentLevel < numberOfLevels) {
                background.y -= 640;
            };
            levelCompleteDisplay.visible = false;
            levelChangeTimer = 0;
            levelCounter++;
            levelDisplay.text = returnLevelText();
            sprites = [];
            assetsToLoad = [];
            missiles = [];
            enemies = [];
            messages = [];
            enemyTimer = 0;
            scores = 0;
            infoClouds = [];
            scoreDisplay.text = returnScoreText();
            sprites.push(background);
            sprites.push(hero);
            sprites.push(missileSymbol);
            loadAllMessages();
            if (levelCounter <= levelOfDifficulty.length -1 ) {
                numberKillsToWinLevel = levelCounter * 10;
                velocity = levelOfDifficulty[levelCounter];
                enemyFrequency = 120 / levelOfDifficulty[levelCounter];
            } else {
                //gameState = OVER;
            }
            gameState = PLAYING;
        }
    }

    function moveInfoClouds() {
        for (var i = 0; i < infoClouds.length; i++) {
            var infoCloud = infoClouds[i];
            infoCloud.x = infoCloud.attachetTo.x;
            infoCloud.y -= infoCloud.vy;
            infoCloud.width = infoCloud.attachetTo.width;
            infoCloud.updateAnimation();
            if (infoCloud.width < 1 || infoCloud.x < (0 - infoCloud.width) || infoCloud.x > (canvas.width + infoCloud.width)) {
                removeObject(infoCloud, infoClouds);
                i--;
            }
        }
    }

    function checkMonsterTouchHero() {
        for (var i = 0; i < enemies.length; i++) {
            var enemy = enemies[i];
            if (hitTestRectangle(enemy, hero)) {
                destroyEnemy(enemy);
                hero.lives--;
                if (hero.lives < 3) {
                    hero.image = heroImageHurted;
                };
                removeObject(enemy, enemies);
                removeObject(enemy, sprites);
                livesDisplay.text = LIVE_MESS + hero.lives;
                if (hero.lives === 0) {
                    gameState = OVER;
                }
                if (hero.lives < 5 || numberOfCurrentLevel == 0) {
                    shakeScreenStart();
                    setTimeout(function () {
                        shakeScreenStop()
                    }, 500);
                };
                if (hero.lives < 4 || numberOfCurrentLevel == 1) {
                    hitEffect2Start();
                    setTimeout(function () {
                        hitEffect2Stop()
                    }, 500);
                };
                if (hero.lives < 3 || numberOfCurrentLevel == 2) {
                    hitEffect3Start();
                    setTimeout(function () {
                        hitEffect3Stop()
                    }, 750);
                };
                if (hero.lives < 2 || numberOfCurrentLevel == 3) {
                    hitEffect4Start();
                    setTimeout(function () {
                        hitEffect4Stop()
                    }, 500);
                };
                if (hero.lives < 2 || numberOfCurrentLevel == 4) {
                    hitEffect5Start();
                    setTimeout(function () {
                        hitEffect5Stop()
                    }, 500);
                };
            }
        }
    }

    function render() {
        function drawSprite(sprite) {
            drawingSurface.drawImage(
                sprite.image,
                sprite.sourceX, sprite.sourceY,
                sprite.sourceWidth, sprite.sourceHeight,
                Math.floor(sprite.x), Math.floor(sprite.y),
                sprite.width, sprite.height
            );
        }

        drawingSurface.clearRect(0, 0, canvas.width, canvas.height);
        if (sprites.length !== 0) {
            var sprite;
            sprite = sprites[0];
            drawSprite(sprite);
            for (var i = sprites.length - 1; i > 0; i--) {
                sprite = sprites[i];
                drawSprite(sprite);
            }
        }

        if (infoClouds.length !== 0) {
            for (var i = 0; i < infoClouds.length; i++) {
                var infoCloud = infoClouds[i];
                drawSprite(infoCloud);
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
                    //drawingSurface.fillText(message.text, message.x, message.y);
                    wrapText(drawingSurface, message.text, message.x, message.y, canvas.width, 40  );
                }
            }
        }
    }

    function wrapText(context, text, x, y, maxWidth, lineHeight) {
        var cars = text.split("\n");
        for (var ii = 0; ii < cars.length; ii++) {
            var line = "";
            var words = cars[ii].split(" ");
            for (var n = 0; n < words.length; n++) {
                var testLine = line + words[n] + " ";
                var metrics = context.measureText(testLine);
                var testWidth = metrics.width;

                if (testWidth > maxWidth) {
                    context.fillText(line, x, y);
                    line = words[n] + " ";
                    y += lineHeight;
                }
                else {
                    line = testLine;
                }
            }
            context.fillText(line, x, y);
            y += lineHeight;
        }
    }

    function fireMissile() {
        if (missiles.length >= 5) {
             return;
        }
        var missile = Object.create(missileObject);
        missile.image = missileImage;
        missile.state = weaponMissilesType;
        missile.x = hero.centerX() + missile.width;
        missile.y = canvas.height - (hero.height - 2 * missile.height);
        missile.startPointX = canvas.width / 2;
        missile.vy = -8;
        missile.endPointX = missile.x;
        missile.endPointY = missile.y;
        missile.update();
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
        enemy.vy = velocity;
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

    function makeCloudInfOnEnemy(state, attachetTo) {
        var infoCloud = Object.create(infoCloudObject);
        infoCloud.state = state;
        infoCloud.update();
        infoCloud.attachetTo = attachetTo;
        // infoCloud.numberOffFrames = 4;
        infoCloud.numberOffFrames = 1;
        // infoCloud.numberOffColumns = 6;
        infoCloud.numberOffColumns = 1;
        infoCloud.image = infoCloudsImage;
        infoCloud.sourceWidth = 90;
        infoCloud.sourceHeight = 81;
        infoCloud.height = attachetTo.width;
        infoCloud.width = attachetTo.width;
        infoCloud.x = attachetTo.x;
        infoCloud.y = attachetTo.y - infoCloud.height;
        infoClouds.push(infoCloud);
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

    function returnLevelText() {
        return 'Lvl: ' + levelCounter;
    }

    function returnInstructionText() {
        return 'Your main objective is to kill the boredom of Yanush.\n Don\'t let him infect you!\n\n' +
            'Move: arrow RIGHT & LEFT\n' +
            'Shoot: SPACE\n\n' +
            'Shoot to START';
    }


    function escapeEnemy(state, enemy) {
        enemy.state = enemy.ESCAPE;
        if (enemy.x >= background.halfWidth()) {
            enemy.vx = 2;
            enemy.endPointX = canvas.width * 1.5;
        } else {
            enemy.vx = -2;
            enemy.endPointX = canvas.width * -0.5;
        }
        enemy.update();
        makeCloudInfOnEnemy(state, enemy);
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

    function restartGame () {
        numberOfCurrentLevel = 0;
        instructionMessage.visible = false;

        endGameMessage.visible = false;
        endGameRestartMessage.visible = false;
        numberKillsToWinLevel = 10;
        numberOfCurrentLevel = 0;
        background.y = 0;
        levelCompleteDisplay.visible = false;
        levelChangeTimer = 0;
        levelCounter = 1;
        levelDisplay.text = returnLevelText();
        enemyFrequency = 120;
        velocity = 1;
        sprites = [];
        assetsToLoad = [];
        missiles = [];
        enemies = [];
        messages = [];
        enemyTimer = 0;
        scores = 0;
        infoClouds = [];
        boring = 0;
        hero.lives = START_LIVES;
        sprites.push(background);
        sprites.push(hero);
        sprites.push(missileSymbol);
        loadAllMessages();
        hero.image = heroImage;
        gameState = PLAYING;

    }
    function loadAllMessages() {
        livesDisplay.text = returnLivesText();
        scoreDisplay.text = returnScoreText();
        boringMetterMessage.text = returnBoringText();
        messages.push(scoreDisplay);
        messages.push(livesDisplay);
        messages.push(boringMetterMessage);
        messages.push(endGameMessage);
        messages.push(endGameRestartMessage);
        messages.push(instructionMessage);
        messages.push(levelCompleteDisplay);
        messages.push(levelDisplay);
    }

//Start here
    update();
}(spriteObject, enemyObject, messageObject, missileObject));
