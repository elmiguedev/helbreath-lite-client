import { Scene } from "phaser";
import { Position } from "../../domain/generic/Position";

export default class LevelUpButton extends Phaser.GameObjects.Text {
  private blinkTimer: Phaser.Time.TimerEvent;
  public onClick: Function;

  constructor(scene: Scene, position: Position) {
    super(scene, position.x, position.y, "LEVEL UP", {
      align: "center",
      fontSize: "32px",
      fontStyle: "bold",
      fontFamily: "Consolas, Courier, monospace",
      color: "yellow"
    });

    this.scene.add.existing(this);
    this.setInteractive({ cursor: "pointer" });
    this.setOrigin(0);
    this.createTextBlinkTimer();
    this.hide();
    this.on("pointerdown", () => {
      if (this.onClick) this.onClick();
    })
  }

  public show() {
    if (this.visible) return;
    this.setVisible(true);
    this.blinkTimer.paused = false;
  }

  public hide() {
    if (!this.visible) return;
    this.setVisible(false);
    this.blinkTimer.paused = true;
  }

  private createTextBlinkTimer() {
    this.blinkTimer = this.scene.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => {
        if (this.style.color === "yellow") {
          this.setStyle({ color: "white" });
        } else {
          this.setStyle({ color: "yellow" });
        }
      }
    });
    this.blinkTimer.paused = true;
  }

}