import { Socket } from "socket.io-client";
import { SocketMessages } from "../SocketMessages";
import { WorldMapScene } from "../../scenes/WorldMapScene";
import { WorldStatus } from "../../domain/world/WorldStatus";

export class WorldStatusHandler {
  constructor(
    private readonly socket: Socket,
    private readonly worldMapScene: WorldMapScene // TODO: cambiar la escena por acciones sobre la escena (check)
  ) {
    socket.on(SocketMessages.WORLD_STATUS_MESSAGE, (worldStatus: WorldStatus) => {
      this.worldMapScene.setWorldStatus(worldStatus);

      const worldMapEntity = this.worldMapScene.getWorldMapEntity();
      if (worldMapEntity.isEmpty()) {
        worldMapEntity.createMap(worldStatus.world.id);
        this.worldMapScene.clearPlayers();
      }

      this.worldMapScene.updatePlayerStates();
      this.worldMapScene.updateMonsterStates();
      // TODO: update other entities like monsters, npc and stuff
    })
  }
}