import { Position } from "./Position";

export interface PlayerProps {
  id: string;
  name: string;
  position: Position;
  scene: Phaser.Scene;
}

export class Player {
  private scene: Phaser.Scene;
  public body: Phaser.GameObjects.Rectangle;
  private id: string;
  private name: string;
  private position: Position;

  constructor(props: PlayerProps) {
    this.scene = props.scene;
    this.id = props.id;
    this.name = props.name;
    this.position = props.position;

    this.createBody();
  }

  public destroy() {
    this.body.destroy();
  }

  public setPosition(position: Position) {
    this.position = position;
    this.body.setPosition(position.x, position.y);
  }

  private createBody() {
    this.body = this.scene.add.rectangle(
      this.position.x,
      this.position.y,
      32,
      32,
      0xff0000
    );
    this.body.setDepth(2);
  }
}