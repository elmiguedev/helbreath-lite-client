import { Player } from "../../domain/player/Player";
import { PlayerLevelUpLabelEntity } from "./PlayerLevelUpLabelEntity";

export class PlayerEntity extends Phaser.GameObjects.Sprite {

  private playerState: Player;
  public isAttacking = false; // TODO: refactor esto (strategy/state pattern)
  private levelUpLabelEntity: PlayerLevelUpLabelEntity;
  public onLevelUpClick: Function;

  constructor(scene: Phaser.Scene, state: Player) {
    super(scene, state.position.x, state.position.y, "player");
    this.playerState = state;

    this.scene.add.existing(this);
    this.setOrigin(0.5, 1);
    this.setDepth(10);
    this.anims.createFromAseprite("player");
    this.playIdleAnimation();

    this.levelUpLabelEntity = new PlayerLevelUpLabelEntity(this);
    this.levelUpLabelEntity.onClick = () => {
      if (this.onLevelUpClick) {
        this.onLevelUpClick();
      }
    }
  }

  public setPlayerState(state: Player) {
    // set main player state
    this.playerState = state;

    // update player sprite state
    this.setPosition(this.playerState.position.x, this.playerState.position.y);
  }

  // behavior methods
  // -------------------------------

  public update() {
    this.updateAnimation();
    this.updateDepth();
    this.levelUpLabelEntity.update();
  }

  public attack() {
    if (!this.isAttacking) {
      this.isAttacking = true;
      // this.setFlipX(this.x > target.x);
      this.scene.time.delayedCall(300, () => {
        this.isAttacking = false;
      })
    }
  }

  public levelUp(state: Player) {
    this.levelUpLabelEntity.show();
  }

  public updateDepth() {
    this.setDepth(this.y)
  }

  public getPlayerState(): Player {
    return this.playerState
  }

  // animation methods (TODO: check strategy/state pattern for animations)
  // -----------------------------------------------------------------------

  public updateAnimation() {
    if (this.playerState.target) {
      this.playWalkAnimation();
      this.setFlipX(this.playerState.target.x < this.x);
    } else {
      if (this.isAttacking) { // TODO: aca hay que hacer un switch o un PATRON STATE para el estado del player 
        this.playAttackAnimation();
      } else {
        this.playIdleAnimation();
      }
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


  public testHurt() {
    this.playerState.stats.health -= 4;
  }

}