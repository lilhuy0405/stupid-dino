import * as Phaser from "phaser";
import MainScene from "./MainScene";

export default class MyGame extends Phaser.Game {
  constructor() {
    const config = {
      type: Phaser.WEBGL,
      width: 800,
      height: 600,
      backgroundColor: '#2d2d2d',
      pixelArt: true,
      parent: 'MapScene',
      scene: [MainScene]
    };
    super(config);
  }
}
new MyGame();



