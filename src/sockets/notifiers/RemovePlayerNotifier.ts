import { Socket } from "socket.io-client";
import { Position } from "../../domain/generic/Position";
import { SocketMessages } from "../SocketMessages";

export class RemovePlayerNotifier {
  constructor(private readonly socket: Socket) { }

  public notify() {
    this.socket.emit(SocketMessages.REMOVE_PLAYER_MESSAGE, this.socket.id);
  }
}