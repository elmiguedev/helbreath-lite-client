import Phaser from "phaser";
import io from "socket.io-client";
import { Player } from "../entities/Player";

export class MainScene extends Phaser.Scene {
  private players: Record<string, Player>;

  constructor() {
    super("MainScene");

    this.players = {};
  }

  create() {
    const socket = io("ws://localhost:3000");
    socket.on("world:state", (data) => {
      const players = data.players;
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
    })
    socket.on("player:disconnected", (id) => {
      if (this.players[id]) {
        this.players[id].destroy();
      }
      delete this.players[id];
    })
    socket.on("player:connected", (data) => {
      if (!this.players[data.id]) {
        this.players[data.id] = new Player({
          id: data.id,
          name: data.name,
          position: data.position,
          scene: this
        })
      }
    })

    this.input.on("pointerdown", (pointer) => {
      socket.emit("player:move", {
        x: pointer.downX,
        y: pointer.downY
      })
    })

  }
}