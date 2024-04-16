import { Socket } from "socket.io-client";
import { SocketMessages } from "../SocketMessages";
import { WorldMapScene } from "../../scenes/WorldMapScene";
import { Player } from "../../domain/player/Player";

export class PlayerLevelUpHandler {
  constructor(
    private readonly socket: Socket,
    private readonly worldMapScene: WorldMapScene // TODO: cambiar la escena por acciones sobre la escena (check)
  ) {
    this.socket.on(SocketMessages.PLAYER_LEVEL_UP_MESSAGE, (playerData: Player) => {
      if (playerData) {
        this.worldMapScene.playerHud.showLevelUpButton();
      }
    })
  }
}