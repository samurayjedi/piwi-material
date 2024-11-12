import AbstractOverlay, { Setter } from './AbstractOverlay';
import { cubicInOut } from '../Ease';

export default class Effect6 extends AbstractOverlay {
  constructor(setter: Setter) {
    super(3, setter);
    this.numPoints = 10;
    this.duration = 900;
    this.delayPointsMax = 300;
    this.delayPerPath = 250;
  }

  toggle() {
    for (var i = 0; i < this.numPoints; i++) {
      this.delayPointsArray[i] = Math.random() * this.delayPointsMax;
    }

    super.toggle();
  }

  updatePath(time: number) {
    const points = [];
    for (var i = 0; i < this.numPoints; i++) {
      points[i] =
        (1 -
          cubicInOut(
            Math.min(
              Math.max(time - this.delayPointsArray[i], 0) / this.duration,
              1,
            ),
          )) *
        100;
    }

    let str = '';
    str += this.isOpened ? `M 0 0 V ${points[0]}` : `M 0 ${points[0]}`;
    for (var i = 0; i < this.numPoints - 1; i++) {
      const p = ((i + 1) / (this.numPoints - 1)) * 100;
      const cp = p - ((1 / (this.numPoints - 1)) * 100) / 2;
      str += `C ${cp} ${points[i]} ${cp} ${points[i + 1]} ${p} ${points[i + 1]} `;
    }
    str += this.isOpened ? `V 100 H 0` : `V 0 H 0`;
    return str;
  }
}
