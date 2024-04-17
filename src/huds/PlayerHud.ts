import LevelUpButton from "../entities/hud/LevelUpButton";
import { PlayerActionPanel } from "../entities/hud/PlayerActionPanel/PlayerActionPanel";
import { PlayerMenuPanel } from "../entities/hud/PlayerMenuPanel/PlayerMenuPanel";
import { PlayerStatsPanel } from "../entities/hud/PlayerStatsPanel/PlayerStatsPanel";
import { PlayerEntity } from "../entities/player/PlayerEntity";
import { SocketManager } from "../sockets/SocketManager";

export class PlayerHud extends Phaser.Scene {
  private player: PlayerEntity;
  private socketManager: SocketManager;
  private playerStatsPanel: PlayerStatsPanel;
  private playerActionPanel: PlayerActionPanel;
  private playerMenuPanel: PlayerMenuPanel;;

  constructor() {
    super("PlayerHud");
  }

  public create() {
    this.createPlayerStatsPanel();
    this.createPlayerActionPanel();
    this.createPlayerMenuPanel();
  }

  public update() {
    if (!this.player) return;
    this.playerStatsPanel.update();
    this.playerActionPanel.update();
    this.playerMenuPanel.update();
  }

  public setPlayer(player: PlayerEntity) {
    this.player = player;
    this.playerStatsPanel.setPlayer(player);
    this.playerActionPanel.setPlayer(player);
    this.playerMenuPanel.setPlayer(player);
  }

  private createPlayerStatsPanel() {
    const baseY = this.game.canvas.height - 110
    this.playerStatsPanel = new PlayerStatsPanel(
      this,
      {
        x: 32,
        y: baseY
      },
      this.player
    )
  }

  private createPlayerActionPanel() {
    const centerX = this.game.canvas.width / 2
    const baseY = this.game.canvas.height - 120
    this.playerActionPanel = new PlayerActionPanel(
      this,
      {
        x: centerX - 204,
        y: baseY
      },
      this.player
    )
  }

  private createPlayerMenuPanel() {
    const x = this.game.canvas.width - 140;
    const y = this.game.canvas.height - 70;

    this.playerMenuPanel = new PlayerMenuPanel(
      this,
      {
        x,
        y
      },
      this.player
    )

    this.playerMenuPanel.setSocketManager(this.socketManager);

  }

  public setSocketManager(socketManager: SocketManager) {
    this.socketManager = socketManager;
    if (this.playerMenuPanel) {
      this.playerMenuPanel.setSocketManager(socketManager);

    }
  }

  public showLevelUpButton() {
    this.playerMenuPanel.showLevelUpButton();
  }

}