var spriteObject =
    {
        image: "",
        sourceX: 0,
        sourceY: 0,
        sourceWidth: 80,
        sourceHeight: 110,
        width: 80,
        height: 110,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        startPointX: 0,
        startPointY: 100,
        endPointX: 0,
        endPointY: 0,
        visible: true,
        numberOffColumns: 9,
        numberOffFrames: 1,
        currentFrame: 0,
        firstAnimationFrame: 0,
        lastAnimationFrame: 0,
        internalTimer: 10,
        timerCounter: 0,

        //Getters
        centerX: function () {
            return this.x + (this.width / 2);
        },
        centerY: function () {
            return this.y + (this.height / 2);
        },
        halfWidth: function () {
            return this.width / 2;
        },
        halfHeight: function () {
            return this.height / 2;
        },
        vectorA: function () {
            var differOnX = this.startPointX - this.endPointX;
            if (differOnX === 0) {
                differOnX = 0.1;
            }
            return (this.endPointY - this.startPointY) / differOnX * -1;
        },
        vectorB: function () {
            return this.endPointY - (this.vectorA() * this.endPointX);
        },
        updateSourceImg: function() {
            this.sourceX = Math.floor(this.currentFrame % this.numberOffColumns) * this.sourceWidth;
            this.sourceY = Math.floor(this.currentFrame / this.numberOffColumns) * this.sourceHeight;
        },
        updateAnimation: function () {
            this.timerCounter++;

            if (this.timerCounter >= this.internalTimer) {
                this.timerCounter = 0;
                this.currentFrame++;
                if (this.currentFrame > this.lastAnimationFrame) {
                    this.currentFrame = this.firstAnimationFrame;
                }
               this.updateSourceImg()
            }
        }
    };

var enemyObject = Object.create(spriteObject);
enemyObject.NORMAL = 1;
enemyObject.DEAD = 2;
enemyObject.ESCAPE = 3;
enemyObject.state = enemyObject.NORMAL;
enemyObject.update = function () {
    if (this.state === this.DEAD) {
        this.currentFrame = 6;
        this.updateSourceImg();
    } else if (this.state === this.ESCAPE) {
      this.firstAnimationFrame = 3;
      this.lastAnimationFrame = 5;
    }
};

var messageObject =
  {
    x: 0,
    y: 0,
    visible: false,
    text: 'Message',
    font: 'normal bold 30px Helvetica',
    fillStyle: 'black',
    textBaseline: 'top',
    textAlign: 'left'
  };

var infoCloudObject = Object.create(spriteObject);
infoCloudObject.NOT_SET = -1;
infoCloudObject.ENEMY_READ = 0;
infoCloudObject.ENEMY_LISTENING = 1;
infoCloudObject.ENEMY_PLAY = 2;
infoCloudObject.ENEMY_WATCH_FILM = 3;
infoCloudObject.HERO_LOSE_LIFE = 4;
infoCloudObject.HERO_GET_MORE_BORING = 5;
infoCloudObject.HERO_GET_LESS_BORING = 6;
infoCloudObject.state = infoCloudObject.NOT_SET;
infoCloudObject.update = function () {

    switch (this.state) {
        case this.NOT_SET:
            this.currentFrame= 12;
            this.firstAnimationFrame = 12;
            this.lastAnimationFrame =12;
            break;
        case this.ENEMY_READ:
            this.currentFrame = 0;
            this.firstAnimationFrame = 0;
            // this.lastAnimationFrame = 3;
            this.lastAnimationFrame = 0;
            break;
        case this.ENEMY_LISTENING:
            // this.currentFrame = 4;
            // this.firstAnimationFrame = 4;
            // this.lastAnimationFrame = 7;
            this.currentFrame = 1;
            this.firstAnimationFrame = 1;
            this.lastAnimationFrame = 1;
            break;
        case this.ENEMY_PLAY:
            // this.currentFrame = 8;
            // this.firstAnimationFrame = 8;
            // this.lastAnimationFrame = 11;
            this.currentFrame = 2;
            this.firstAnimationFrame = 2;
            this.lastAnimationFrame = 2;
            break;
        case this.ENEMY_WATCH_FILM:
          // this.currentFrame = 12;
          // this.firstAnimationFrame = 12;
          // this.lastAnimationFrame = 14;
          this.currentFrame = 3;
          this.firstAnimationFrame = 3;
          this.lastAnimationFrame = 3;
          break;
        case this.HERO_LOSE_LIFE:
            this.firstAnimationFrame = 15;
            this.lastAnimationFrame = 18;
            this.vy = -2;
            break;
        case this.HERO_GET_MORE_BORING:
            this.firstAnimationFrame = 19;
            this.lastAnimationFrame = 22;
            this.vy = -2;
            break;
        case this.HERO_GET_LESS_BORING:
            this.firstAnimationFrame = 18;
            this.lastAnimationFrame = 20;
            this.vy = -2;
            break;
    }
    this.updateSourceImg();
};

var missileObject = Object.create(spriteObject);

missileObject.BOOK = 0;
missileObject.CD = 1;
missileObject.GAMEPAD = 2;
missileObject.TICKETS = 3;
//missileObject.sourceX = 194;
missileObject.sourceWidth = 32;
missileObject.sourceHeight = 32;
missileObject.width = 32;
missileObject.height = 32;


missileObject.update = function () {
  switch (this.state) {
    case this.BOOK:
      this.currentFrame = 0;
      this.firstAnimationFrame = 0;
      this.lastAnimationFrame = 3;
      break;
    case this.CD:
      this.currentFrame = 4;
      this.firstAnimationFrame = 4;
      this.lastAnimationFrame = 7;
      break;
    case this.GAMEPAD:
      this.currentFrame = 8;
      this.firstAnimationFrame = 8;
      this.lastAnimationFrame = 11;
      break;
    case this.TICKETS:
      this.currentFrame = 12;
      this.firstAnimationFrame = 12;
      this.lastAnimationFrame = 15;
      break;
  }
  this.updateSourceImg();
};


