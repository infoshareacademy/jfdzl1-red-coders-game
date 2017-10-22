var spriteObject = {
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

  COLUMNS: 9,
  numberOfFrames: 1,
  currentFrame: 0,
  firstAnimationFrame: 0,
  lastAnimationFrame: 0,

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
    return (this.endPointY - this.startPointY) / (this.startPointX - this.endPointX) * -1;
  },
  vectorB: function () {
    return this.endPointY - (this.vectorA() * this.endPointX);
  },
  updateAnimation: function () {
    this.sourceX = Math.floor(this.currentFrame % this.COLUMNS) * this.sourceWidth;
    this.sourceY = Math.floor(this.currentFrame / this.COLUMNS) * this.sourceHeight;
  },
  startAnimation: function () {
    this.currentFrame++;
    if (this.currentFrame > this.lastAnimationFrame) {
      this.currentFrame = this.firstAnimationFrame;
    }
    this.updateAnimation;
    setTimeout(this.startAnimation, 100);

  }
};


var enemyObject = Object.create(spriteObject);
enemyObject.NORMAL = 1;
enemyObject.DEAD = 2;
enemyObject.state = enemyObject.NORMAL;
enemyObject.update = function () {
  this.sourceX = this.state * this.sourceWidth;
};


