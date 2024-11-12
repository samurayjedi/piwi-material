import AbstractOverlay, { Setter } from './AbstractOverlay';
import { cubicInOut } from '../Ease';

export default class Effect5 extends AbstractOverlay {
  constructor(setter: Setter) {
    super(2, setter);
    this.numPoints = 85;
    this.duration = 500;
    this.delayPointsMax = 300;
    this.delayPerPath = 150;
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
    str += this.isOpened ? `M 0 0 H ${points[0]}` : `M ${points[0]} 0`;
    for (var i = 0; i < this.numPoints - 1; i++) {
      const p = ((i + 1) / (this.numPoints - 1)) * 100;
      const cp = p - ((1 / (this.numPoints - 1)) * 100) / 2;
      str += `C ${points[i]} ${cp} ${points[i + 1]} ${cp} ${points[i + 1]} ${p} `;
    }
    str += this.isOpened ? `H 100 V 0` : `H 0 V 0`;
    return str;
  }
}
