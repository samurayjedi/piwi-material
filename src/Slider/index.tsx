import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/native';
import { View, PanResponder, LayoutRectangle } from 'react-native';
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils';
import { getColor, hexToRgb } from '../styles';
import Marks from './Marks';
import Popover from '../Popover';

const clip = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));
export default function Slider({
  color = 'primary',
  size = 'medium',
  step = 1,
  min = 0,
  max = 100,
  marks = false,
  onChange = () => {},
  value = 0,
  ...props
}: SliderProps) {
  const valueToPercent = (v: number) => (100 * v) / (max - min);
  const parent = useRef<View>(null);
  const parentRectRef = useRef<LayoutRectangle>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const sliderRectRef = useRef<LayoutRectangle>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  // % advanced by thumb
  const [thumbPos, setThumbPos] = useState(0); // 0%-100%
  const [x, setX] = useState(0);
  // convert the percentage of the slider to a value, using linear interpolation formula.
  let vLabel = min + (max - min) * (thumbPos / 100);
  vLabel = Math.floor(vLabel);
  // props needed in panResponder
  const stepP = useRef(valueToPercent(step));
  useEffect(() => {
    stepP.current = valueToPercent(step);
  }, [min, max]);
  // popover
  const [open, setOpen] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onPanResponderGrant: () => {
        setOpen(true);
      },
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        if (parent.current) {
          const x = e.nativeEvent.pageX - parentRectRef.current.x;
          let newPos = (x / sliderRectRef.current.width) * 100;
          newPos = clip(newPos, 0, 100); // Clamp between 0-100
          newPos = Math.round(newPos);
          // advance % of the thumb by step
          let steps = 0;
          for (let i = 1; steps < newPos; i++) {
            steps = stepP.current * i;
          }
          setThumbPos(steps);
          onChange(steps);
          const xp = clip(
            x,
            sliderRectRef.current.x,
            sliderRectRef.current.x + sliderRectRef.current.width,
          );
          setX(xp);
        }
      },
      onPanResponderRelease: () => {
        setOpen(false);
      },
    }),
  ).current;

  return (
    <Container
      {...props}
      ref={parent}
      onLayout={() => {
        if (parent.current) {
          parent.current.measure((x, y, width, height, pageX, pageY) => {
            // 'Absolute position:', { pageX, pageY }
            // 'Relative to parent:', { x, y }
            // 'Dimensions:', { width, height }
            parentRectRef.current = { x: pageX, y: pageY, width, height };
          });
        }
      }}
    >
      <Popover
        open={open}
        anchors={{
          x,
          y: parentRectRef.current.y - 50,
        }}
      >
        {vLabel}
      </Popover>
      <Track
        size={size}
        onLayout={(event) => {
          sliderRectRef.current = event.nativeEvent.layout;
        }}
        {...panResponder.panHandlers}
      >
        <Filled value={thumbPos} color={color} />
        <Thumb value={thumbPos} color={color} />
        {marks && (
          <Marks
            step={step}
            stepP={stepP.current}
            thumbPos={thumbPos}
            min={min}
            max={max}
            size={size}
          />
        )}
      </Track>
    </Container>
  );
}

const Container = styled.View({});

const Track = styled.View<{ size: SliderProps['size'] }>(({ theme, size }) => ({
  height: size === 'medium' ? 5 : 3,
  width: '100%',
  backgroundColor: '#d3d3d3',
  borderRadius: 2,
  marginTop: 20,
  position: 'relative',
}));

const Filled = styled.View<Props>(({ theme, value, color }) => {
  const { r, g, b } = hexToRgb(getColor(theme, color));

  return {
    width: `${value}%`,
    height: '100%',
    backgroundColor: `rgba(${r}, ${g}, ${b}, .8)`,
    borderRadius: 2,
  };
});
const Thumb = styled.View<Props>(({ theme, value, color, size }) => ({
  width: size === 'medium' ? 20 : 15,
  height: size === 'medium' ? 20 : 15,
  backgroundColor: getColor(theme, color),
  borderRadius: 10,
  position: 'absolute',
  top: size === 'medium' ? -8 : -6,
  marginLeft: -10,
  left: `${value}%`,
}));

export interface SliderProps extends ViewProps {
  color?: Color;
  size?: 'small' | 'medium';
  step?: number;
  min?: number;
  max?: number;
  marks?: boolean;
  value?: number;
  onChange?: (v: number) => void;
}

interface Props {
  value: number;
  color: Color;
  size?: 'small' | 'medium';
}
