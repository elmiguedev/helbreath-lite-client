import io, { Socket } from "socket.io-client";
import { WorldStatusHandler } from "./handlers/WorldStatusHandler";
import { WorldMapScene } from "../scenes/WorldMapScene";
import { PlayerChangeMapHandler } from "./handlers/PlayerChangeMapHandler";
import { PlayerAttackHandler } from "./handlers/PlayerAttackHandler";
import { MonsterKilledHandler } from "./handlers/MonsterKilledHandler";
import { MovePlayerNotifier } from "./notifiers/MovePlayerNotifier";
import { AttackMonsterNotifier } from "./notifiers/AttackMonsterNotifier";
import { RemovePlayerNotifier } from "./notifiers/RemovePlayerNotifier";
import { Position } from "../domain/generic/Position";

export class SocketManager {
  private scene: WorldMapScene;
  private socket: Socket;

  public movePlayerNotifier: MovePlayerNotifier;
  public attackMonsterNotifier: AttackMonsterNotifier;
  public removePlayerNotifier: RemovePlayerNotifier;

  constructor(scene: WorldMapScene) {
    this.scene = scene;
    this.socket = io(import.meta.env.VITE_SERVER_URL);

    new WorldStatusHandler(this.socket, this.scene);
    new PlayerChangeMapHandler(this.socket, this.scene);
    new PlayerAttackHandler(this.socket, this.scene);
    new MonsterKilledHandler(this.socket, this.scene);

    this.movePlayerNotifier = new MovePlayerNotifier(this.socket);
    this.attackMonsterNotifier = new AttackMonsterNotifier(this.socket);
    this.removePlayerNotifier = new RemovePlayerNotifier(this.socket);
  }

  public getSocketId() {
    return this.socket.id;
  }

}