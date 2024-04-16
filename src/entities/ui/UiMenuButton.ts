import { Scene } from "phaser";
import { Position } from "../../domain/generic/Position";
import { MAP_TILE_SIZE_SCALE_FACTOR } from "../../utils/constants";

export class UiMenuButton extends Phaser.GameObjects.Sprite {
  public onClick: Function;

  constructor(scene: Scene, position: Position, texture: string, frame?: string | number) {
    super(scene, position.x, position.y, texture, frame);
    this.scene.add.existing(this);
    this.setInteractive({ cursor: "pointer" });
    this.setScale(MAP_TILE_SIZE_SCALE_FACTOR);

    this.on("pointerdown", () => {
      this.onClick && this.onClick();
    });
  }


}