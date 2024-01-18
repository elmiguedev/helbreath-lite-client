import { Socket } from "socket.io-client";
import { SocketMessages } from "../SocketMessages";
import { WorldMapScene } from "../../scenes/WorldMapScene";
import { WorldStatus } from "../../domain/world/WorldStatus";
import { WorldMapChange } from "../../domain/world/WorldMapChange";

export class PlayerChangeMapHandler {
  constructor(
    private readonly socket: Socket,
    private readonly worldMapScene: WorldMapScene // TODO: cambiar la escena por acciones sobre la escena (check)
  ) {
    socket.on(SocketMessages.PLAYER_CHANGE_MAP_MESSAGE, (worldMapChange: WorldMapChange) => {
      this.worldMapScene.getWorldMapEntity().changeMap(worldMapChange.toWorldMapId);
      this.worldMapScene.clearPlayers();
    })
  }
}