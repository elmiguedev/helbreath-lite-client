import Phaser from "phaser";
import TestMapJson from "../assets/tilemaps/test/test.json";
import HouseMapJson from "../assets/tilemaps/house/house.json";
import PlayerPng from "../assets/sprites/player/player.png";
import PlayerJson from "../assets/sprites/player/player.json";
import TerrainPng from "../assets/tilesets/terrain/terrain.png";
import DummyPng from "../assets/sprites/monsters/dummy/dummy.png";
import CrossPng from "../assets/sprites/generic/cross.png";
import UiPanelPng from "../assets/sprites/ui/panel/panel.png";
import UiPanelTitlePng from "../assets/sprites/ui/panel_title/panel_title.png";
import UiPanelTitleCloseButtonPng from "../assets/sprites/ui/panel_close_button/panel_close_button.png";
import UiMenuButtonsPng from "../assets/sprites/ui/menu_buttons/menu_buttons.png";
import UiStatBarPng from "../assets/sprites/ui/stat_bar/stat_bar.png";
import LevelSetButtons from "../assets/sprites/ui/level_set_buttons/level_set_buttons.png";
import LevelSetLabel from "../assets/sprites/ui/level_set_label/level_set_label.png";
import PanelButonPng from "../assets/sprites/ui/panel_button/panel_button.png";

export class BootloaderScene extends Phaser.Scene {
  constructor() {
    super("BootloaderScene");
  }

  preload() {
    this.load.tilemapTiledJSON("testMap", TestMapJson);
    this.load.tilemapTiledJSON("house", HouseMapJson);
    this.load.image("terrain", TerrainPng);

    this.load.image("uiPanel", UiPanelPng);
    this.load.image("uiPanelTitle", UiPanelTitlePng);
    this.load.image("uiPanelTitleCloseButtonPng", UiPanelTitleCloseButtonPng);
    this.load.spritesheet("uiMenuButtons", UiMenuButtonsPng, { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet("uiLevelSetButtons", LevelSetButtons, { frameWidth: 9, frameHeight: 9 });
    this.load.spritesheet("uiPanelButton", PanelButonPng, { frameWidth: 48, frameHeight: 16 });
    this.load.image("uiLevelSetLabel", LevelSetLabel);
    this.load.image("uiStatBar", UiStatBarPng);

    this.load.aseprite("player", PlayerPng, PlayerJson);
    this.load.image("dummy", DummyPng);
    this.load.image("cross", CrossPng);

    this.load.once("complete", () => {
      this.scene.start("WorldMapScene");
    })
  }
}