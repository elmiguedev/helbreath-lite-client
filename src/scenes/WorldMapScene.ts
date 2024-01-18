import { Scene } from "phaser";
import { WorldStatus } from "../domain/world/WorldStatus";
import { PlayerEntity } from "../entities/player/PlayerEntity";
import { MonsterEntity } from "../entities/monsters/MonsterEntity";
import { SocketManager } from "../sockets/SocketManager";
import { WorldMapEntity } from "../entities/worldmap/WorldMapEntity";
import { Player } from "../domain/player/Player";
import { Monster } from "../domain/monster/Monster";
import { PLAYER_MIN_ATTACK_DISTANCE } from "../utils/constants";

export class WorldMapScene extends Scene {

  private socketManager: SocketManager;
  private worldStatus: WorldStatus;
  private worldMapEntity: WorldMapEntity;
  private mainPlayer: PlayerEntity;
  private players: Record<string, PlayerEntity>;
  private monsters: Record<string, MonsterEntity>;

  // TODO: hacerle alto refactor
  private entityOver = false;
  private cross: Phaser.GameObjects.Image;


  constructor() {
    super("WorldMapScene");
    this.players = {};
    this.monsters = {};
    this.socketManager = new SocketManager(this);
    this.worldMapEntity = new WorldMapEntity(this);
  }

  create() {
    this.createCross();

    const g = this.add.group({
      runChildUpdate: true,
      classType: PlayerEntity
    });
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

  // createMonster(monster: Monster) {
  //   if (!this.monsters[monster.id]) {
  //     const monsterSprite = this.add.sprite(monster.position.x, monster.position.y, monster.type);
  //     this.monsters[monster.id] = monsterSprite;
  //     monsterSprite.setDepth(monster.position.y);
  //     monsterSprite.setOrigin(0.5, 1);
  //     monsterSprite.setInteractive({ cursor: 'pointer' });
  //     monsterSprite.on("pointerover", () => {
  //       this.entityOver = true;
  //     })
  //     monsterSprite.on("pointerout", () => {
  //       this.entityOver = false;
  //     })
  //     monsterSprite.on("pointerdown", () => {
  //       const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, monsterSprite.x, monsterSprite.y);
  //       if (distance > PLAYER_MIN_ATTACK_DISTANCE) {
  //         return;
  //       }
  //       if (!this.player.isAttacking) {
  //         this.socket.emit("player:attack:monster", {
  //           monsterId: monster.id
  //         })
  //         this.player.attack(monsterSprite);
  //       }
  //     })
  //     return monsterSprite;
  //   }
  // }


}