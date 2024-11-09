export default abstract class AbstractOverlay {
  numPoints!: number;

  duration!: number;

  delayPointsArray: Array<number>;

  delayPointsMax!: number;

  delayPerPath!: number;

  timeStart: number;

  isAnimating: boolean;

  isOpened: boolean;

  pathsCount: number;

  setter: Setter;

  onOpen: (() => void) | undefined;

  onClose: (() => void) | undefined;

  constructor(pathsCount: number, setter: Setter) {
    this.delayPointsArray = [];
    this.timeStart = Date.now();
    this.isAnimating = false;
    this.isOpened = false;
    this.pathsCount = pathsCount;
    this.setter = setter;
  }

  setOnOpen(onOpen: () => void) {
    this.onOpen = onOpen;
  }

  setOnClose(onClose: () => void) {
    this.onClose = onClose;
  }

  toggle() {
    this.isAnimating = true;
    this.timeStart = Date.now();
    if (!this.isOpened) {
      this.isOpened = true;
      if (this.onOpen) {
        this.onOpen();
      }
    } else {
      this.isOpened = false;
    }
    this.renderLoop();
  }

  updatePath(time: number) {
    return '';
  }

  render() {
    const newPatchs = [...new Array(this.pathsCount)];

    if (this.isOpened) {
      for (let i = 0; i < this.pathsCount; i++) {
        newPatchs[i](
          this.updatePath(
            Date.now() - (this.timeStart + this.delayPerPath * i),
          ),
        );
      }
    } else {
      for (let i = 0; i < this.pathsCount; i++) {
        newPatchs[i](
          this.updatePath(
            Date.now() -
              (this.timeStart + this.delayPerPath * (this.pathsCount - i - 1)),
          ),
        );
      }
    }

    this.setter(newPatchs);
  }

  renderLoop() {
    this.render();
    if (
      Date.now() - this.timeStart <
      this.duration +
        this.delayPerPath * (this.pathsCount - 1) +
        this.delayPointsMax
    ) {
      requestAnimationFrame(() => {
        this.renderLoop();
      });
    } else {
      this.isAnimating = false;
      if (!this.isOpened) {
        if (this.onClose) {
          this.onClose();
        }
      }
    }
  }
}

export type Setter = React.Dispatch<React.SetStateAction<string[]>>;
