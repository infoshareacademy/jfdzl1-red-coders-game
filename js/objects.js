var spriteObject =
    {
        image: '',
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
          var diferrOnX = this.startPointX - this.endPointX;
          if (diferrOnX === 0 ) {
            diferrOnX = 0.1;
          }
            return (this.endPointY - this.startPointY) / (diferrOnX) * -1;
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
infoCloudObject.NOT_SET = 0;
infoCloudObject.ENEMY_READ = 1;
infoCloudObject.ENEMY_LISTENING = 2;
infoCloudObject.ENEMY_PLAY = 3;
infoCloudObject.HERO_LOSE_LIFE = 4;
infoCloudObject.HERO_GET_MORE_BORING = 5;
infoCloudObject.HERO_GET_LESS_BORING = 6;
infoCloudObject.state = infoCloudObject.NOT_SET;
infoCloudObject.update = function () {

    switch (this.state) {
        case this.NOT_SET:
            this.firstAnimationFrame = 0;
            this.lastAnimationFrame = 2;
            break;
        case this.ENEMY_READ:
            this.firstAnimationFrame = 3;
            this.lastAnimationFrame = 5;
            break;
        case this.ENEMY_LISTENING:
            this.firstAnimationFrame = 6;
            this.lastAnimationFrame = 8;
            break;
        case this.ENEMY_PLAY:
            this.firstAnimationFrame = 9;
            this.lastAnimationFrame = 11;
            break;
        case this.HERO_LOSE_LIFE:
            this.firstAnimationFrame = 12;
            this.lastAnimationFrame = 14;
            this.vy = -2;
            break;
        case this.HERO_GET_MORE_BORING:
            this.firstAnimationFrame = 15;
            this.lastAnimationFrame = 17;
            this.vy = -2;
            break;
        case this.HERO_GET_LESS_BORING:
            this.firstAnimationFrame = 18;
            this.lastAnimationFrame = 20;
            this.vy = -2;
            break;
    }
};



