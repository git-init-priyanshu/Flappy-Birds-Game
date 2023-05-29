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
      .setInteractive();
    playBtn.on("pointerdown", () => {
      socket.emit("ready", userName);
    });
    playBtn.on("pointerover", () => {
      document.querySelector("canvas").style.cursor = "pointer";
    });
    playBtn.on("pointerout", () => {
      document.querySelector("canvas").style.cursor = "default";
    });
    this.add.text(
      game.config.width / 2 - 20,
      game.config.height / 2 + 133.5 + 14.5 + 10 + 15,
      "Ready",
      {
        fontFamily: "Audiowide",
        fontSize: "12px",
        color: "#000000",
      }
    );

    // Displaying online players
    gameState.icon1 = this.add.sprite(20, 20, "red-bird");
    gameState.text1 = this.add.text(45, 10, "", {
      fontFamily: "Audiowide",
      color: "#ffffff",
    });
    gameState.icon2 = this.add.sprite(20, 50, "yellow-bird");
    gameState.text2 = this.add.text(45, 40, "", {
      fontFamily: "Audiowide",
      color: "#ffffff",
    });
    //making them invisible (for now)
    gameState.icon1.setScale(0.75, 0.75);
    gameState.icon2.setScale(0.75, 0.75);
    gameState.icon1.setVisible(false);
    gameState.icon2.setVisible(false);
    gameState.text1.setVisible(false);
    gameState.text2.setVisible(false);
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
    if (usersArr.length > 1) {
      let arr = [];
      // removing current user
      for (let i = 0; i < usersArr.length; i++) {
        if (usersArr[i].name !== userName) {
          arr.push(usersArr[i]);
        }
      }
      gameState.icon1.setVisible(false);
      gameState.icon2.setVisible(false);
      gameState.text1.setVisible(false);
      gameState.text2.setVisible(false);

      if (arr.length > 0) {
        gameState.icon1.setVisible(true);
        gameState.text1.setVisible(true);
        gameState.text1.setText(arr[0].name);
        gameState.text1.setColor(`${arr[0].isReady ? "#7bff56" : "#ffffff"}`);

        if (arr.length > 1) {
          gameState.icon2.setVisible(true);
          gameState.text2.setVisible(true);
          gameState.text2.setText(arr[1].name);
          gameState.text2.setColor(`${arr[1].isReady ? "#7bff56" : "#ffffff"}`);
        }
      }
    } else {
      gameState.icon1.setVisible(false);
      gameState.icon2.setVisible(false);
      gameState.text1.setVisible(false);
      gameState.text2.setVisible(false);
    }

    if (usersArr.length > 1) {
      let count = 0;
      // Starting new Scene
      for (let i = 0; i < usersArr.length; i++) {
        if (usersArr[i].isReady === true) {
          count++;
        }
      }
      // console.log(count);
      // console.log(usersArr.length);
      // console.log(count, usersArr.length);
      if (count === usersArr.length) {
        console.log("new");
        setTimeout(() => {
          this.scene.stop("StartScene");
          this.scene.start("GameScene");
        }, 3000);
      }
    }

    gameState.background.tilePositionX += 0.1;
    gameState.platform.tilePositionX += 0.5;
  }
}
