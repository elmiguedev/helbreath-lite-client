import Phaser from "phaser";
import MapJson from "../assets/tilemaps/maps.json";
import TerrainPng from "../assets/tilesets/terrain.png";

export class BootloaderScene extends Phaser.Scene {
  constructor() {
    super("BootloaderScene");
  }

  preload() {
    this.load.tilemapTiledJSON("map", MapJson);
    this.load.image("terrain", TerrainPng);

    this.load.once("complete", () => {
      this.scene.start("MainScene");
    })
  }
}