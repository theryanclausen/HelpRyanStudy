export class TitleScreen extends Phaser.Scene {
  constructor() {
    super({ key: "TitleScreen" });
    this.player;
    this.lambdas;
    this.Cats;
    this.platforms;
    this.cursors;
    this.score = 0;
    this.gameOver = false;
    this.titleText;
    this.instructionsText;
    this.instructionsText2;
    this.playerPlatformCollider;
    this.playerHit = false;
    this.delayCounter = 0;
    this.killerCat;
    this.toGameText;

    this.killerCatTween = () => {
      return this.tweens.add({
        targets: this.killerCat,
        x: 400,
        y: 335,
        duration: 1750,
        scaleX: 2,
        scaleY: 2
      });
    };
    this.deathTween = () => {
      return this.tweens.add({
        targets: this.player,
        x: this.player.x,
        y: 650,
        duration: 1500,
        rotation: 10
      });
    };

    this.collectLambda = (player, lambda) => {
      lambda.disableBody(true, true);
    };

    this.hitCat = (player, Cat) => {
      this.killerCat = Cat;
      player.setTint(0xff0000);
      player.anims.play("turn");
      this.gameOver = true;
      this.physics.world.removeCollider(this.playerPlatformCollider);
      this.player.setCollideWorldBounds(false);
      this.player.setVelocityX(0);
      this.player.allowGravity = false;
      this.deathTween();
      this.killerCatTween();
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
    this.lambdas.children.iterate(child =>
      child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4))
    );

    //Cats created as a concept but none rendered
    this.Cats = this.physics.add.group();

    //score display
    this.titleText = this.add.text(120, 40, `Help Ryan Study`, {
      fontSize: "62px",
      fill: "#000"
    });
    this.instructionsText = this.add.text(80, 120, `Use the arrow keys to collect the Lambda Tokens.`, {
      fontSize: "22px",
      fill: "#000"
    });
    this.instructionsText2 = this.add.text(180, 160, `Avoid distractions from the Cat.`, {
      fontSize: "22px",
      fill: "#000"
    });

    this.toGameText = this.add.text(206, 454, 'Press Space to Start', {
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

    //sprite interaction
    this.physics.add.overlap(
      this.player,
      this.lambdas,
      this.collectLambda,
      null,
      this
    );

    this.physics.add.collider(this.player, this.Cats, this.hitCat, null, this);
  }

  update() {
    if(this.cursors.space._justUp){
      this.scene.start('GameScene')
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
        let Cat = this.Cats.create(800, 416, "Cat").setScale(0.2);
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
    }else{
      this.physics.pause()
    }
    
  }
}
