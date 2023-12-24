import Phaser from "phaser";
import io, { Socket } from "socket.io-client";
import { Player } from "../entities/Player";
import { WorldStatus } from "../entities/WorldStatus";
import { WorldMap } from "../entities/WorldMap";
import { WorldMapChange } from "../entities/WorldMapChange";

export class MainScene extends Phaser.Scene {
  private players: Record<string, Player>;
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
    this.socket = io("ws://localhost:3000");

    this.socket.on("world:state", (worldStatus: WorldStatus) => {
      if (!this.tilemap) {
        this.resetWorld(worldStatus.world.id)
      }
      this.updateWorld(worldStatus);
    })
    this.socket.on("player:disconnected", (id) => {
      if (this.players[id]) {
        this.players[id].destroy();
      }
      delete this.players[id];
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
    if (this.input.mousePointer.isDown) {
      this.socket.emit("player:move", {
        x: this.input.mousePointer.worldX,
        y: this.input.mousePointer.worldY
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
        })
        if (player.id === this.socket.id) {
          this.cameras.main.startFollow(this.players[player.id].body);
        }
      } else {
        this.players[player.id].setPosition(player.position);
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
    this.tilemap = this.add.tilemap("map");
    const terrainTileset = this.tilemap.addTilesetImage("terrain", "terrain");
    const bgLayer = this.tilemap.createLayer(`${worldMapId}/bg_1`, terrainTileset, 0, 0).setDepth(1);
  }
}