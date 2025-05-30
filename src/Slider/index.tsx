import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/native';
import { View, PanResponder, LayoutRectangle } from 'react-native';
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils';
import { getColor, hexToRgb } from '../styles';
import Marks from './Marks';
import Popover, { PopoverRef } from '../Popover';
import { clamp, percentToValue, valueToPercent } from '../utils';

export default function Slider({
  color = 'primary',
  size = 'medium',
  step = 1,
  min = 0,
  max = 100,
  marks = false,
  onChange = () => {},
  value = 0,
  valueLabelDisplay = false,
  ...props
}: SliderProps) {
  const parent = useRef<View>(null);
  const parentRectRef = useRef<LayoutRectangle | null>(null);
  // % advanced by thumb
  const [thumbPos, setThumbPos] = useState(
    valueToPercent(value - min, min, max),
  ); // 0%-100%
  useEffect(() => {
    setThumbPos(valueToPercent(value - min, min, max));
  }, [value]);
  const [x, setX] = useState(0);
  // % by step
  const stepP = useRef(valueToPercent(step, min, max));
  useEffect(() => {
    stepP.current = valueToPercent(step, min, max);
  }, [step, min, max]);
  // popover
  const popperRef = useRef<PopoverRef | null>(null);
  const [open, setOpen] = useState(false);
  /** panResponder */
  const panResponder = useRef(
    PanResponder.create({
      onPanResponderGrant: () => {
        setOpen(true);
      },
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        if (parentRectRef.current) {
          const x = e.nativeEvent.pageX - parentRectRef.current.x;
          let newPos = (x / parentRectRef.current.width) * 100;
          newPos = clamp(newPos, 0, 100); // Clamp between 0-100
          newPos = Math.round(newPos / stepP.current) * stepP.current;
          setThumbPos(newPos);
          onChange(Math.round(percentToValue(newPos, min, max)));
          if (popperRef.current) {
            const popperWidth = popperRef.current.getRect().width;
            let xPopover = parentRectRef.current.x;
            xPopover += parentRectRef.current.width * (newPos / 100);
            xPopover = xPopover - popperWidth;
            setX(xPopover);
          }
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
      {valueLabelDisplay && (
        <Popover
          ref={popperRef}
          open={open}
          anchors={{
            x,
            y: parentRectRef.current?.y ?? 0,
          }}
        >
          {/* convert the percentage of the slider to a value, using linear interpolation formula. */}
          {Math.round(percentToValue(thumbPos, min, max))}
        </Popover>
      )}
      <Track size={size} {...panResponder.panHandlers}>
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
  valueLabelDisplay?: boolean;
  onChange?: (v: number) => void;
}

interface Props {
  value: number;
  color: Color;
  size?: 'small' | 'medium';
}
