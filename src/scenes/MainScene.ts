import Phaser from "phaser";
import io, { Socket } from "socket.io-client";
import { Player } from "../entities/Player";
import { WorldStatus } from "../entities/WorldStatus";
import { WorldMap } from "../entities/WorldMap";
import { WorldMapChange } from "../entities/WorldMapChange";

export class MainScene extends Phaser.Scene {
  private players: Record<string, Player>;
  private playersGroup: Phaser.GameObjects.Group;
  private mapLabel: Phaser.GameObjects.Text;
  private tilemap: Phaser.Tilemaps.Tilemap;
  private socket: Socket;

  constructor() {
    super("MainScene");

    this.players = {};
  }

  create() {
    this.createHud();
    this.createSocket();


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

    this.socket.on("world:state", (worldStatus: WorldStatus) => {
      if (!this.tilemap) {
        console.log("createMap", worldStatus.world.id)
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
      console.log(change)
      this.resetWorld(change.toWorldMapId);
    })
  }

  checkInput() {
    var worldPosition = this.cameras.main.getWorldPoint(this.input.x, this.input.y);
    if (this.input.mousePointer.isDown) {
      this.socket.emit("player:move", {
        x: worldPosition.x,
        y: worldPosition.y
      })
    }
  }

  resetWorld(worldMapId: string) {
    console.log("reseteamos el mundo", worldMapId)
    this.clearWorld();
    this.createMap(worldMapId);
    this.clearPlayers();
  }

  updateWorld(worldStatus: WorldStatus) {
    this.updatePlayers(worldStatus.players);
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
}