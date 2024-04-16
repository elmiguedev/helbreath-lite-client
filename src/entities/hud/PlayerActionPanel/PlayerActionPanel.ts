import { Scene } from "phaser";
import { Position } from "../../../domain/generic/Position";
import { PlayerEntity } from "../../player/PlayerEntity";
import { PlayerPanel } from "../PlayerPanel";
import { UiPanel } from "../../ui/UiPanel";
import { UiStatBar } from "../../ui/UiStatBar";

export class PlayerActionPanel extends PlayerPanel {

  private actionPanel: UiPanel;
  private xpBar: UiStatBar;

  constructor(scene: Scene, position: Position, player: PlayerEntity) {
    super(scene, position, player);

    this.createActionPanel();
    this.createExperienceBar();
  }

  public update() {
    super.update();
    this.xpBar.setValue(this.player.getPlayerState().stats.experience - this.player.getPlayerState().stats.baseLevelExperience);
    this.xpBar.setMaxValue(this.player.getPlayerState().stats.nextLevelExperience - this.player.getPlayerState().stats.baseLevelExperience);
  }

  private createActionPanel() {
    this.actionPanel = new UiPanel(
      this.scene,
      this.position,
      { width: 102, height: 22 }
    );
    this.actionPanel.enableCloseButton(false);
  }

  private createExperienceBar() {
    this.xpBar = new UiStatBar(
      this.scene,
      { x: this.position.x, y: this.position.y - 42 },
      { width: 102, height: 6 },
      0xfbf236,
      0,
      0,
      false
    )
  }

}