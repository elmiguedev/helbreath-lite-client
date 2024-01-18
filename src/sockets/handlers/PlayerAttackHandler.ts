import { Socket } from "socket.io-client";
import { SocketMessages } from "../SocketMessages";
import { WorldMapScene } from "../../scenes/WorldMapScene";

export class PlayerAttackHandler {
  constructor(
    private readonly socket: Socket,
    private readonly worldMapScene: WorldMapScene // TODO: cambiar la escena por acciones sobre la escena (check)
  ) {
    socket.on(SocketMessages.PLAYER_ATTACK_MESSAGE, (playerId: string) => {
      console.log("VIENE EL ATTACK", playerId)
      const player = this.worldMapScene.getPlayer(playerId);
      if (player) {
        player.attack();
      }
    })
  }
}