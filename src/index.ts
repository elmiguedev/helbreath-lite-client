import { Game } from "phaser";
import { MainScene } from "./scenes/MainScene";
import { BootloaderScene } from "./scenes/BootloaderScene";

new Game({
  type: Phaser.AUTO,
  width: 640,
  height: 480,
  render: {
    pixelArt: true
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [
    BootloaderScene,
    MainScene
  ]
})