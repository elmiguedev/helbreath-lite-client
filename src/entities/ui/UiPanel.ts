import { Position } from "../../domain/generic/Position";
import { Size } from "../../domain/generic/Size";

export class UiPanel extends Phaser.GameObjects.Container {
  private size: Size;
  private title?: string;
  private closeButton: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, position: Position, size: Size, title?: string) {
    super(scene, position.x, position.y);
    this.scene.add.existing(this);
    this.size = size;
    this.title = title;
    this.createBackground();
    this.createTitle();
    this.createCloseButton();
  }

  public show() {
    this.setVisible(true);
  }

  public hide() {
    this.setVisible(false);
  }

  public enableCloseButton(enabled: boolean) {
    this.closeButton.setVisible(enabled);
  }

  public getSize() {
    return this.size;
  }

  protected getCenterPosition() {
    return {
      x: this.size.width / 2,
      y: this.size.height / 2
    }
  }

  private createBackground() {
    const background = this.scene.add.nineslice(
      0,
      0,
      "uiPanel",
      0,
      this.size.width,
      this.size.height,
      16,
      16,
      16,
      16
    );
    background.setOrigin(0);
    background.setInteractive();
    this.add(background);
  }

  private createTitle() {
    if (!this.title) return;

    const titleContainer = this.scene.add.image(
      this.getCenterPosition().x,
      0,
      "uiPanelTitle"
    );
    titleContainer.setOrigin(0);
    titleContainer.setInteractive();
    titleContainer.setPosition(
      this.getCenterPosition().x - titleContainer.displayWidth / 2,
      -titleContainer.displayHeight / 2
    );

    const title = this.scene.add.text(
      titleContainer.x + titleContainer.displayWidth / 2,
      titleContainer.y + titleContainer.displayHeight / 2,
      this.title,
      {
        color: "white",
        fontSize: "32px",
        align: "center",
        fontStyle: "bold",
        fontFamily: "Consolas, Courier, monospace"
      }
    ).setOrigin(0.5)

    this.add(titleContainer);
    this.add(title);
  }

  private createCloseButton() {
    this.closeButton = this.scene.add.image(
      this.size.width,
      0,
      "uiPanelTitleCloseButtonPng"
    );
    this.closeButton.setOrigin(0);
    this.closeButton.setPosition(
      this.size.width - 4 - this.closeButton.displayWidth / 2,
      -this.closeButton.displayHeight / 2 + 4
    );

    this.closeButton.setInteractive({ cursor: "pointer" });
    this.closeButton.on("pointerdown", () => {
      this.hide();
    })
    this.add(this.closeButton);
  }



}