import React, { useMemo } from 'react';
import styled from '@emotion/native';
import _ from 'lodash';
import type { SliderProps } from '.';
import { hexToRgb } from '../styles';

export default function Marks({
  stepP,
  thumbPos,
  min,
  max,
  step,
  size,
}: MarksProps) {
  const id = useMemo(() => _.uniqueId('slider-'), []);
  const stepsFilled = Math.floor(thumbPos / stepP);
  const stepsCount = (max - min) / step;

  return (
    <>
      {Array.from({ length: stepsCount + 1 }).map((v, i) => {
        const s = stepP * i;
        const key = `${id}-mark-${s}`;
        if (i !== stepsFilled) {
          return (
            <Mark key={key} filled={i < stepsFilled} size={size} pos={s} />
          );
        }

        return null;
      })}
    </>
  );
}

export interface MarksProps {
  stepP: number;
  thumbPos: number;
  min: number;
  max: number;
  step: number;
  size: SliderProps['size'];
}

interface MarkProps {
  filled: boolean;
  size: SliderProps['size'];
  pos: number;
}

const Mark = styled.View<MarkProps>(({ theme, filled, size, pos }) => ({
  width: 3,
  height: 3,
  backgroundColor: (() => {
    const hex = filled
      ? theme.palette.common.white
      : theme.palette.common.black;
    const { r, g, b } = hexToRgb(hex);

    return `rgba(${r}, ${g}, ${b}, .8)`;
  })(),
  borderRadius: 10,
  position: 'absolute',
  top: size === 'medium' ? 0.8 : -0.3,
  marginLeft: -10,
  left: size === 'medium' ? `${pos + 2}%` : `${pos + 2.3}%`,
}));
