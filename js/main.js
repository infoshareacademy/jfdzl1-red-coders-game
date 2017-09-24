(function(){

    var canvas = document.querySelector("canvas");
    var drawingSurface = canvas.getContext("2d");

    var sprites = [];
    var assetsToLoad = [];



    var background = Object.create(spriteObject);
    background.x = 0;
    background.y = 0;
    background.sourceX = 64;
    background.sourceWidth = 960;
    background.sourceHeight = 640;
    background.width = 960;
    background.height = 640;
    sprites.push(background);

    var johny = Object.create(spriteObject);
    johny.x = canvas.width / 2 - johny.width / 2;
    johny.y = canvas.height - johny.height/ 2;
    sprites.push(johny);


    var image = new Image();
    image.addEventListener("load", loadHandler, false);
    image.src = "../images/tiles.png";
    assetsToLoad.push(image);

    var assetsLoaded = 0;

    var LOADING = 0;
    var PLAYING = 1;
    var OVER = 2;
    var gameState = LOADING;

    //Key codes and directions

    var RIGHT = 39;
    var LEFT = 37;

    var moveRight = false;
    var moveLeft = false;


    window.addEventListener("keydown", function(event) {
        switch (event.keyCode) {
            case  LEFT:
                moveLeft = true;
                break;
            case RIGHT:
                moveRight = true;
                break;
        }
    }, false);


    window.addEventListener("keyup", function(event){
        switch(event.keyCode){
            case LEFT:
                moveLeft = false;
                break;
            case RIGHT:
                moveRight = false;
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
        assetsToLoad++;
        if(assetsLoaded === assetsToLoad.length) {
            image.removeEventListener("load", loadHandler, false);
            gameState = PLAYING;

        }

    }

    function playGame() {
        if (moveLeft && !moveRight) {
            johny.vx = -8;
        }
        if (moveRight && !moveLeft) {
            johny.vy = 8;
        }
        if (!moveRight && !moveLeft) {
            johny.vx = 0;
        }

        johny.x = Math.max(0, Math.min(johny.x))

    }


}());
