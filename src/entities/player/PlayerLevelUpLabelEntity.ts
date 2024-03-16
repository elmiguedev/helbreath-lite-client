import { Scene } from "phaser";
import { PlayerEntity } from "./PlayerEntity";

export class PlayerLevelUpLabelEntity {

  private TXT_Y_OFFSET = 40;
  private player: PlayerEntity;
  private txtLevelUp: Phaser.GameObjects.Text;
  private blinkTimer: Phaser.Time.TimerEvent;
  public onClick: Function;

  constructor(player: PlayerEntity) {
    this.player = player;
    this.create();
  }

  private create() {
    this.txtLevelUp = this.player.scene.add.text(
      this.player.x,
      this.player.y - this.TXT_Y_OFFSET,
      "LEVEL UP!",
      {
        align: "center",
        fontSize: "12px",
        fontStyle: "bold",
        fontFamily: "Consolas, Courier, monospace",
        color: "yellow"
      })
      .setOrigin(0.5)
      .setVisible(false);

    this.txtLevelUp.setInteractive({ cursor: "pointer" })
    this.txtLevelUp.on("pointerdown", () => {
      if (this.onClick) {
        this.onClick();
      }
    })
    this.createTextBlinkTimer();
  }

  private createTextBlinkTimer() {
    this.blinkTimer = this.player.scene.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => {
        if (this.txtLevelUp.style.color === "yellow") {
          this.txtLevelUp.setStyle({ color: "white" });
        } else {
          this.txtLevelUp.setStyle({ color: "yellow" });
        }
      }
    });
    this.blinkTimer.paused = true;
  }

  public show() {
    this.txtLevelUp.setVisible(true);
    this.blinkTimer.paused = false;
    this.player.scene.time.delayedCall(10000, () => {
      this.txtLevelUp.setVisible(false);
      this.blinkTimer.paused = true;
    })
  }

  public update() {
    this.txtLevelUp.setDepth(this.player.depth + 1);
    this.txtLevelUp.setPosition(
      this.player.x,
      this.player.y - this.TXT_Y_OFFSET
    );
  }
}