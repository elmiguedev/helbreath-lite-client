import { Scene } from "phaser";
import { Position } from "../../domain/generic/Position";
import { Size } from "../../domain/generic/Size";

export class StatBar {

  private scene: Scene;
  private position: Position;
  private size: Size;
  private background: Phaser.GameObjects.Rectangle;
  private statValue: Phaser.GameObjects.Rectangle;
  private maxValue: number;
  private color: number

  constructor(scene: Scene, position: Position, size: Size, color: number, maxValue: number) {
    this.scene = scene;
    this.position = position;
    this.size = size;
    this.color = color;
    this.maxValue = maxValue;

    this.create();
  }

  create() {
    this.background = this.scene.add.rectangle(
      this.position.x,
      this.position.y,
      this.size.width,
      this.size.height,
      0xffffff
    ).setOrigin(0)
    this.statValue = this.scene.add.rectangle(
      this.position.x,
      this.position.y,
      this.size.width,
      this.size.height,
      this.color
    ).setOrigin(0)
  }

  setMaxValue(value: number) {
    this.maxValue = value
  }

  setValue(value: number) {
    this.statValue.displayWidth = (value / this.maxValue) * this.size.width
  }
}