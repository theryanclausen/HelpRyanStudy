webpackJsonp([0],{

/***/ 1148:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TitleScreen = exports.TitleScreen = function (_Phaser$Scene) {
  _inherits(TitleScreen, _Phaser$Scene);

  function TitleScreen() {
    _classCallCheck(this, TitleScreen);

    var _this = _possibleConstructorReturn(this, (TitleScreen.__proto__ || Object.getPrototypeOf(TitleScreen)).call(this, { key: "TitleScreen" }));

    _this.player;
    _this.lambdas;
    _this.Cats;
    _this.platforms;
    _this.cursors;
    _this.score = 0;
    _this.gameOver = false;
    _this.titleText;
    _this.instructionsText;
    _this.instructionsText2;
    _this.playerPlatformCollider;
    _this.playerHit = false;
    _this.delayCounter = 0;
    _this.killerCat;
    _this.toGameText;

    _this.killerCatTween = function () {
      return _this.tweens.add({
        targets: _this.killerCat,
        x: 400,
        y: 335,
        duration: 1750,
        scaleX: 2,
        scaleY: 2
      });
    };
    _this.deathTween = function () {
      return _this.tweens.add({
        targets: _this.player,
        x: _this.player.x,
        y: 650,
        duration: 1500,
        rotation: 10
      });
    };

    _this.collectLambda = function (player, lambda) {
      lambda.disableBody(true, true);
    };

    _this.hitCat = function (player, Cat) {
      _this.killerCat = Cat;
      player.setTint(0xff0000);
      player.anims.play("turn");
      _this.gameOver = true;
      _this.physics.world.removeCollider(_this.playerPlatformCollider);
      _this.player.setCollideWorldBounds(false);
      _this.player.setVelocityX(0);
      _this.player.allowGravity = false;
      _this.deathTween();
      _this.killerCatTween();
    };
    return _this;
  }

  _createClass(TitleScreen, [{
    key: "preload",
    value: function preload() {
      this.load.spritesheet("dude", "assets/ryan.png", {
        frameWidth: 21,
        frameHeight: 45
      });
      this.load.image("sky", "assets/sky.png");
      this.load.image("ground", "assets/platform.png");
      this.load.image("Cat", "assets/Cat.png");
      this.load.image("lambda", "assets/LambdaCoin.png");
    }
  }, {
    key: "create",
    value: function create() {
      // background
      this.add.image(400, 300, "sky");

      //platforms
      this.platforms = this.physics.add.staticGroup();
      this.platforms.create(400, 568, "ground").setScale(2).refreshBody();

      //player add and physics
      this.player = this.physics.add.sprite(100, 450, "dude");
      this.player.setBounce(0.1);
      this.player.setCollideWorldBounds(true);

      //player animations can be reused for any sprite with requisite sheet
      this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
      });
      this.anims.create({
        key: "turn",
        frames: [{ key: "dude", frame: 4 }],
        frameRate: 20
      });
      this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
      });

      //keyboard events mounted
      this.cursors = this.input.keyboard.createCursorKeys();

      //render a series of lambda
      this.lambdas = this.physics.add.group({
        key: "lambda",
        repeat: 5,
        setXY: { x: 412, y: 400, stepX: 50, stepY: 5 }
      });

      //each lambda has different bounce
      this.lambdas.children.iterate(function (child) {
        return child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
      });

      //Cats created as a concept but none rendered
      this.Cats = this.physics.add.group();

      //score display
      this.titleText = this.add.text(120, 40, "Help Ryan Study", {
        fontSize: "62px",
        fill: "#000"
      });
      this.instructionsText = this.add.text(80, 120, "Use the arrow keys to collect the Lambda Tokens.", {
        fontSize: "22px",
        fill: "#000"
      });
      this.instructionsText2 = this.add.text(180, 160, "Avoid distractions from the Cat.", {
        fontSize: "22px",
        fill: "#000"
      });

      this.toGameText = this.add.text(206, 454, 'Press Space to Start', {
        fontSize: "32px",
        fill: "#000"
      });

      //platform collider
      this.playerPlatformCollider = this.physics.add.collider(this.player, this.platforms);
      this.physics.add.collider(this.lambdas, this.platforms);
      this.physics.add.collider(this.Cats, this.platforms);

      //sprite interaction
      this.physics.add.overlap(this.player, this.lambdas, this.collectLambda, null, this);

      this.physics.add.collider(this.player, this.Cats, this.hitCat, null, this);
    }
  }, {
    key: "update",
    value: function update() {
      if (this.cursors.space._justUp) {
        this.scene.start('GameScene');
        this.delayCounter = 0;
      }

      if (this.delayCounter < 550) {
        this.delayCounter++;
        if (this.delayCounter < 100) {
          this.player.anims.play("turn");
        }

        if (this.delayCounter > 100 && this.delayCounter < 349) {
          this.player.setVelocityX(170);
          this.player.anims.play("right", true);
        }

        if (this.delayCounter === 350) {
          //new lambdas
          var Cat = this.Cats.create(800, 416, "Cat").setScale(0.2);
          Cat.setBounce(1);
          Cat.setCollideWorldBounds(true);
          Cat.setVelocity(-214, 20);
        }

        if (this.delayCounter > 355) {
          this.player.setVelocityX(-170);
          this.player.anims.play("left", true);
        }
        if (this.delayCounter > 300 && this.delayCounter < 354) {
          this.player.setVelocityX(0);
          this.player.anims.play("turn");
        }
        if (this.cursors.up.isDown && this.player.body.touching.down) {
          this.player.setVelocityY(-280);
        }
      } else {
        this.physics.pause();
      }
    }
  }]);

  return TitleScreen;
}(Phaser.Scene);

