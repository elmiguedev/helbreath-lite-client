import { Physics, Scene } from "phaser";
import { WorldStatus } from "../domain/world/WorldStatus";
import { PlayerEntity } from "../entities/player/PlayerEntity";
import { MonsterEntity } from "../entities/monsters/MonsterEntity";
import { SocketManager } from "../sockets/SocketManager";
import { WorldMapEntity } from "../entities/worldmap/WorldMapEntity";
import { Player } from "../domain/player/Player";
import { Monster } from "../domain/monster/Monster";
import { PLAYER_MIN_ATTACK_DISTANCE } from "../utils/constants";
import { PlayerHud } from "../huds/PlayerHud";

export class WorldMapScene extends Scene {

  private socketManager: SocketManager;
  private worldStatus: WorldStatus;
  private worldMapEntity: WorldMapEntity;
  private mainPlayer: PlayerEntity;
  private players: Record<string, PlayerEntity>;
  private monsters: Record<string, MonsterEntity>;
  private playerHud: PlayerHud;

  // TODO: hacerle alto refactor
  private entityOver = false;
  private cross: Phaser.GameObjects.Image;

  private testKeys: {
    life: Phaser.Input.Keyboard.Key,
  }

  constructor() {
    super("WorldMapScene");
    this.players = {};
    this.monsters = {};
  }

  create() {
    this.createWorldMapEntity();
    this.createCross();
    this.createHud();

    const g = this.add.group({
      runChildUpdate: true,
      classType: PlayerEntity
    });

    this.testKeys = {
      life: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L),
    }

    this.createSocketManager();
  }

  private createSocketManager() {
    this.socketManager = new SocketManager(this);
  }

  private createWorldMapEntity() {
    this.worldMapEntity = new WorldMapEntity(this);

  }

  update() {
    this.checkInput();
    this.updatePlayerEntities();
  }

  // input methods (TODO: check if is necessary an input manager) 
  // --------------------------

  private createCross() {
    this.cross = this.add.image(0, 0, "cross");
    this.cross.setOrigin(0.5)
    this.cross.setDepth(2000)
  }

  private checkInput() {
    var worldPosition = this.cameras.main.getWorldPoint(this.input.x, this.input.y);
    if (this.input.mousePointer.isDown && !this.entityOver) {
      this.cross.setPosition(worldPosition.x, worldPosition.y);
      this.socketManager.movePlayerNotifier.notify(worldPosition);
    }

    if (this.testKeys.life.isDown) {
      this.mainPlayer.testHurt();
    }
  }

  private createHud() {
    this.scene.run("PlayerHud");
    this.playerHud = this.scene.get("PlayerHud") as PlayerHud;
  }

  // world status methods
  // ----------------------------

  public setWorldStatus(worldStatus: WorldStatus) {
    this.worldStatus = worldStatus;
  }

  // world map methods
  // -----------------------------

  public getWorldMapEntity() {
    return this.worldMapEntity;
  }

  // player methods
  // -----------------------------

  public clearPlayers() {
    Object.keys(this.players).forEach((id) => {
      this.players[id].destroy();
    })
    this.players = {};
  }

  public updatePlayerStates() {
    this.worldStatus.players.forEach((player: Player) => {
      if (!this.players[player.id]) {
        this.createPlayer(player);
      } else {
        this.getPlayer(player.id)
          .setPlayerState(player);
      }
    })
  }

  public createPlayer(player: Player) {
    this.players[player.id] = new PlayerEntity(this, player);
    if (player.id === this.socketManager.getSocketId()) {
      this.setMainPlayer(this.players[player.id]);
    }
  }

  public setMainPlayer(playerEntity: PlayerEntity) {
    this.mainPlayer = playerEntity;
    this.cameras.main.startFollow(this.mainPlayer);
    this.cameras.main.setZoom(3);
    this.mainPlayer.onLevelUpClick = () => {
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
    if (this.playerHud) this.playerHud.setPlayer(this.mainPlayer);
  }

  public getPlayer(id: string) {
    return this.players[id];
  }

  public updatePlayerEntities() {
    Object.keys(this.players).forEach((id) => {
      this.players[id].update();
    })
  }

  // monster methods
  // -----------------------------

  public clearMonsters() {
    Object.keys(this.monsters).forEach((id) => {
      this.monsters[id].destroy();
    });
    this.monsters = {};
  }

  public createMonster(monster: Monster) {
    const monsterEntity = new MonsterEntity(this, monster);

    monsterEntity.onPointerOver = () => {
      this.entityOver = true;
    }

    monsterEntity.onPointerOut = () => {
      this.entityOver = false;
    }

    monsterEntity.onPointerDown = () => {
      const distance = Phaser.Math.Distance.Between(
        this.mainPlayer.x, this.mainPlayer.y, monsterEntity.x, monsterEntity.y
      );
      if (distance > PLAYER_MIN_ATTACK_DISTANCE) {
        return;
      }
      if (!this.mainPlayer.isAttacking) {
        this.socketManager.attackMonsterNotifier.notify(monster.id);
        // this.player.attack(monsterSprite);
      }
    }

    this.monsters[monster.id] = monsterEntity;
  }

  public killMonster(monsterId: string) {
    if (this.monsters[monsterId]) {
      this.monsters[monsterId].destroy();
      delete this.monsters[monsterId];
      this.entityOver = false;
    }
  }

  public getMonster(id: string) {
    return this.monsters[id];
  }

  public updateMonsterStates() {
    this.worldStatus.monsters.forEach((monster: Monster) => {
      if (!this.getMonster(monster.id)) {
        this.createMonster(monster);
      } else {
        this.getMonster(monster.id)
          .setMonsterState(monster);
      }
    })
  }

}