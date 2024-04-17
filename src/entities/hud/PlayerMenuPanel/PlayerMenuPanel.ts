import { Position } from "../../../domain/generic/Position";
import { PlayerAttributes } from "../../../domain/player/PlayerAttributes";
import { SocketManager } from "../../../sockets/SocketManager";
import { PlayerEntity } from "../../player/PlayerEntity";
import { UiMenuButtonContainer } from "../../ui/UiMenuButtonContainer";
import { UiPanel } from "../../ui/UiPanel";
import LevelUpButton from "../LevelUpButton";
import { PlayerLevelSetPanel } from "../PlayerLevelSetPanel/PlayerLevelSetPanel";
import { PlayerPanel } from "../PlayerPanel";

export class PlayerMenuPanel extends PlayerPanel {
  private playerLevelSetPanel: PlayerLevelSetPanel;
  private currentPanel: UiPanel;
  private socketManager: SocketManager;
  private levelUpButton: LevelUpButton;
  private menuButons: UiMenuButtonContainer;

  constructor(scene: Phaser.Scene, position: Position, player: PlayerEntity) {
    super(scene, position, player);
    this.createMenuButtons();
    this.createLevelUpButton();
    this.createLevelSetPanel();
  }

  public update() {
    if (!this.player || !this.playerLevelSetPanel) return;
    this.updateLevelUpButton();
    this.playerLevelSetPanel.updateStats();
  }

  public setPlayer(player: PlayerEntity) {
    super.setPlayer(player);

    if (this.playerLevelSetPanel)
      this.playerLevelSetPanel.setPlayer(player);
  }

  public setSocketManager(socketManager: SocketManager) {
    this.socketManager = socketManager;
  }

  public showLevelUpButton() {
    this.levelUpButton.show();
  }

  private createMenuButtons() {
    this.menuButons = new UiMenuButtonContainer(this.scene, this.position);
    this.menuButons.addButton("uiMenuButtons", 0, () => {
      this.showLevelSetPanel();
    });
    this.menuButons.addButton("uiMenuButtons", 3, () => {

    })
  }

  private createLevelSetPanel() {
    this.playerLevelSetPanel = new PlayerLevelSetPanel(this.scene);
    this.currentPanel = this.playerLevelSetPanel;
    this.playerLevelSetPanel.setPosition(
      this.scene.game.canvas.width - 36 - this.playerLevelSetPanel.getSize().width,
      this.scene.game.canvas.height - 120 - this.playerLevelSetPanel.getSize().height,
    );
    this.playerLevelSetPanel.onConfirm = (stats: PlayerAttributes) => {
      this.socketManager.playerAttributesNotifier.notify(stats);
      this.playerLevelSetPanel.reset();
    }
    this.playerLevelSetPanel.hide();
  }

  private showLevelSetPanel() {
    this.currentPanel = this.playerLevelSetPanel;
    this.playerLevelSetPanel.setPosition(
      this.scene.game.canvas.width - 36 - this.playerLevelSetPanel.getSize().width,
      this.scene.game.canvas.height - 120 - this.playerLevelSetPanel.getSize().height,
    );
    this.playerLevelSetPanel.show();
  }

  private createLevelUpButton() {
    const screenWidth = this.scene.game.canvas.width;
    const screenHeight = this.scene.game.canvas.height;

    this.levelUpButton = new LevelUpButton(this.scene, {
      x: screenWidth - 180,
      y: screenHeight - 150
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