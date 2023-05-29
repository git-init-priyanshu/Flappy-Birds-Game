class JoinGameScene extends Phaser.Scene {
  constructor() {
    super({ key: "JoinGameScene" });
  }

  preload() {
    this.load.image("bg", "./assets/sprites/background-day.png");
    this.load.image("ground", "./assets/sprites/base.png");
    this.load.image("input", "./assets/sprites/input.png");
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

    // Create an input element dynamically
    this.add.sprite(game.config.width / 2, game.config.height / 2, "input");
    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.style.position = "absolute";
    inputElement.style.top = `${game.config.height / 2}px`;
    inputElement.style.left = `${game.config.width / 2}px`;
    // text
    this.add.text(
      game.config.width / 2 - 100,
      game.config.height / 2 - 40,
      "Join room",
      { fontFamily: "Audiowide", fontSize: "15px", fill: "#000000" }
    );
    // text
    this.add.text(
      game.config.width / 2 - 100,
      game.config.height / 2 + 40,
      "Create room",
      { fontFamily: "Audiowide", fontSize: "15px", fill: "#000000" }
    );

    // Append the input element to the game's DOM container
    const gameContainer = document.querySelector("#game-container");
    gameContainer.appendChild(inputElement);

    // Handle input events
    inputElement.addEventListener("keydown", (event) => {
      // Check if Enter key is pressed
      if (event.key === "Enter") {
        const inputValue = inputElement.value;
        // Do something with the entered text
        console.log("Entered text:", inputValue);
        // Clear the input field
        inputElement.value = "";
      }
    });
  }

  update() {
    gameState.background.tilePositionX += 0.1;
    gameState.platform.tilePositionX += 0.5;
  }
}
