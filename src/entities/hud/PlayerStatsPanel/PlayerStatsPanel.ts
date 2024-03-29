import { Scene } from "phaser";
import { Position } from "../../../domain/generic/Position";
import { PlayerEntity } from "../../player/PlayerEntity";
import { StatLabel } from "./StatLabel";
import { StatButton } from "./StatButton";
import { PlayerAttributes } from "../../../domain/player/PlayerAttributes";

export class PlayerStatsPanel {
  private scene: Scene;
  private panel: Phaser.GameObjects.Rectangle;
  private position: Position;
  private player: PlayerEntity;
  private confirmButton: Phaser.GameObjects.Text;
  private hideButton: Phaser.GameObjects.Text;

  private statsLabels: {
    "strength": StatButton;
    "dexterity": StatButton;
    "intelligence": StatButton;
    "vitality": StatButton;
    "charisma": StatButton;
    "magic": StatButton;
  }

  private availablePointsLabel: StatLabel;

  public onConfirm: Function;

  constructor(scene: Scene, position: Position, player: PlayerEntity) {
    this.scene = scene;
    this.position = position;

    this.createPanel();
    this.createStatsLabels();
    this.createAvailablePointsLabel();
    this.createConfirmButton();
    this.createHideButton();
  }

  public show() {
    this.panel.setVisible(true);
    this.confirmButton.setVisible(true);
    this.hideButton.setVisible(true);
    this.availablePointsLabel.setVisible(true);
    Object.keys(this.statsLabels).forEach(key => {
      this.statsLabels[key].setVisible(true);
    })
  }

  public hide() {
    this.panel.setVisible(false);
    this.confirmButton.setVisible(false);
    this.hideButton.setVisible(false);
    this.availablePointsLabel.setVisible(false);
    Object.keys(this.statsLabels).forEach(key => {
      this.statsLabels[key].setVisible(false);
      this.statsLabels[key].reset()
    })
  }

  public updateStats() {
    if (!this.player) return;
    this.statsLabels["strength"].setValue(this.player.getPlayerState().attributes.strength);
    this.statsLabels["dexterity"].setValue(this.player.getPlayerState().attributes.dexterity);
    this.statsLabels["intelligence"].setValue(this.player.getPlayerState().attributes.intelligence);
    this.statsLabels["vitality"].setValue(this.player.getPlayerState().attributes.vitality);
    this.statsLabels["charisma"].setValue(this.player.getPlayerState().attributes.charisma);
    this.statsLabels["magic"].setValue(this.player.getPlayerState().attributes.magic);

    this.availablePointsLabel.setValue(this.player.getPlayerState().stats.freeLevelPoints);

    const increase = this.getButtonsIncreases();
    const available = this.player.getPlayerState().stats.freeLevelPoints;
    this.validateButtons(available - increase);

  }

  public setPlayer(player: PlayerEntity) {
    this.player = player;
  }

  private getButtonsIncreases() {
    let increase = 0;
    Object.keys(this.statsLabels).forEach(key => {
      increase += this.statsLabels[key].getIncreaseValue();
    })
    return increase;
  }

  private validateButtons(points: number) {
    Object.keys(this.statsLabels).forEach(key => {
      this.statsLabels[key].validateButtons(points);
    })
  }

  private createPanel() {
    this.panel = this.scene.add.rectangle(
      this.position.x,
      this.position.y,
      400,
      500,
      0xffffff
    ).setOrigin(0);
    this.panel.setInteractive();
  }

  private createStatsLabels() {
    this.statsLabels = {
      "strength": new StatButton(this.scene, { x: this.position.x + 20, y: this.position.y + 100 }, "STR", 0),
      "dexterity": new StatButton(this.scene, { x: this.position.x + 20, y: this.position.y + 150 }, "DEX", 0),
      "intelligence": new StatButton(this.scene, { x: this.position.x + 20, y: this.position.y + 200 }, "INT", 0),
      "vitality": new StatButton(this.scene, { x: this.position.x + 20, y: this.position.y + 250 }, "VIT", 0),
      "charisma": new StatButton(this.scene, { x: this.position.x + 20, y: this.position.y + 300 }, "CHA", 0),
      "magic": new StatButton(this.scene, { x: this.position.x + 20, y: this.position.y + 350 }, "MAG", 0),
    };
  }

  private createAvailablePointsLabel() {
    this.availablePointsLabel = new StatLabel(
      this.scene,
      {
        x: this.position.x + 20,
        y: this.position.y + 20
      },
      "Available points",
      "0"
    );
  }

  private createConfirmButton() {
    this.confirmButton = this.scene.add.text(
      this.position.x + 20,
      this.position.y + 400,
      "Confirm",
      {
        fontFamily: "Consolas, monospace",
        padding: {
          left: 12,
          right: 12
        },
        backgroundColor: "gray",
        align: "center",
        fontSize: "28px",
      }
    ).setOrigin(0);
    this.confirmButton.setInteractive({ cursor: "pointer" });
    this.confirmButton.on("pointerdown", () => {
      if (this.onConfirm) this.onConfirm(this.getIncreases());
    })
  }

  private getIncreases() {
    const increases: PlayerAttributes = {
      charisma: this.statsLabels.charisma.getIncreaseValue(),
      dexterity: this.statsLabels.dexterity.getIncreaseValue(),
      intelligence: this.statsLabels.intelligence.getIncreaseValue(),
      magic: this.statsLabels.magic.getIncreaseValue(),
      strength: this.statsLabels.strength.getIncreaseValue(),
      vitality: this.statsLabels.vitality.getIncreaseValue(),
      luck: 0
    }
    return increases;
  }

  private createHideButton() {
    this.hideButton = this.scene.add.text(
      this.position.x + 380,
      this.position.y,
      "x",
      {
        fontFamily: "Consolas, monospace",
        padding: {
          left: 12,
          right: 12
        },
        backgroundColor: "gray",
        align: "center",
        fontSize: "28px",
      }
    ).setOrigin(0);
    this.hideButton.setInteractive({ cursor: "pointer" });
    this.hideButton.on("pointerdown", () => {
      this.hide();
    })
  }

}
