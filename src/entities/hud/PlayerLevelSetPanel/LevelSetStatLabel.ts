import { Scene } from "phaser";
import { Position } from "../../../domain/generic/Position";
import { MAP_TILE_SIZE_SCALE_FACTOR } from "../../../utils/constants";
import { LevelSetLabel } from "./LevelSetLabel";

export class LevelSetStatLabel extends Phaser.GameObjects.Container {
  private label: string;
  private levelSetLabel: LevelSetLabel;
  private originalValue: number;
  private increaseValue: number = 0;
  private increaseButton: Phaser.GameObjects.Image;
  private decreaseButton: Phaser.GameObjects.Image;

  constructor(scene: Scene, position: Position, label: string, value: number) {
    super(scene, position.x, position.y);
    this.label = label;

    this.createStatLabel();
    this.createButtons();
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
    // TODO: hacer una entidad para el boton para agregarle el set enable

    if (availablePoints > 0) {
      this.increaseButton.setFrame(0);
    } else {
      this.increaseButton.setFrame(2);
    }

    if (this.increaseValue > 0) {
      this.decreaseButton.setFrame(1);
    } else {
      this.decreaseButton.setFrame(3);
    }
  }

  private updateLabel() {
    this.levelSetLabel.setValue(this.originalValue + this.increaseValue);
    this.levelSetLabel.setBackgroundColor(
      this.increaseValue > 0 ? 0x3f5c50 : 0x4e4c5c
    )
  }

  private createStatLabel() {
    this.levelSetLabel = new LevelSetLabel(
      this.scene,
      { x: 0, y: 0 },
      this.label,
      0
    )
    this.add(this.levelSetLabel)
  }

  private createButtons() {
    this.increaseButton = this.scene.add.image(
      350,
      0,
      'uiLevelSetButtons',
      0
    );
    this.add(this.increaseButton)
    this.increaseButton.setScale(MAP_TILE_SIZE_SCALE_FACTOR)
    this.increaseButton.setOrigin(0, 0.5);
    this.increaseButton.setInteractive({ cursor: "pointer" });
    this.increaseButton.on('pointerdown', () => {
      if (this.increaseButton.frame.name === 0) this.increase();
    })

    this.decreaseButton = this.scene.add.image(
      410,
      0,
      'uiLevelSetButtons',
      1
    );
    this.add(this.decreaseButton)
    this.decreaseButton.setScale(MAP_TILE_SIZE_SCALE_FACTOR)
    this.decreaseButton.setOrigin(0, 0.5);
    this.decreaseButton.setInteractive({ cursor: "pointer" });
    this.decreaseButton.on('pointerdown', () => {
      console.log(this.decreaseButton.frame)
      if (this.decreaseButton.frame.name === 1) this.decrease();
    })
  }

  private increase() {
    this.increaseValue += 1;
    this.updateLabel();
  }

  private decrease() {
    this.increaseValue -= 1;
    this.updateLabel();
  }

}