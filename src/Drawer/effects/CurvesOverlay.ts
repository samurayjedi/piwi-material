import AbstractOverlay, { DrawerController } from './AbstractOverlay';
import { cubicInOut, cubicOut } from '../Ease';

export default class CurvesOverlay extends AbstractOverlay {
  constructor(controller: DrawerController) {
    super(controller);
    this.numPoints = 2;
    this.duration = 600;
    this.delayPointsMax = 0;
    this.delayPerPath = 200;
  }

  toggle() {
    for (let i = 0; i < this.numPoints; i++) {
      this.delayPointsArray[i] = 0;
    }
    super.toggle();
  }

  updatePath(time: number) {
    const points = [];
    for (let i = 0; i < this.numPoints; i++) {
      const thisEase = (() => {
        if (this.isOpened) {
          return i === 1 ? cubicOut : cubicInOut;
        }
        return i === 1 ? cubicInOut : cubicOut;
      })();
      points[i] =
        thisEase(
          Math.min(
            Math.max(time - this.delayPointsArray[i], 0) / this.duration,
            1,
          ),
        ) * 100;
    }
    let str = '';
    str += this.isOpened ? `M 0 0 V ${points[0]} ` : `M 0 ${points[0]} `;
    for (let i = 0; i < this.numPoints - 1; i++) {
      const p = ((i + 1) / (this.numPoints - 1)) * 100;
      const cp = p - ((1 / (this.numPoints - 1)) * 100) / 2;
      str += `C ${cp} ${points[i]} ${cp} ${points[i + 1]} ${p} ${
        points[i + 1]
      } `;
    }
    str += this.isOpened ? 'V 0 H 0' : 'V 100 H 0';
    return str;
  }
}
