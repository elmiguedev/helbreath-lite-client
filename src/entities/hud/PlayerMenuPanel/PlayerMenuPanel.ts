import { Position } from "../../../domain/generic/Position";
import { PlayerAttributes } from "../../../domain/player/PlayerAttributes";
import { SocketManager } from "../../../sockets/SocketManager";
import { MAP_TILE_SIZE_SCALE_FACTOR } from "../../../utils/constants";
import { PlayerEntity } from "../../player/PlayerEntity";
import { UiMenuButtonContainer } from "../../ui/UiMenuButtonContainer";
import { UiPanel } from "../../ui/UiPanel";
import LevelUpButton from "../LevelUpButton";
import { PlayerLevelSetPanel } from "../PlayerLevelSetPanel/PlayerLevelSetPanel";

export class PlayerMenuPanel extends UiMenuButtonContainer {
  private playerLevelSetPanel: PlayerLevelSetPanel;
  private player: PlayerEntity;
  private currentPanel: UiPanel;
  private socketManager: SocketManager;
  private levelUpButton: LevelUpButton;

  constructor(scene: Phaser.Scene, position: Position) {
    super(scene, position);
    this.createLevelUpButton();
    this.createLevelSetButton();
    this.createMenuButton();
    this.createLevelSetPanel();
  }

  public update() {
    if (!this.player || !this.playerLevelSetPanel) return;
    this.playerLevelSetPanel.updateStats();
    this.updateLevelUpButton();
  }

  public setPlayer(player: PlayerEntity) {
    this.player = player;

    if (this.playerLevelSetPanel)
      this.playerLevelSetPanel.setPlayer(player);
  }

  public setSocketManager(socketManager: SocketManager) {
    this.socketManager = socketManager;
  }

  public showLevelUpButton() {
    this.levelUpButton.show();
  }

  private createLevelSetButton() {
    this.addButton("uiMenuButtons", 0, () => {
      this.showLevelSetPanel();
    });
  }

  private createMenuButton() {
    this.addButton("uiMenuButtons", 3, () => {

    })
  }

  private createLevelSetPanel() {
    this.playerLevelSetPanel = new PlayerLevelSetPanel(this.scene);
    this.currentPanel = this.playerLevelSetPanel;
    this.playerLevelSetPanel.setPosition(
      this.scene.game.canvas.width - 42 - this.playerLevelSetPanel.getSize().width * MAP_TILE_SIZE_SCALE_FACTOR,
      this.scene.game.canvas.height - 200 - this.playerLevelSetPanel.getSize().height * MAP_TILE_SIZE_SCALE_FACTOR,
    );
    this.playerLevelSetPanel.onConfirm = (stats: PlayerAttributes) => {
      this.socketManager.playerAttributesNotifier.notify(stats);
      this.playerLevelSetPanel.reset();
    }
  }

  private showLevelSetPanel() {
    this.currentPanel = this.playerLevelSetPanel;
    this.playerLevelSetPanel.setPosition(
      this.scene.game.canvas.width - 42 - this.playerLevelSetPanel.getSize().width * MAP_TILE_SIZE_SCALE_FACTOR,
      this.scene.game.canvas.height - 200 - this.playerLevelSetPanel.getSize().height * MAP_TILE_SIZE_SCALE_FACTOR,
    );
    this.playerLevelSetPanel.show();
  }

  private createLevelUpButton() {
    const screenWidth = this.scene.game.canvas.width;
    const screenHeight = this.scene.game.canvas.height;

    this.levelUpButton = new LevelUpButton(this.scene, {
      x: screenWidth - 260,
      y: screenHeight - 240
    });

    this.levelUpButton.onClick = () => {
      this.showLevelSetPanel();
      this.levelUpButton.hide();
    }
  }

  private updateLevelUpButton() {
    this.levelUpButton.update(this.player);
  }


}