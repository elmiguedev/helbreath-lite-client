import { Scene } from "phaser";
import { Position } from "../../domain/generic/Position";
import { PlayerEntity } from "../player/PlayerEntity";

export class PlayerPanel {
  protected scene: Scene;
  protected position: Position;
  protected player: PlayerEntity;

  constructor(scene: Scene, position: Position, player: PlayerEntity) {
    this.scene = scene;
    this.position = position;
    this.player = player;
  }

  public show() {
  }

  public hide() {
  }

  public update() {
    if (!this.player) return;
  }

  public setPlayer(player: PlayerEntity) {
    this.player = player;
  }




}