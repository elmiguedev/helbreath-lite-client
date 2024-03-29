import { Position } from "../../../domain/generic/Position";
import { StatLabel } from "./StatLabel";

export class StatButton {

  private scene: Phaser.Scene;
  private position: Position;
  private statLabel: StatLabel;
  private increaseButton: Phaser.GameObjects.Text;
  private decreaseButton: Phaser.GameObjects.Text;
  private visible: boolean = true;
  private text: string;
  private originalValue: number;
  private increaseValue: number = 0;

  constructor(scene: Phaser.Scene, position: Position, text: string, value: number) {
    this.scene = scene;
    this.position = position;
    this.originalValue = value;
    this.text = text;
    this.createStatLabel();
    this.createButton();
  }

  public setValue(value: number) {
    this.originalValue = value;
    this.updateLabel();
  }

  public reset() {
    this.increaseValue = 0;
    this.updateLabel();
  }

  public getIncreaseValue() {
    return this.increaseValue;
  }

  public validateButtons(availablePoints: number) {
    if (availablePoints > 0) {
      this.increaseButton.setVisible(this.visible && true);
    } else {
      this.increaseButton.setVisible(this.visible && false);
    }

    if (this.increaseValue > 0) {
      this.decreaseButton.setVisible(this.visible && true);
    } else {
      this.decreaseButton.setVisible(this.visible && false);
    }

  }

  public setVisible(visible: boolean) {
    this.visible = visible;
  }

  private createStatLabel() {
    this.statLabel = new StatLabel(
      this.scene,
      this.position,
      this.text,
      this.originalValue.toString()
    )
  }

  private createButton() {

    this.decreaseButton = this.scene.add.text(
      this.position.x + this.statLabel.getWidth() + 10,
      this.position.y - 1,
      "-",
      {
        backgroundColor: "red",
        align: "center",
        fontSize: "28px",
        padding: {
          left: 4,
          right: 4
        },
      }
    ).setOrigin(0)

    this.increaseButton = this.scene.add.text(
      this.position.x + this.statLabel.getWidth() + 40,
      this.position.y - 1,
      "+",
      {
        padding: {
          left: 4,
          right: 4
        },
        backgroundColor: "red",
        align: "center",
        fontSize: "28px",

      }
    ).setOrigin(0)

    this.increaseButton.setInteractive({ cursor: "pointer" });
    this.decreaseButton.setInteractive({ cursor: "pointer" });

    this.increaseButton.on("pointerdown", () => {
      this.increase();
    });

    this.decreaseButton.on("pointerdown", () => {
      this.decrease();
    });
  }

  private increase() {
    this.increaseValue += 1;
    this.updateLabel();
  }

  private decrease() {
    this.increaseValue -= 1;
    this.updateLabel();
  }

  private updateLabel() {
    this.statLabel.setValue(this.originalValue + this.increaseValue);
    this.statLabel.setBackgroundColor(
      this.increaseValue > 0 ? "green" : "lightgray"
    )
    this.statLabel.setVisible(this.visible);
  }

}