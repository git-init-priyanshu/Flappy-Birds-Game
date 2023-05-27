class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: "GameOver" });
  }
  preload() {
    this.load.image("gameover", "./assets/sprites/gameover.png");
  }
  create() {
    this.add.sprite(168, 256, "gameover");
  }
}
