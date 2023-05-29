const socket = io("http://localhost:5001");

let usersArr = [];

let userName;
if (usersArr.length < 3) {
  userName = prompt("Enter user name");
  usersArr.push({ id: 1, name: userName, isReady: false });
}
//no problem
socket.emit("userJoined", userName);
socket.on("get-array", (users) => {
  usersArr = users;
  console.log(usersArr);
});

// If any user disconnects
//no problem
socket.on("user-disconnect", (users) => {
  usersArr = users;
  console.log(usersArr);
});
// Listening for events from server
socket.on("user-joined", (users) => {
  usersArr = users;
  console.log(usersArr);
});
socket.on("user-ready", (users) => {
  usersArr = users;
  console.log(usersArr);
});

class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: "StartScene" });
  }

  preload() {
    this.load.image("bg", "./assets/sprites/background-day.png");
    this.load.image("ground", "./assets/sprites/base.png");
    this.load.image("ready", "./assets/sprites/message.png");
    this.load.image("play", "./assets/sprites/play-button.png");
    this.load.spritesheet("bird", "./assets/sprites/bird-spritesheet.png", {
      frameWidth: 34,
      frameHeight: 24,
    });
    this.load.spritesheet(
      "red-bird",
      "./assets/sprites/red-bird-spritesheet.png",
      {
        frameWidth: 34,
        frameHeight: 24,
      }
    );
    this.load.spritesheet(
      "yellow-bird",
      "./assets/sprites/yellow-bird-spritesheet.png",
      {
        frameWidth: 34,
        frameHeight: 24,
      }
    );
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
    const playBtn = this.add
      .sprite(
        game.config.width / 2,
        game.config.height / 2 + 133.5 + 14.5 + 10,
        "play"
      )
      .setInteractive()
      .on("pointerdown", () => {
        socket.emit("ready", userName);
      });
  }

  update() {
    // Starting next scene

    // For single player
    // const cursor = this.input.keyboard.createCursorKeys();
    // if (cursor.up.isDown) {
    //   this.scene.stop("StartScene");
    //   this.scene.start("GameScene");
    // }
    // this.input.on("pointerdown", () => {
    //   this.scene.stop("StartScene");
    //   this.scene.start("GameScene");
    // });

    // For multiplayer
    // Displaying online players
    let arr = usersArr;
    if (arr.length > 1) {
      // removing current user
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].name === userName) {
          arr.splice(i, 1);
        }
      }

      const select = ["red-bird", "yellow-bird"];
      let char;
      let text;
      for (let i = 0; i < arr.length; i++) {
        // Destroy previous sprite and text objects (if any)
        if (char) {
          char.destroy();
        }
        if (text) {
          text.destroy();
        }
        char = this.add.sprite(20, 20 + i * 30, select[i]);
        text = this.add.text(45, 10 + i * 30, `${arr[i].name}`, {
          fontFamily: "Audiowide",
          color: `${arr[i].isReady ? "#7bff56" : "#ffffff"}`,
        });
      }
    }
    // this.add.sprite(20, 20, "red-bird");
    // this.add.text(45, 10, `${arr[0].name}`, {
    //   fontFamily: "Audiowide",
    //   color: `${arr[0].isReady ? "#7bff56" : "#ffffff"}`,
    // });

    // // If all 3 users are connected
    // if (arr.length > 1) {
    //   this.add.sprite(20, 50, "yellow-bird");
    //   this.add.text(45, 40, `${arr[1].name}`, {
    //     fontFamily: "Audiowide",
    //     color: `${arr[1].isReady ? "#7bff56" : "#ffffff"}`,
    //   });
    // }

    gameState.background.tilePositionX += 0.1;
    gameState.platform.tilePositionX += 0.5;
  }
}
