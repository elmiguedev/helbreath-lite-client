import { Position } from "../../../domain/generic/Position";

export class StatLabel {
  private scene: Phaser.Scene;
  private position: Position;
  private text: Phaser.GameObjects.Text;
  private value: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, position: Position, text: string, value: string) {
    this.scene = scene;
    this.position = position;
    this.text = this.scene.add.text(
      this.position.x,
      this.position.y,
      text,
      {
        align: "center",
        fontSize: "24px",
        fontStyle: "bold",
        fontFamily: "Consolas, Courier, monospace",
        color: "black"
      }
    ).setOrigin(0);
    this.value = this.scene.add.text(
      this.position.x + this.text.displayWidth + 5,
      this.position.y,
      value,
      {
        align: "center",
        fontSize: "24px",
        fontStyle: "bold",
        fontFamily: "Consolas, Courier, monospace",
        color: "black",
        backgroundColor: "lightgray",
        padding: {
          left: 10,
          right: 10,
          top: 0,
          bottom: 0
        }
      }
    ).setOrigin(0);
  }

  public setValue(value: number) {
    this.value.setText(value.toString());
  }

  public getWidth() {
    return this.text.displayWidth + this.value.displayWidth + 10;
  }

  public setBackgroundColor(color: string) {
    this.value.setBackgroundColor(color);
  }

  public setVisible(visible: boolean) {
    this.text.setVisible(visible);
    this.value.setVisible(visible);
  }
}