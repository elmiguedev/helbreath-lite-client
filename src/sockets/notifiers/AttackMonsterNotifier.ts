import { Socket } from "socket.io-client";
import { Position } from "../../domain/generic/Position";
import { SocketMessages } from "../SocketMessages";

export class AttackMonsterNotifier {
  constructor(private readonly socket: Socket) { }

  public notify(monsterId: string) {
    this.socket.emit(SocketMessages.PLAYER_ATTACK_MONSTER_MESSAGE, monsterId);
  }
}