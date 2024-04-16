import { Position } from "../../../domain/generic/Position";
import { MAP_TILE_SIZE_SCALE_FACTOR } from "../../../utils/constants";

export class LevelSetLabel extends Phaser.GameObjects.Container {
  private label: string;
  private value: number;

  private txtLabel: Phaser.GameObjects.Text;
  private txtValue: Phaser.GameObjects.Text;
  private background: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, position: Position, label: string, value: number) {
    super(scene, position.x, position.y);
    this.label = label;
    this.value = value;
    this.createLabel();
    this.createBackground();
    this.createValue();
  }

  public setValue(value: number) {
    this.value = value;
    this.txtValue.setText(value.toString());
  }

  public setBackgroundColor(color: number) {
    this.background.setTint(color);
  }

  private createLabel() {
    this.txtLabel = this.scene.add.text(
      0, 0,
      this.label,
      {
        color: "white",
        fontSize: "28px",
        align: "center",
        fontStyle: "bold",
        fontFamily: "Consolas, Courier, monospace"
      }
    ).setOrigin(0, 0.5);
    this.add(this.txtLabel);
  }

  private createBackground() {
    this.background = this.scene.add.image(0, 0, 'uiLevelSetLabel');
    this.background.setScale(MAP_TILE_SIZE_SCALE_FACTOR);
    this.add(this.background);
    this.background.setPosition(200, 0);
    this.background.setOrigin(0, 0.5);
    this.background.setTint(0x4e4c5c);
  }

  private createValue() {
    this.txtValue = this.scene.add.text(
      260, 0,
      this.value.toString(),
      {
        color: "white",
        fontSize: "28px",
        align: "center",
        fontStyle: "bold",
        fontFamily: "Consolas, Courier, monospace"
      }
    ).setOrigin(0, 0.5);
    this.add(this.txtValue);
  }


}