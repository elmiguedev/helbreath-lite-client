import { Scene } from "phaser";
import { Position } from "../../domain/generic/Position";
import { UiMenuButton } from "./UiMenuButton";
import { MAP_TILE_SIZE } from "../../utils/constants";

export class UiMenuButtonContainer {
  protected scene: Scene;
  protected position: Position;
  protected container: Phaser.GameObjects.Container;

  protected X_MARGIN = 8;

  constructor(scene: Scene, position: Position) {
    this.scene = scene;
    this.position = position;
    this.container = this.scene.add.container(this.position.x, this.position.y);
  }

  public addButton(texture: string, frame: string | number, onClick: Function) {

    const xPosition = (this.container.length * MAP_TILE_SIZE) + this.X_MARGIN * this.container.length;
    const button = new UiMenuButton(this.scene, { x: xPosition, y: 0 }, texture, frame);

    button.onClick = onClick;
    this.container.add(button);
  }
}