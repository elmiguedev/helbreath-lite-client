import { PLAYER_MIN_ATTACK_DISTANCE } from "../utils/constants";
import { Position } from "./Position";

export interface PlayerProps {
  id: string;
  name: string;
  position: Position;
  scene: Phaser.Scene;
}

export class Player extends Phaser.GameObjects.Sprite {
  public isAttacking = false;
  public target: any;

  constructor(props: PlayerProps) {
    super(props.scene, props.position.x, props.position.y, "player");
    this.scene.add.existing(this);
    this.setOrigin(0.5, 1);

    this.setDepth(10);
    this.anims.createFromAseprite("player");
    this.playIdleAnimation();
  }

  public update() {
    if (this.target) {
      this.playWalkAnimation()
      this.setFlipX(this.target.x < this.x);
    } else {
      if (this.isAttacking) { // TODO: aca hay que hacer un switch o un PATRON STATE para el estado del player 
        this.playAttackAnimation();
      } else {
        this.playIdleAnimation();
      }
    }

    this.setDepth(this.y)
  }

  public attack(target: any) { // TODO: en el REFACTOR SACAR EL ANYYY
    if (!this.isAttacking) {
      this.isAttacking = true;
      this.setFlipX(this.x > target.x);
      this.scene.time.delayedCall(300, () => {
        this.isAttacking = false;
      })
    }
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
      frameRate: 12,
    }, true)
  }

  private playAttackAnimation() {
    this.anims.play({
      key: "attack",
      frameRate: 20,
    }, true)
  }
}