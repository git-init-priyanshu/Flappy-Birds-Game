class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: "StartScene" });
  }

  preload() {
    this.load.image("bg", "./assets/sprites/background-day.png");
    this.load.image("ground", "./assets/sprites/base.png");
    this.load.image("ready", "./assets/sprites/message.png");
    this.load.spritesheet("bird", "./assets/sprites/bird-spritesheet.png", {
      frameWidth: 34,
      frameHeight: 24,
    });
  }
  create() {
    // Background
    gameState.background = this.add.tileSprite(
      game.config.width / 2,
      game.config.height - 256,
      game.config.width,
      512,
      "bg"
    );

    // Platform
    gameState.platform = this.add.tileSprite(
      game.config.width / 2,
      game.config.height - 56,
      game.config.width,
      112,
      "ground"
    );

    // Bird
    gameState.bird = this.add.sprite(100, game.config.height / 2 - 70, "bird");
    // Setting up the animation
    this.anims.create({
      key: "flaps",
      frames: this.anims.generateFrameNumbers("bird", {
        start: 0,
        end: 3,
      }),
      frameRate: 8,
      repeat: -1,
    });
    // Setting up Tweens
    this.tweens.add({
      targets: gameState.bird,
      y: game.config.height / 2 - 50,
      ease: "Linear",
      duration: 600,
      repeat: -1,
      yoyo: true,
    });
    // Playing the animation
    gameState.bird.anims.play("flaps", true);

    // Start Screen
    this.add.sprite(game.config.width / 2, game.config.height / 2, "ready");
  }

  update() {
    // Starting next scene
    const cursor = this.input.keyboard.createCursorKeys();
    if (cursor.up.isDown) {
      this.scene.stop("StartScene");
      this.scene.start("GameScene");
    }
    this.input.on("pointerdown", () => {
      this.scene.stop("StartScene");
      this.scene.start("GameScene");
    });

    gameState.background.tilePositionX += 0.1;
    gameState.platform.tilePositionX += 0.5;
  }
}
