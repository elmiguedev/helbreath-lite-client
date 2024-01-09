import Phaser from "phaser";
import io, { Socket } from "socket.io-client";
import { Player } from "../entities/Player";
import { WorldStatus } from "../entities/WorldStatus";
import { WorldMap } from "../entities/WorldMap";
import { WorldMapChange } from "../entities/WorldMapChange";
import { Monster } from "../entities/monsters/Monster";
import { PLAYER_MIN_ATTACK_DISTANCE } from "../utils/constants";

export class MainScene extends Phaser.Scene {
  private players: Record<string, Player>;
  private player: Player;
  private monsters: Record<string, Phaser.GameObjects.Sprite>;
  private playersGroup: Phaser.GameObjects.Group;
  private mapLabel: Phaser.GameObjects.Text;
  private tilemap: Phaser.Tilemaps.Tilemap;
  private socket: Socket;
  private cross: Phaser.GameObjects.Image;

  private entityOver = false;

  constructor() {
    super("MainScene");

    this.players = {};
    this.monsters = {};
  }

  create() {
    this.createHud();
    this.createSocket();

    // TODO: BORRAR ESTO
    this.cross = this.add.image(0, 0, "cross");
    this.cross.setOrigin(0.5)
    this.cross.setDepth(2000)
  }

  update() {
    this.checkInput();
  }

  createHud() {
    this.mapLabel = this.add.text(10, 10, "");
  }

  createSocket() {
    this.playersGroup = this.add.group({
      runChildUpdate: true,
    });
    this.socket = io("ws://localhost:3000");

    this.socket.on("world:status", (worldStatus: WorldStatus) => {
      if (!this.tilemap) {
        this.resetWorld(worldStatus.world.id)
      }
      this.updateWorld(worldStatus);
    })
    this.socket.on("player:disconnected", (id) => {
      if (this.players[id]) {
        this.players[id].destroy();
        delete this.players[id];
        this.playersGroup.remove(this.players[id]);
      }
    })
    this.socket.on("player:connected", (data) => {
      // TODO: este deberia ser solo creacion
      if (!this.players[data.id]) {
        this.players[data.id] = new Player({
          id: data.id,
          name: data.name,
          position: data.position,
          scene: this
        })
      }
    });
    this.socket.on("world:change", (change: WorldMapChange) => {
      this.resetWorld(change.toWorldMapId);
    })

    this.socket.on("monster:killed", (data) => {
      console.log("MONSTER KILLED", data)
      if (data) {
        this.killMonster(data.monster.id);
      }
    })

    this.socket.on("player:attack", (data) => {
      console.log("VIENE EL ATTACK", data)
      if (this.players[data.playerId]) {
        this.players[data.playerId].attack({});
      }
    })
  }

  checkInput() {
    var worldPosition = this.cameras.main.getWorldPoint(this.input.x, this.input.y);
    if (this.input.mousePointer.isDown && !this.entityOver) {
      this.cross.setPosition(worldPosition.x, worldPosition.y);
      this.socket.emit("player:move", {
        x: worldPosition.x,
        y: worldPosition.y
      })
    }
  }

  resetWorld(worldMapId: string) {
    this.clearWorld();
    this.createMap(worldMapId);
    this.clearPlayers();
  }

  updateWorld(worldStatus: WorldStatus) {
    this.updatePlayers(worldStatus.players);
    this.updateMonsters(worldStatus.monsters);
  }

  updatePlayers(players: Player[]) {
    // TODO: esto deberia ser solo movimiento
    players.forEach((player: any) => {
      if (!this.players[player.id]) {
        this.players[player.id] = new Player({
          id: player.id,
          name: player.name,
          position: player.position,
          scene: this
        });
        this.playersGroup.add(this.players[player.id]);
        if (player.id === this.socket.id) {
          this.player = this.players[player.id];
          this.cameras.main.startFollow(this.players[player.id]);
          this.cameras.main.setZoom(3);
        }
      } else {
        this.players[player.id].setPosition(player.position.x, player.position.y);
        this.players[player.id].target = player.target;
      }
    })
  }

  clearPlayers() {
    Object.keys(this.players).forEach((id) => {
      this.players[id].destroy();
    })
    this.players = {};
  }

  clearWorld() {
    this.mapLabel.setText("");
    this.tilemap && this.tilemap.destroy();
  }

  createMap(worldMapId: string) {
    console.log("createMap", worldMapId)
    this.tilemap = this.add.tilemap(worldMapId);
    const terrainTileset = this.tilemap.addTilesetImage("terrain", "terrain");
    const floorLayer = this.tilemap.createLayer(`floor`, [terrainTileset]).setDepth(1);
    console.log(floorLayer)
  }

  updateMonsters(monsters: Monster[]) {
    for (const m of monsters) {
      let monster = this.monsters[m.id];
      if (!monster) {
        monster = this.createMonster(m);
      }
      monster.setPosition(m.position.x, m.position.y);
    }
  }

  createMonster(monster: Monster) {
    if (!this.monsters[monster.id]) {
      const monsterSprite = this.add.sprite(monster.position.x, monster.position.y, monster.type);
      this.monsters[monster.id] = monsterSprite;
      monsterSprite.setDepth(monster.position.y);
      monsterSprite.setOrigin(0.5, 1);
      monsterSprite.setInteractive({ cursor: 'pointer' });
      monsterSprite.on("pointerover", () => {
        this.entityOver = true;
      })
      monsterSprite.on("pointerout", () => {
        this.entityOver = false;
      })
      monsterSprite.on("pointerdown", () => {
        const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, monsterSprite.x, monsterSprite.y);
        if (distance > PLAYER_MIN_ATTACK_DISTANCE) {
          return;
        }
        if (!this.player.isAttacking) {
          this.socket.emit("player:attack:monster", {
            monsterId: monster.id
          })
          this.player.attack(monsterSprite);
        }
      })
      return monsterSprite;
    }
  }

  killMonster(monsterId: string) {
    console.log("EL MONSTER PARA MATTAR", monsterId)
    if (this.monsters[monsterId]) {
      console.log(this.monsters[monsterId])
      this.monsters[monsterId].destroy();
      delete this.monsters[monsterId];
      this.entityOver = false; // TODO:cambiar este sistema de over de las entidades
    }
  }
}