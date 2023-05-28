const gameState = {
  isGameOver: false,
  score: 0,
};

const maxWidth = 414;
const maxHeight = 915;

const config = {
  type: Phaser.AUTO,
  width: Math.min(window.innerWidth, maxWidth),
  height: Math.min(window.innerHeight, maxHeight),
  backgroundColor: "#4ec0ca",
  scene: [StartScene, GameScene],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
};

const game = new Phaser.Game(config);
