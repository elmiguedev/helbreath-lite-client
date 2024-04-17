import { Scene } from "phaser";
import { Position } from "../../../domain/generic/Position";
import { UiStatBar } from "../../ui/UiStatBar";
import { PlayerEntity } from "../../player/PlayerEntity";
import { PlayerPanel } from "../PlayerPanel";

export class PlayerStatsPanel extends PlayerPanel {

  private hpBar: UiStatBar;
  private manaBar: UiStatBar;

  constructor(scene: Scene, position: Position, player: PlayerEntity) {
    super(scene, position, player);
    this.createHealthBar();
    this.createManaBar();
  }

  public show() {
    this.hpBar.setVisible(true);
    this.manaBar.setVisible(true);
  }

  public hide() {
    this.hpBar.setVisible(false);
    this.manaBar.setVisible(false);
  }

  public update() {
    super.update();
    const stats = this.player.getPlayerState().stats;
    this.hpBar.setMaxValue(stats.maxHealth);
    this.hpBar.setValue(stats.health);
    this.manaBar.setMaxValue(stats.maxMana);
    this.manaBar.setValue(stats.mana);
  }

  public setPlayer(player: PlayerEntity) {
    this.player = player;
  }

  private createHealthBar() {
    this.hpBar = new UiStatBar(
      this.scene,
      { x: this.position.x, y: this.position.y },
      { width: 168, height: 36 },
      0xd95763,
      0
    );
  }

  private createManaBar() {
    this.manaBar = new UiStatBar(
      this.scene,
      { x: this.position.x, y: this.position.y + 44 },
      { width: 168, height: 36 },
      0x639bff,
      0
    )
  }

}