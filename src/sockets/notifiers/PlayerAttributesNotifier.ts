import { Socket } from "socket.io-client";
import { Position } from "../../domain/generic/Position";
import { SocketMessages } from "../SocketMessages";
import { PlayerAttributes } from "../../domain/player/PlayerAttributes";

export class PlayerAttributesNotifier {
  constructor(private readonly socket: Socket) { }

  public notify(attributes: PlayerAttributes) {
    this.socket.emit(SocketMessages.PLAYER_ATTRIBUTES_MESSAGE, attributes);
  }
}