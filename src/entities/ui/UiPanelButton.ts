import { Position } from "../../domain/generic/Position";

export class UiPanelButton extends Phaser.GameObjects.Container {
  private sprite: Phaser.GameObjects.Sprite;
  private text: Phaser.GameObjects.Text;
  private enabled: boolean = true;
  public onClick: Function;

  constructor(scene: Phaser.Scene, position: Position, text: string) {
    super(scene, position.x, position.y);
    this.scene.add.existing(this);

    this.sprite = this.scene.add.sprite(0, 0, "uiPanelButton", 0);
    this.sprite.setInteractive({ cursor: "pointer" });

    this.sprite.on("pointerdown", () => {
      if (this.enabled)
        this.onClick && this.onClick();
    });

    this.text = this.scene.add.text(0, 0, text, {
      align: "center",
      fontSize: "32px",
      fontStyle: "bold",
      fontFamily: "Consolas, Courier, monospace",
      color: "white"
    });
    this.text.setOrigin(0.5, 0.5);

    this.add(this.sprite);
    this.add(this.text);

  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    this.sprite.setFrame(enabled ? 0 : 1);
    this.text.setAlpha(enabled ? 1 : 0.5);
  }
}