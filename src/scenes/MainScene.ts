import Phaser from "phaser";
import io, { Socket } from "socket.io-client";
import { Player } from "../entities/Player";
import { WorldStatus } from "../entities/WorldStatus";
import { WorldMap } from "../entities/WorldMap";

export class MainScene extends Phaser.Scene {
  private players: Record<string, Player>;
  private mapLabel: Phaser.GameObjects.Text;
  private portals: Phaser.GameObjects.Rectangle[];
  private socket: Socket;

  constructor() {
    super("MainScene");

    this.players = {};
    this.portals = [];
  }

  create() {
    this.createHud();
    this.createSocket();
    this.createInput();



  }

  createHud() {
    this.mapLabel = this.add.text(10, 10, "");
  }

  createSocket() {
    this.socket = io("ws://localhost:3000");
    this.socket.on("world:state", (worldStatus: WorldStatus) => {
      this.updateWorld(worldStatus);
    })
    this.socket.on("player:disconnected", (id) => {
      if (this.players[id]) {
        this.players[id].destroy();
      }
      delete this.players[id];
    })
    this.socket.on("player:connected", (data) => {
      if (!this.players[data.id]) {
        this.players[data.id] = new Player({
          id: data.id,
          name: data.name,
          position: data.position,
          scene: this
        })
      }
    });
    this.socket.on("world:change", (change) => {
      this.resetWorld();
    })
  }

  createInput() {
    this.input.on("pointerdown", (pointer) => {
      this.socket.emit("player:move", {
        x: pointer.downX,
        y: pointer.downY
      })
    })
  }

  resetWorld() {
    this.clearWorld();
    this.clearPlayers();
  }

  updateWorld(worldStatus: WorldStatus) {
    this.updateWorldMap(worldStatus.world);
    this.updatePlayers(worldStatus.players);
  }

  updateWorldMap(worldMap: WorldMap) {
    this.mapLabel.setText(worldMap.name);
    if (this.portals.length === 0) {
      this.createMap(worldMap)
    }
  }

  updatePlayers(players: Player[]) {
    players.forEach((player: any) => {
      if (!this.players[player.id]) {
        this.players[player.id] = new Player({
          id: player.id,
          name: player.name,
          position: player.position,
          scene: this
        })
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
    this.portals.forEach((portal) => {
      portal.destroy();
    });
    this.portals = [];
  }

  createMap(worldMap: WorldMap) {
    worldMap.portals.forEach((portal) => {
      const p = this.add.rectangle(portal.position.x, portal.position.y, 60, 60, 0xffff00, 0.5).setOrigin(0);
      this.portals.push(p);
    })
  }
}