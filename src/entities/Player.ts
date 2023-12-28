import { Position } from "./Position";

export interface PlayerProps {
  id: string;
  name: string;
  position: Position;
  scene: Phaser.Scene;
}

export class Player extends Phaser.GameObjects.Sprite {

  public target: any;

  constructor(props: PlayerProps) {
    super(props.scene, props.position.x, props.position.y, "player");
    this.scene.add.existing(this);

    this.setDepth(10);
    this.anims.createFromAseprite("player");
    this.playIdleAnimation();
  }

  public update() {
    if (this.target) {
      this.playWalkAnimation()
      this.setFlipX(this.target.x < this.x);
    } else {
      this.playIdleAnimation();
    }
    this.setDepth(this.y)
  }

  private playIdleAnimation() {
    this.anims.play({
      key: "idle",
      repeat: -1,
      frameRate: 2
    }, true)
  }

  private playWalkAnimation() {
    this.anims.play({
      key: "walk",
      repeat: -1,
      frameRate: 12
    }, true)
  }
}