/***/ }),

/***/ 1149:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GameScene = exports.GameScene = function (_Phaser$Scene) {
  _inherits(GameScene, _Phaser$Scene);

  function GameScene() {
    _classCallCheck(this, GameScene);

    var _this = _possibleConstructorReturn(this, (GameScene.__proto__ || Object.getPrototypeOf(GameScene)).call(this, { key: "GameScene" }));

    _this.player;
    _this.lambdas;
    _this.Cats;
    _this.platforms;
    _this.cursors;
    _this.score = 0;
    _this.gameOver = false;
    _this.isDead = false;
    _this.scoreText;
    _this.playerPlatformCollider;
    _this.playerCoinOverlap;
    _this.lives = 1;
    _this.livesText;
    _this.playerCatCollider;
    _this.delayCounter = 0;
    _this.killerCat;
    _this.gameOverText;
    _this.toMenuText;
    _this.bonus;
    _this.bonusCounter = 0;
    _this.bonusStatus = false;
    _this.bonusArray = ["react", "redux", "node", "github"];
    _this.lambdasCollected = 0;
    _this.playerBonusOverlap;

    _this.deathTween = function () {
      return _this.tweens.add({
        targets: _this.player,
        x: _this.player.x,
        y: 650,
        duration: 1500,
        rotation: 10
      });
    };

    _this.killerCatTween = function () {
      return _this.tweens.add({
        targets: _this.killerCat,
        x: 400,
        y: 324,
        duration: 1850,
        scaleX: 2,
        scaleY: 2
      });
    };

    _this.newRound = function () {
      _this.lambdas.children.iterate(function (child) {
        return child.enableBody(true, child.x, Phaser.Math.Between(-50, 390), true, true);
      });
      var x = _this.player.x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
      var Cat = _this.Cats.create(x, 16, "Cat").setScale(0.2);
      Cat.setBounce(1);
      Cat.setCollideWorldBounds(true);
      Cat.setVelocity(Phaser.Math.Between(-190, 190), 15);
    };

    _this.bonusDrop = function () {
      _this.lambdasCollected = 0;
      var coin = _this.bonus.create(Phaser.Math.Between(0, 800), -1, Phaser.Math.RND.pick(_this.bonusArray)).setScale(0.5);
      coin.body.setAllowGravity(false);
      coin.setVelocityY(150);
    };

    _this.collectCoin = function (player, coin) {
      coin.disableBody(true, true);
      if (_this.lambdas.children.entries.includes(coin)) {
        _this.score += 10;
        _this.lambdasCollected++;
      }
      if (_this.bonus.children.entries.includes(coin)) {
        _this.score += 100;
        _this.bonusStatus = false;
      }
      _this.scoreText.setText("Score: " + _this.score);
    };

    _this.hitCat = function (player, Cat) {
      player.setTint(0xff0000);
      player.anims.play("turn");
      _this.physics.world.removeCollider(_this.playerCatCollider);
      _this.killerCat = Cat;
      _this.killerCat.setVelocity(0, -100);
      _this.physics.world.removeCollider(_this.killerCat, _this.Cats);
      _this.physics.world.removeCollider(_this.killerCat, _this.platforms);
      _this.player.allowGravity = false;
      _this.physics.world.removeCollider(_this.playerPlatformCollider);
      _this.physics.world.removeCollider(_this.playerCoinOverlap);
      _this.physics.world.removeCollider(_this.playerBonusOverlap);
      _this.player.setVelocity(0, -100);
      _this.player.setCollideWorldBounds(false);
      if (!_this.isDead) {
        _this.isDead = true;
        _this.lives--;
      }
      _this.livesText.setText("Lives: " + _this.lives);
      if (!_this.lives) {
        _this.gameOver = true;
        _this.gameOverText.setText("Game Over");
        _this.toMenuText.setText("Press Space to Return to Menu");
      }
    };
    return _this;
  }

  _createClass(GameScene, [{
    key: "preload",
    value: function preload() {
      this.load.spritesheet("dude", "assets/ryan.png", {
        frameWidth: 21,
        frameHeight: 45
      });
      this.load.image("sky", "assets/sky.png");
      this.load.image("ground", "assets/platform.png");
      this.load.image("Cat", "assets/Cat.png");
      this.load.image("lambda", "assets/LambdaCoin.png");
      this.load.image("react", "assets/react-coin.png");
      this.load.image("redux", "assets/redux-coin.png");
      this.load.image("node", "assets/node-coin.png");
      this.load.image("github", "assets/github-coin.png");
    }
  }, {
    key: "create",
    value: function create() {
      // background
      this.add.image(400, 300, "sky");

      //platforms
      this.platforms = this.physics.add.staticGroup();
      this.platforms.create(400, 568, "ground").setScale(2).refreshBody();
      this.platforms.create(550, 450, "ground").setScale(0.5, 1).refreshBody();
      this.platforms.create(250, 380, "ground").setScale(0.2, 1).refreshBody();
      this.platforms.create(600, 290, "ground").setScale(0.5, 1).refreshBody();
      this.platforms.create(330, 180, "ground").setScale(0.35, 1).refreshBody();
      this.platforms.create(770, 380, "ground").setScale(0.2, 1).refreshBody();
      this.platforms.create(0, 280, "ground");
      this.platforms.create(180, 90, "ground").setScale(0.6, 1).refreshBody();
      this.platforms.create(639, 110, "ground").setScale(0.5, 1).refreshBody();

      //player add and physics
      this.player = this.physics.add.sprite(100, 450, "dude");
      this.player.setBounce(0.1);
      this.player.setCollideWorldBounds(true);

      //keyboard events mounted
      this.cursors = this.input.keyboard.createCursorKeys();

      //render a series of lambda
      this.lambdas = this.physics.add.group({
        key: "lambda",
        repeat: 15,
        setXY: { x: 12, y: 0, stepX: 50, stepY: 30 }
      });

      //each lambda has different bounce
      this.lambdas.children.iterate(function (child) {
        return child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.8));
      });

      //Cats and bonuses created as a concept but none rendered
      this.Cats = this.physics.add.group();
      this.bonus = this.physics.add.group();

      //score display
      this.scoreText = this.add.text(16, 554, "Score: 0", {
        fontSize: "32px",
        fill: "#000"
      });

      this.livesText = this.add.text(616, 554, "Lives: " + this.lives, {
        fontSize: "32px",
        fill: "#000"
      });

      this.gameOverText = this.add.text(270, 150, "", {
        fontSize: "50px",
        fill: "red"
      });
      this.toMenuText = this.add.text(126, 480, '', {
        fontSize: "32px",
        fill: "#000"
      });

      //platform collider
      this.playerPlatformCollider = this.physics.add.collider(this.player, this.platforms);
      this.physics.add.collider(this.lambdas, this.platforms);
      this.physics.add.collider(this.Cats, this.platforms);
      this.physics.add.collider(this.Cats, this.Cats);

      //sprite interaction
      this.playerCoinOverlap = this.physics.add.overlap(this.player, this.lambdas, this.collectCoin, null, this);

      this.playerBonusOverlap = this.physics.add.overlap(this.player, this.bonus, this.collectCoin, null, this);

      this.playerCatCollider = this.physics.add.collider(this.player, this.Cats, this.hitCat, null, this);
    }
  }, {
    key: "update",
    value: function update() {
      if (this.bonusStatus) {
        this.bonusCounter++;
      }
      if (this.bonusStatus && this.bonusCounter > 300) {
        this.bonusStatus = false;
        this.bonusCounter = 0;
      }
      if (this.lambdasCollected === 15) {
        if (!this.bonusStatus) {
          this.bonusDrop();
        }
        this.bonusStatus = true;
      }

      if (this.isDead) {
        if (this.delayCounter === 5) {
          this.killerCatTween();
        }
        if (this.delayCounter === 15) {
          this.deathTween();
        }
        if (this.delayCounter < 120) {
          this.delayCounter++;
          return;
        } else {
          this.isDead = false;
          if (!this.gameOver) {
            this.lambdas.getChildren().forEach(function (child) {
              return child.disableBody(true, true);
            });
            this.delayCounter = 0;

            this.killerCat.disableBody(true, true);
            this.player = this.physics.add.sprite(100, 450, "dude");
            this.physics.add.collider(this.player, this.platforms);
            this.physics.add.collider(this.player, this.Cats, this.hitCat, null, this);
            this.physics.add.overlap(this.player, this.bonus, this.collectCoin, null, this);

            this.physics.add.overlap(this.player, this.lambdas, this.collectCoin, null, this);
            this.player.setCollideWorldBounds(true);
          } else {
            this.physics.pause();
            return;
          }
        }
      }
      if (this.lambdas.countActive(true) === 0 && !this.isDead) {
        //new lambdas
        this.newRound();
      }

      if (this.cursors.left.isDown) {
        this.player.setVelocityX(-170);
        this.player.anims.play("left", true);
      } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(170);
        this.player.anims.play("right", true);
      } else {
        this.player.setVelocityX(0);
        this.player.anims.play("turn");
      }
      if (this.cursors.up.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(-280);
      }
      if (this.cursors.space._justUp && this.gameOver) {
        this.lambdasCollected = 0;
        this.lives = 1;
        this.gameOver = false;
        this.score = 0;
        this.delayCounter = 0;
        this.scene.start('TitleScreen');
      }
    }
  }]);

  return GameScene;
}(Phaser.Scene);

/***/ }),

/***/ 466:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _phaser = __webpack_require__(220);

var _phaser2 = _interopRequireDefault(_phaser);

var _titleScreen = __webpack_require__(1148);

var _game = __webpack_require__(1149);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var gameConfig = {
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: [_titleScreen.TitleScreen, _game.GameScene]
};

new _phaser2.default.Game(gameConfig);

/***/ })

},[466]);