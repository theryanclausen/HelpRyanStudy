export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
    this.player;
    this.lambdas;
    this.Cats;
    this.platforms;
    this.cursors;
    this.score = 0;
    this.gameOver = false;
    this.isDead = false;
    this.scoreText;
    this.playerPlatformCollider;
    this.playerCoinOverlap;
    this.lives = 1;
    this.livesText;
    this.playerCatCollider;
    this.delayCounter = 0;
    this.killerCat;
    this.gameOverText;
    this.toMenuText;
    this.bonus;
    this.bonusCounter = 0;
    this.bonusStatus = false;
    this.bonusArray = ["react", "redux", "node", "github"];
    this.lambdasCollected = 0;
    this.playerBonusOverlap;

    this.deathTween = () => {
      return this.tweens.add({
        targets: this.player,
        x: this.player.x,
        y: 650,
        duration: 1500,
        rotation: 10
      }); 
    };

    this.killerCatTween = () => {
      return this.tweens.add({
        targets: this.killerCat,
        x: 400,
        y: 324,
        duration: 1850,
        scaleX: 2,
        scaleY: 2
      });
    };

    this.newRound = () => {
      this.lambdas.children.iterate(child =>
        child.enableBody(
          true,
          child.x,
          Phaser.Math.Between(-50, 390),
          true,
          true
        )
      );
      let x =
        this.player.x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400);
      let Cat = this.Cats.create(x, 16, "Cat").setScale(0.2);
      Cat.setBounce(1);
      Cat.setCollideWorldBounds(true);
      Cat.setVelocity(Phaser.Math.Between(-190, 190), 15);
    };

    this.bonusDrop = () => {
      this.lambdasCollected = 0;
      let coin = this.bonus
        .create(
          Phaser.Math.Between(0, 800),
          -1,
          Phaser.Math.RND.pick(this.bonusArray)
        )
        .setScale(0.5);
      coin.body.setAllowGravity(false);
      coin.setVelocityY(150);
    };

    this.collectCoin = (player, coin) => {
      coin.disableBody(true, true);
      if (this.lambdas.children.entries.includes(coin)) {
        this.score += 10;
        this.lambdasCollected ++;
      }
      if (this.bonus.children.entries.includes(coin)) {
        this.score += 100;
        this.bonusStatus = false;
      }
      this.scoreText.setText(`Score: ${this.score}`);
    };

    this.hitCat = (player, Cat) => {
      player.setTint(0xff0000);
      player.anims.play("turn");
      this.physics.world.removeCollider(this.playerCatCollider);
      this.killerCat = Cat;
      this.killerCat.setVelocity(0, -100);
      this.physics.world.removeCollider(this.killerCat, this.Cats);
      this.physics.world.removeCollider(this.killerCat, this.platforms);
      this.player.allowGravity = false;
      this.physics.world.removeCollider(this.playerPlatformCollider);
      this.physics.world.removeCollider(this.playerCoinOverlap);
      this.physics.world.removeCollider(this.playerBonusOverlap);
      this.player.setVelocity(0, -100);
      this.player.setCollideWorldBounds(false);
      if (!this.isDead) {
        this.isDead = true;
        this.lives--;
      }
      this.livesText.setText(`Lives: ${this.lives}`);
      if (!this.lives) {
        this.gameOver = true;
        this.gameOverText.setText("Game Over");
        this.toMenuText.setText("Press Space to Return to Menu")
      }
    };
  }

  preload() {
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

  create() {
    // background
    this.add.image(400, 300, "sky");

    //platforms
    this.platforms = this.physics.add.staticGroup();
    this.platforms
      .create(400, 568, "ground")
      .setScale(2)
      .refreshBody();
    this.platforms
      .create(550, 450, "ground")
      .setScale(0.5, 1)
      .refreshBody();
    this.platforms
      .create(250, 380, "ground")
      .setScale(0.2, 1)
      .refreshBody();
    this.platforms
      .create(600, 290, "ground")
      .setScale(0.5, 1)
      .refreshBody();
    this.platforms
      .create(330, 180, "ground")
      .setScale(0.35, 1)
      .refreshBody();
    this.platforms
      .create(770, 380, "ground")
      .setScale(0.2, 1)
      .refreshBody();
    this.platforms.create(0, 280, "ground");
    this.platforms
      .create(180, 90, "ground")
      .setScale(0.6, 1)
      .refreshBody();
    this.platforms
      .create(639, 110, "ground")
      .setScale(0.5, 1)
      .refreshBody();

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
    this.lambdas.children.iterate(child =>
      child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.8))
    );

    //Cats and bonuses created as a concept but none rendered
    this.Cats = this.physics.add.group();
    this.bonus = this.physics.add.group();

    //score display
    this.scoreText = this.add.text(16, 554, `Score: 0`, {
      fontSize: "32px",
      fill: "#000"
    });

    this.livesText = this.add.text(616, 554, `Lives: ${this.lives}`, {
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
    this.playerPlatformCollider = this.physics.add.collider(
      this.player,
      this.platforms
    );
    this.physics.add.collider(this.lambdas, this.platforms);
    this.physics.add.collider(this.Cats, this.platforms);
    this.physics.add.collider(this.Cats, this.Cats);

    //sprite interaction
    this.playerCoinOverlap = this.physics.add.overlap(
      this.player,
      this.lambdas,
      this.collectCoin,
      null,
      this
    );

    this.playerBonusOverlap = this.physics.add.overlap(
      this.player,
      this.bonus,
      this.collectCoin,
      null,
      this
    );

    this.playerCatCollider = this.physics.add.collider(
      this.player,
      this.Cats,
      this.hitCat,
      null,
      this
    );
  }

  update() {
    if (this.bonusStatus){
      this.bonusCounter++;
    }
    if (this.bonusStatus && this.bonusCounter > 300) {
      this.bonusStatus = false;
      this.bonusCounter = 0;
    }
    if ((this.lambdasCollected===15)) {
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
          this.lambdas
            .getChildren()
            .forEach(child => child.disableBody(true, true));
          this.delayCounter = 0;

          this.killerCat.disableBody(true, true);
          this.player = this.physics.add.sprite(100, 450, "dude");
          this.physics.add.collider(this.player, this.platforms);
          this.physics.add.collider(
            this.player,
            this.Cats,
            this.hitCat,
            null,
            this
          );
          this.physics.add.overlap(
            this.player,
            this.bonus,
            this.collectCoin,
            null,
            this
          );

          this.physics.add.overlap(
            this.player,
            this.lambdas,
            this.collectCoin,
            null,
            this
          );
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
    if(this.cursors.space._justUp && this.gameOver){
      this.lambdasCollected = 0;
      this.lives = 1;
      this.gameOver = false;
      this.score = 0;
      this.delayCounter = 0;
      this.scene.start('TitleScreen')
    }
  }
}
