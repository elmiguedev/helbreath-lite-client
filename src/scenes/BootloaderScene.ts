import Phaser from "phaser";
import TestMapJson from "../assets/tilemaps/test/test.json";
import HouseMapJson from "../assets/tilemaps/house/house.json";
import PlayerPng from "../assets/sprites/player/player.png";
import PlayerJson from "../assets/sprites/player/player.json";
import TerrainPng from "../assets/tilesets/terrain/terrain.png";

export class BootloaderScene extends Phaser.Scene {
  constructor() {
    super("BootloaderScene");
  }

  preload() {
    this.load.tilemapTiledJSON("testMap", TestMapJson);
    this.load.tilemapTiledJSON("house", HouseMapJson);
    this.load.image("terrain", TerrainPng);

    this.load.aseprite("player", PlayerPng, PlayerJson);

    this.load.once("complete", () => {
      this.scene.start("MainScene");
    })
  }
}