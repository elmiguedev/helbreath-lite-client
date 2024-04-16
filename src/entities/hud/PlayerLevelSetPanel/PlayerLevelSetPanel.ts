import { PlayerAttributes } from "../../../domain/player/PlayerAttributes";
import { MAP_TILE_SIZE_SCALE_FACTOR } from "../../../utils/constants";
import { PlayerEntity } from "../../player/PlayerEntity";
import { UiPanel } from "../../ui/UiPanel";
import { UiPanelButton } from "../../ui/UiPanelButton";
import { LevelSetLabel } from "./LevelSetLabel";
import { LevelSetStatLabel } from "./LevelSetStatLabel";

const POSITION = { x: 0, y: 0 };
const SIZE = { width: 96, height: 140 };

export class PlayerLevelSetPanel extends UiPanel {
  private statsLabels: Record<string, LevelSetStatLabel>;
  private availablePointsLabel: LevelSetLabel;
  private confirmButton: UiPanelButton;
  private player: PlayerEntity;
  public onConfirm: Function;

  constructor(scene: Phaser.Scene) {
    super(scene, POSITION, SIZE, "Level set");

    this.createLabels();
    this.createConfirmButton();
  }

  public setPlayer(player: PlayerEntity) {
    this.player = player;
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
    this.confirmButton.setEnabled(available > 0);
  }

  public reset() {
    Object.keys(this.statsLabels).forEach(key => {
      this.statsLabels[key].reset();
    })
  }

  private validateButtons(points: number) {
    Object.keys(this.statsLabels).forEach(key => {
      this.statsLabels[key].validateButtons(points);
    })
  }

  private createLabels() {
    const baseY = 120;
    const increaseY = 90;

    this.statsLabels = {};

    this.availablePointsLabel = new LevelSetLabel(this.scene, { x: 60, y: baseY }, "Lvl points", 0);
    this.availablePointsLabel.setBackgroundColor(0x403a6e)

    this.statsLabels["strength"] = new LevelSetStatLabel(this.scene, { x: 60, y: baseY + (increaseY * 1) }, "Strength", 0);
    this.statsLabels["vitality"] = new LevelSetStatLabel(this.scene, { x: 60, y: baseY + (increaseY * 2) }, "Vitality", 0);
    this.statsLabels["dexterity"] = new LevelSetStatLabel(this.scene, { x: 60, y: baseY + (increaseY * 3) }, "Dexterity", 0);
    this.statsLabels["intelligence"] = new LevelSetStatLabel(this.scene, { x: 60, y: baseY + (increaseY * 4) }, "Intelligence", 0);
    this.statsLabels["magic"] = new LevelSetStatLabel(this.scene, { x: 60, y: baseY + (increaseY * 5) }, "Magic", 0);
    this.statsLabels["charisma"] = new LevelSetStatLabel(this.scene, { x: 60, y: baseY + (increaseY * 6) }, "Charisma", 0);

    this.add(this.availablePointsLabel);
    Object.values(this.statsLabels).forEach(label => this.add(label));

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

  private getButtonsIncreases() {
    let increase = 0;
    Object.keys(this.statsLabels).forEach(key => {
      increase += this.statsLabels[key].getIncreaseValue();
    })
    return increase;
  }

  private createConfirmButton() {
    const x = this.getSize().width / 2 * MAP_TILE_SIZE_SCALE_FACTOR;
    const y = this.getSize().height * MAP_TILE_SIZE_SCALE_FACTOR - 70;
    this.confirmButton = new UiPanelButton(this.scene, { x, y }, "Confirm");
    this.confirmButton.onClick = () => {
      this.onConfirm && this.onConfirm(this.getIncreases());
    }

    this.add(this.confirmButton);
  }
}