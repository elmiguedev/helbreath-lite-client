import { Monster } from "../../domain/monster/Monster";

export class MonsterEntity extends Phaser.GameObjects.Sprite {

  private monsterState: Monster;

  // pointer properties (TODO: check if refactor necessary)
  public onPointerOver: () => void;
  public onPointerOut: () => void;
  public onPointerDown: () => void;

  constructor(scene: Phaser.Scene, state: Monster) {
    super(scene, state.position.x, state.position.y, state.type); // todo: hacer el strategy
    this.monsterState = state;
    this.scene.add.existing(this);

    this.setDepth(this.monsterState.position.y);
    this.setOrigin(0.5, 1);
    this.setInteractive({ cursor: 'pointer' });

    this.on("pointerover", () => {
      this.onPointerOver && this.onPointerOver();
    })
    this.on("pointerout", () => {
      this.onPointerOut && this.onPointerOut();
    })
    this.on("pointerdown", () => {
      this.onPointerDown && this.onPointerDown();
    })

  }

  public setMonsterState(state: Monster) {
    this.monsterState = state;
    this.setPosition(
      this.monsterState.position.x,
      this.monsterState.position.y
    )
  }
}