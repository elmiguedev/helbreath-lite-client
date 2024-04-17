import { Position } from "../../domain/generic/Position";
import { Size } from "../../domain/generic/Size";

export class UiStatBar {
  private scene: Phaser.Scene;
  private position: Position;
  private size: Size;
  private background: Phaser.GameObjects.Rectangle;
  private bar: Phaser.GameObjects.Rectangle;
  private border: Phaser.GameObjects.NineSlice;
  private label: Phaser.GameObjects.Text;
  private color: number;
  private value: number = 0;
  private maxValue: number;
  private showLabel: boolean = true;

  constructor(scene: Phaser.Scene, position: Position, size: Size, color: number, maxValue: number, initialValue: number = maxValue, showLabel: boolean = true) {
    this.scene = scene;
    this.position = position;
    this.size = size;
    this.color = color;
    this.maxValue = maxValue;
    this.showLabel = showLabel;

    this.createBackground();
    this.createBar();
    this.createLabel();

    this.setValue(initialValue)
  }

  public setValue(value: number) {
    if (value > this.maxValue) this.value = this.maxValue;
    else if (value <= 0) this.value = 0;
    else this.value = value;
    this.updateBarSize();
  }

  public getValue() {
    return this.value
  }

  public setMaxValue(value: number) {
    this.maxValue = value;
  }

  public getMaxValue() {
    return this.maxValue;
  }

  public setVisible(visible: boolean) {
    this.background.setVisible(visible);
    this.bar.setVisible(visible);
    this.border.setVisible(visible);
    this.label.setVisible(visible);
  }

  private createBackground() {
    this.background = this.scene.add.rectangle(
      this.position.x + 4,
      this.position.y,
      this.size.width - 2,
      this.size.height - 2,
      0x9badb7
    );
    this.background.setOrigin(0);
    this.background.setInteractive();

    this.border = this.scene.add.nineslice(
      this.position.x,
      this.position.y,
      "uiStatBar",
      0,
      this.size.width,
      this.size.height,
      12,
      12,
      12,
      12
    );
    this.border.setOrigin(0);
    this.border.setDepth(this.background.depth + 2);
    this.border.setInteractive();

  }

  private createBar() {
    this.bar = this.scene.add.rectangle(
      this.position.x + 4,
      this.position.y,
      this.size.width - 2,
      this.size.height - 2,
      this.color
    );
    this.bar.setOrigin(0);
    this.bar.setDepth(this.background.depth + 1)
  }

  private createLabel() {
    this.label = this.scene.add.text(
      this.position.x + this.size.width / 2,
      this.position.y + this.size.height / 2,
      `${this.value}`,
      {
        color: "white",
        fontSize: "16px",
        align: "center",
        fontStyle: "bold",
        fontFamily: "Consolas, Courier, monospace"
      }
    );
    this.label.setOrigin(0.5);
    this.label.setDepth(this.border.depth + 1)

  }

  private updateBarSize() {
    this.bar.displayWidth = (this.value / this.maxValue) * (this.size.width - 12);
    this.label.setText(`${this.value}`)
    this.label.setVisible(this.showLabel)
  }
}