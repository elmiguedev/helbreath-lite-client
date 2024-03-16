import { Scene } from "phaser";
import { Position } from "../../domain/generic/Position";

export class StatContainer {

  private scene: Scene;
  private position: Position;
  private background: Phaser.GameObjects.Rectangle;
  private statValue: Phaser.GameObjects.Rectangle;
  private maxValue: number;
  private color: number

  constructor(scene: Scene, position: Position, color: number, maxValue: number) {
    this.scene = scene;
    this.position = position;
    this.color = color;
    this.maxValue = maxValue;

    this.create();
  }

  create() {
    this.background = this.scene.add.rectangle(
      this.position.x,
      this.position.y,
      100,
      100,
      0xffffff
    ).setOrigin(0.5, 1)
    this.statValue = this.scene.add.rectangle(
      this.position.x,
      this.position.y - 10,
      80,
      80,
      this.color
    ).setOrigin(0.5, 1)
  }

  setMaxValue(value: number) {
    this.maxValue = value
  }

  setValue(value: number) {
    this.statValue.displayHeight = (value / this.maxValue) * 80
  }
}