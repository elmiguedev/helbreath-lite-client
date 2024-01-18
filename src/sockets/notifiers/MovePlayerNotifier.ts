import { Socket } from "socket.io-client";
import { Position } from "../../domain/generic/Position";
import { SocketMessages } from "../SocketMessages";

export class MovePlayerNotifier {
  constructor(private readonly socket: Socket) { }

  public notify(position: Position) {
    this.socket.emit(SocketMessages.MOVE_PLAYER_MESSAGE, position);
  }
}