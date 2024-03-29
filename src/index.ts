import { Game } from "phaser";
import { BootloaderScene } from "./scenes/BootloaderScene";
import { WorldMapScene } from "./scenes/WorldMapScene";
import { PlayerHud } from "./huds/PlayerHud";

new Game({
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  scale: {
    // autoCenter: Phaser.Scale.CENTER_BOTH,
    // mode: Phaser.Scale.FIT,
    width: window.innerWidth,
    height: window.innerHeight
  },
  dom: {
    createContainer: true,
  },
  render: {
    pixelArt: true,
    roundPixels: false

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
    WorldMapScene,
    PlayerHud
  ]
})