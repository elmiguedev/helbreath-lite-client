import { StatBar } from "../entities/hud/StatBar";
import { StatContainer } from "../entities/hud/StatContainer";
import { PlayerEntity } from "../entities/player/PlayerEntity";

export class PlayerHud extends Phaser.Scene {
  private player: PlayerEntity
  private txtPlayerLevel: Phaser.GameObjects.Text
  private txtPlayerExp: Phaser.GameObjects.Text
  private txtPlayerHp: Phaser.GameObjects.Text
  private txtPlayerMana: Phaser.GameObjects.Text
  private txtPlayerStamina: Phaser.GameObjects.Text
  private txtFreeAttributesPoints: Phaser.GameObjects.Text
  private txtPlayerAttributes: Phaser.GameObjects.Text

  private healthContainer: StatContainer;
  private manaContainer: StatContainer;
  private expContainer: StatBar;

  constructor() {
    super("PlayerHud");
  }

  public create() {
    this.createTexts()
    this.createContainers();
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

  public createTexts() {
    this.txtPlayerLevel = this.add.text(10, 10, "Level: 0", {
      align: "left",
      fontSize: "24px",
      fontStyle: "bold",
      fontFamily: "Consolas, Courier, monospace",
      color: "black",
    });
    this.txtPlayerExp = this.add.text(10, 30, "Exp: 0", {
      align: "left",
      fontSize: "24px",
      fontStyle: "bold",
      fontFamily: "Consolas, Courier, monospace",
      color: "black",
    });
    this.txtPlayerHp = this.add.text(10, 50, "HP: 0", {
      align: "left",
      fontSize: "24px",
      fontStyle: "bold",
      fontFamily: "Consolas, Courier, monospace",
      color: "black",
    });
    this.txtPlayerMana = this.add.text(10, 70, "Mana: 0", {
      align: "left",
      fontSize: "24px",
      fontStyle: "bold",
      fontFamily: "Consolas, Courier, monospace",
      color: "black",
    });
    this.txtPlayerStamina = this.add.text(10, 90, "Stamina: 0", {
      align: "left",
      fontSize: "24px",
      fontStyle: "bold",
      fontFamily: "Consolas, Courier, monospace",
      color: "black",
    })
    this.txtFreeAttributesPoints = this.add.text(10, 110, "Free Attributes Points: 0", {
      align: "left",
      fontSize: "24px",
      fontStyle: "bold",
      fontFamily: "Consolas, Courier, monospace",
      color: "black",
    })
    this.txtPlayerAttributes = this.add.text(10, 140, "Attributes: ", {
      fontSize: "20px",
      fontStyle: "bold",
      fontFamily: "Consolas, Courier, monospace",
      color: "black",
    })
  }

  public setPlayer(player: PlayerEntity) {
    this.player = player
  }

  public update() {
    this.updatePlayerStates();
    this.updatePlayerContainers();
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

  private updatePlayerStates() {
    if (!this.player) return
    this.txtPlayerLevel.setText(`Level: ${this.player.getPlayerState().stats.level}`);
    this.txtPlayerExp.setText(`Exp: ${this.player.getPlayerState().stats.experience}`);
    this.txtPlayerHp.setText(`HP: ${this.player.getPlayerState().stats.health}`);
    this.txtPlayerMana.setText(`Mana: ${this.player.getPlayerState().stats.mana}`);
    this.txtPlayerStamina.setText(`Stamina: ${this.player.getPlayerState().stats.stamina}`);
    this.txtFreeAttributesPoints.setText(`Free Attributes Points: ${this.player.getPlayerState().stats.freeLevelPoints}`);
    this.txtPlayerAttributes.setText(`Attributes: 
  - str: ${this.player.getPlayerState().attributes.strength}
  - dex: ${this.player.getPlayerState().attributes.dexterity}
  - int: ${this.player.getPlayerState().attributes.intelligence}
  - vit: ${this.player.getPlayerState().attributes.vitality}
  - mag: ${this.player.getPlayerState().attributes.magic}
  - chr: ${this.player.getPlayerState().attributes.charisma}
    `);
  }


}