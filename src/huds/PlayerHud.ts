import { PlayerAttributes } from "../domain/player/PlayerAttributes";
import LevelUpButton from "../entities/hud/LevelUpButton";
import { PlayerStatsPanel } from "../entities/hud/PlayerStatsPanel/PlayerStatsPanel";
import { StatBar } from "../entities/hud/StatBar";
import { StatContainer } from "../entities/hud/StatContainer";
import { PlayerEntity } from "../entities/player/PlayerEntity";
import { SocketManager } from "../sockets/SocketManager";

export class PlayerHud extends Phaser.Scene {
  private player: PlayerEntity;
  private socketManager: SocketManager;

  private txtLocation: Phaser.GameObjects.Text;

  private healthContainer: StatContainer;
  private manaContainer: StatContainer;
  private expContainer: StatBar;
  private levelUpButton: LevelUpButton;

  private playerStatsPanel: PlayerStatsPanel;

  constructor() {
    super("PlayerHud");
  }

  public create() {

    this.createContainers();
    this.createTexts()
    this.createLevelUpButton();
    this.createPanels();

    this.createMenu();

  }

  private createLevelUpButton() {
    const screenWidth = this.game.canvas.width;
    const screenHeight = this.game.canvas.height;

    this.levelUpButton = new LevelUpButton(this, {
      x: screenWidth - 300,
      y: screenHeight - 100
    });

    this.levelUpButton.show();
    this.levelUpButton.onClick = () => {
      if (!this.socketManager) return;
      this.socketManager.playerAttributesNotifier.notify({
        strength: 0,
        dexterity: 3,
        intelligence: 0,
        vitality: 0,
        luck: 0,
        charisma: 0,
        magic: 0
      })
    }
  }

  private createContainers() {
    const centerScreen = this.game.canvas.width / 2;
    const height = this.game.canvas.height;

    const healthContainerPosition = {
      x: centerScreen - 300,
      y: height - 50
    }

    const manaContainerPosition = {
      x: centerScreen + 300,
      y: height - 50
    }

    this.healthContainer = new StatContainer(this, healthContainerPosition, 0xff0000, 1);
    this.manaContainer = new StatContainer(this, manaContainerPosition, 0x0000ff, 1);
    const background = this.add.rectangle(centerScreen - 250, height - 100, 500, 50, 0xffffff).setOrigin(0, 0)
    this.expContainer = new StatBar(
      this,
      {
        x: centerScreen - 250,
        y: height - 100
      },
      {
        width: 500,
        height: 10
      },
      0x00ff00,
      1
    )

  }

  private createPanels() {
    this.playerStatsPanel = new PlayerStatsPanel(
      this,
      {
        x: this.game.canvas.width - 500,
        y: (this.game.canvas.height / 2) - 250
      },
      this.player
    )
    this.playerStatsPanel.hide();
    this.playerStatsPanel.onConfirm = (stats: PlayerAttributes) => {
      this.socketManager.playerAttributesNotifier.notify(stats);
      this.playerStatsPanel.hide();
    }
  }

  public createTexts() {
    this.txtLocation = this.add.text(
      (this.game.canvas.width / 2) - 200,
      this.game.canvas.height - 80,
      "",
      {
        fontSize: "20px",
        fontStyle: "bold",
        fontFamily: "Consolas, Courier, monospace",
        color: "black",
      }
    )
  }

  public setPlayer(player: PlayerEntity) {
    this.player = player;
    this.playerStatsPanel.setPlayer(player);
  }

  public setSocketManager(socketManager: SocketManager) {
    this.socketManager = socketManager;
  }

  public update() {
    this.updateTexts();
    this.updatePlayerContainers();
    this.updateLevelUpButton();
    this.playerStatsPanel.updateStats();
  }

  private updatePlayerContainers() {
    if (!this.player) return
    this.healthContainer.setValue(this.player.getPlayerState().stats.health);
    this.manaContainer.setValue(this.player.getPlayerState().stats.mana);
    this.healthContainer.setMaxValue(this.player.getPlayerState().stats.maxHealth);
    this.manaContainer.setMaxValue(this.player.getPlayerState().stats.maxMana);
    this.expContainer.setValue(this.player.getPlayerState().stats.experience - this.player.getPlayerState().stats.baseLevelExperience);
    this.expContainer.setMaxValue(this.player.getPlayerState().stats.nextLevelExperience - this.player.getPlayerState().stats.baseLevelExperience);
  }

  private updateTexts() {
    if (!this.player) return

    const playerX = Math.floor(this.player.getPlayerState().position.x);
    const playerY = Math.floor(this.player.getPlayerState().position.y);
    const worldMapId = this.player.getPlayerState().worldMapId;

    this.txtLocation.setText(`${worldMapId} (${playerX}, ${playerY})`);
  }

  private updateLevelUpButton() {
    if (!this.player) return;
    if (this.player.getPlayerState().stats.freeLevelPoints > 0) {
      this.levelUpButton.show();
    } else {
      this.levelUpButton.hide();
    }
  }

  private createMenu() {
    const statMenu = this.add
      .rectangle(
        this.game.canvas.width / 2 + 100,
        this.game.canvas.height - 90
        , 30, 30, 0x999999)
      .setOrigin(0);

    statMenu.setInteractive();
    statMenu.on("pointerdown", () => {
      this.playerStatsPanel.show();
    })
  }

}