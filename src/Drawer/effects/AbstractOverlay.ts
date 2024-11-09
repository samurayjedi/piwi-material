export default abstract class AbstractOverlay {
  controller!: DrawerController;

  numPoints!: number;

  duration!: number;

  delayPointsArray!: Array<number>;

  delayPointsMax!: number;

  delayPerPath!: number;

  timeStart!: number;

  isAnimating!: boolean;

  isOpened!: boolean;

  constructor(controller: DrawerController) {
    this.controller = controller;
    this.delayPointsArray = [];
    this.timeStart = Date.now();
    this.isAnimating = false;
    this.isOpened = false;
  }

  toggle() {
    this.isAnimating = true;
    this.timeStart = Date.now();
    if (!this.isOpened) {
      this.isOpened = true;
      this.controller.onOpen();
    } else {
      this.isOpened = false;
    }
    this.renderLoop();
  }

  updatePath(time: number) {
    return '';
  }

  render() {
    if (this.isOpened) {
      for (let i = 0; i < this.controller.setD.length; i++) {
        this.controller.setD[i](
          this.updatePath(
            Date.now() - (this.timeStart + this.delayPerPath * i),
          ),
        );
      }
    } else {
      for (let i = 0; i < this.controller.setD.length; i++) {
        this.controller.setD[i](
          this.updatePath(
            Date.now() -
              (this.timeStart +
                this.delayPerPath * (this.controller.setD.length - i - 1)),
          ),
        );
      }
    }
  }

  renderLoop() {
    this.render();
    if (
      Date.now() - this.timeStart <
      this.duration +
        this.delayPerPath * (this.controller.setD.length - 1) +
        this.delayPointsMax
    ) {
      requestAnimationFrame(() => {
        this.renderLoop();
      });
    } else {
      this.isAnimating = false;
      if (!this.isOpened) {
        this.controller.onClose();
      }
    }
  }
}

export interface DrawerController {
  setD: React.Dispatch<React.SetStateAction<string>>[];
  onOpen: () => void;
  onClose: () => void;
}
