export const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

export const valueToPercent = (v: number, min: number, max: number) =>
  (100 * v) / (max - min);

// linear interpolation formula.
export const percentToValue = (v: number, min: number, max: number) =>
  min + (max - min) * (v / 100);
