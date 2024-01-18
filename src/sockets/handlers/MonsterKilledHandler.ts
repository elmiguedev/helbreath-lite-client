import { Socket } from "socket.io-client";
import { SocketMessages } from "../SocketMessages";
import { WorldMapScene } from "../../scenes/WorldMapScene";
import { Monster } from "../../domain/monster/Monster";

export class MonsterKilledHandler {
  constructor(
    private readonly socket: Socket,
    private readonly worldMapScene: WorldMapScene // TODO: cambiar la escena por acciones sobre la escena (check)
  ) {
    socket.on(SocketMessages.MONSTER_KILLED_MESSAGE, (monster: Monster) => {
      this.worldMapScene.killMonster(monster.id);
    });
  }
}