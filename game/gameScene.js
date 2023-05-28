class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }
  preload() {
    // loading image files
    this.load.image("0", "./assets/sprites/0.png");
    this.load.image("1", "./assets/sprites/1.png");
    this.load.image("2", "./assets/sprites/2.png");
    this.load.image("3", "./assets/sprites/3.png");
    this.load.image("4", "./assets/sprites/4.png");
    this.load.image("5", "./assets/sprites/5.png");
    this.load.image("6", "./assets/sprites/6.png");
    this.load.image("7", "./assets/sprites/7.png");
    this.load.image("8", "./assets/sprites/8.png");
    this.load.image("9", "./assets/sprites/9.png");
    this.load.image("bg", "./assets/sprites/background-day.png");
    this.load.image("ground", "./assets/sprites/base.png");
    this.load.image("pipe", "./assets/sprites/pipe-green.png");
    this.load.image("pipe-inv", "./assets/sprites/pipe-green-inv.png");
    this.load.image("gameover", "./assets/sprites/gameover.png");
    this.load.spritesheet("bird", "./assets/sprites/bird-spritesheet.png", {
      frameWidth: 34,
      frameHeight: 24,
    });

    // loading audio files
    this.load.audio("flap", "./assets/audio/wing.wav");
    this.load.audio("die", "./assets/audio/hit.wav");
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

    // Pipes
    const pipes = this.physics.add.group();
    gameState.pipes = pipes;
    // function to generate a set of pipes
    const generatePipes = () => {
      const pipeHeight = 640;
      const midpoint = 320; //midpoint of pipe

      const gap = 100; //gap b/w pipes
      const petrudingHeight = 100; //minimum height of pipe sticking out

      const groundHeight = 112;

      const min = -midpoint + petrudingHeight;
      const max =
        game.config.height - midpoint - groundHeight - gap - petrudingHeight;

      const range = min - max + 1;

      const height = min - Math.floor(Math.random() * range);

      const initialPosition = 414 + 52;

      const pipeInv = this.physics.add.sprite(
        initialPosition,
        height,
        "pipe-inv"
      );
      const pipe = this.physics.add.sprite(
        initialPosition,
        height + gap + pipeHeight,
        "pipe"
      );
      pipes.add(pipeInv);
      pipes.add(pipe);

      // diabling gravity for the pipes
      pipes.children.iterate(function (pipe) {
        pipe.body.setAllowGravity(false);
      });
      // giving the pipes some velocity
      pipes.setVelocityX(-30);
    };
    // Pipes Generation and Scoring
    generatePipes();
    setInterval(() => {
      generatePipes();
    }, 5000);

    // Platform
    gameState.platform = this.add.tileSprite(
      game.config.width / 2,
      game.config.height - 56,
      game.config.width,
      112,
      "ground"
    );
    // To display platform over pipes
    gameState.platform.setDepth(1);
    // Enable Arcade Physics for the tile sprite
    this.physics.add.existing(gameState.platform);
    gameState.platform.body.allowGravity = false;

    // Bird
    gameState.bird = this.physics.add.sprite(
      100,
      game.config.height / 2 - 70,
      "bird"
    );

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

    // Collisions
    // Game end condition
    this.physics.add.collider(gameState.platform, gameState.bird, () => {
      gameState.die.play();

      // Disabling the audio
      gameState.isGameOver = true;

      // Stopping all the physics
      this.physics.pause();

      // Stopping all the animations
      this.anims.pauseAll();

      // Adding gameOver screen
      this.add.sprite(
        game.config.width / 2,
        game.config.height / 2,
        "gameover"
      );
      this.input.on("pointerup", () => {
        this.scene.stop("GameScene");
        this.scene.start("StartScene");
      });
    });
    this.physics.add.collider(pipes, gameState.bird, () => {
      gameState.die.play();

      // Disabling the audio
      gameState.isGameOver = true;

      // Stopping all the physics
      this.physics.pause();

      // Stopping all the animations
      this.anims.pauseAll();

      // Adding gameOver screen
      this.add.sprite(
        game.config.width / 2,
        game.config.height / 2,
        "gameover"
      );
      this.input.on("pointerup", () => {
        this.scene.stop("GameScene");
        this.scene.start("StartScene");
      });
    });

    // Setting keyboard input
    gameState.cursors = this.input.keyboard.createCursorKeys();

    // Audio
    gameState.flap = this.sound.add("flap");
    gameState.die = this.sound.add("die");
  }

  update() {
    // Arrowhead up
    if (gameState.cursors.up.isDown) {
      gameState.bird.setVelocityY(-150);
      if (!gameState.isGameOver) {
        gameState.flap.play();
      }
    }
    // MouseClick
    this.input.on("pointerdown", () => {
      gameState.bird.setVelocityY(-150);
      if (!gameState.isGameOver) {
        gameState.flap.play();
      }
    });

    // Flap Animation
    gameState.bird.anims.play("flaps", true);

    // Background moving animation
    if (!gameState.isGameOver) {
      gameState.background.tilePositionX += 0.1;
      gameState.platform.tilePositionX += 0.5;
    }

    // Score
    // logic to get the score
    gameState.pipes.children.iterate(function (pipe) {
      if (
        pipe.getBounds().right < gameState.bird.getBounds().left &&
        !pipe.getData("scored")
      ) {
        // Pipe has been successfully passed
        gameState.score += 1;

        // Set a flag to prevent multiple scoring for the same pipe
        pipe.setData("scored", true);
      }
    });

    // logic to make score centered on screen dynamically
    let scoreArr = Math.floor(gameState.score / 2)
      .toString()
      .split("");
    let e = scoreArr.length / 2;
    let x = game.config.width / 2 - e * 30;
    // destroys previous score
    gameState.scoreDigits.forEach((digit) => digit.destroy());
    // Clear the array
    gameState.scoreDigits = [];
    // Iterate over the score digits and display them
    for (let i = 0; i < scoreArr.length; i++) {
      let scoreDigit = this.add.sprite(x, 100, scoreArr[i]);
      scoreDigit.setDepth(1);
      gameState.scoreDigits.push(scoreDigit);
      x += 30;
    }
  }
}
