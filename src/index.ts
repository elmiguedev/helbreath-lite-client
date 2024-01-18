import { Game } from "phaser";
import { BootloaderScene } from "./scenes/BootloaderScene";
import { WorldMapScene } from "./scenes/WorldMapScene";

new Game({
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
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
    WorldMapScene
  ]
})