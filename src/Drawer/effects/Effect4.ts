import AbstractOverlay, { Setter } from './AbstractOverlay';
import { sineOut, exponentialInOut } from '../Ease';

export default class Effect4 extends AbstractOverlay {
  constructor(setter: Setter) {
    super(3, setter);
    this.numPoints = 18;
    this.duration = 600;
    this.delayPointsMax = 300;
    this.delayPerPath = 100;
  }

  toggle() {
    for (var i = 0; i < this.numPoints; i++) {
      this.delayPointsArray[i] = 0;
    }

    super.toggle();
  }

  updatePath(time: number) {
    const points = [];
    for (var i = 0; i < this.numPoints; i++) {
      const thisEase = i % 2 === 1 ? sineOut : exponentialInOut;
      points[i] =
        (1 -
          thisEase(
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
