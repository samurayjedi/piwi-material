import React, { useCallback, useEffect, useMemo } from 'react';
import _ from 'lodash';
import styled from '@emotion/native';
import { useSprings, animated, config } from '@react-spring/native';
import {
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  GestureResponderEvent,
} from 'react-native';
import type { DrawerProps } from '.';

export default function Items({
  open,
  effect,
  onItemSelected,
  children,
}: ItemsProps) {
  const id = useMemo(() => _.uniqueId('drawer-items-'), []);
  const [springs, api] = useSprings(
    React.Children.count(children),
    (i) => {
      switch (effect) {
        case 1:
        case 3:
        case 6:
          return {
            o: !open ? 0 : 1,
            y: !open ? (effect !== 6 ? -100 : 100) : 0,
            delay: open ? 500 + 70 * i : 70 * i,
          };
        case 2:
          return {
            o: !open ? 0 : 1,
            y: !open ? -100 : 0,
            rotate: !open ? (i % 2 === 0 ? 10 : -10) : 0,
            delay: open ? 500 + 70 * i : 70 * i,
          };
        case 4:
          return {
            o: !open ? 0 : 1,
            x: !open ? 100 : 0,
            delay: open ? 500 : 0,
            config: !open ? config.wobbly : config.default,
          };
        case 5:
          return {
            x: !open ? 100 : 0,
            rotate: !open ? (i % 2 === 0 ? 10 : -10) : 0,
            scale: !open ? 0.3 : 1,
            o: !open ? 0 : 1,
            delay: open ? 500 : 0,
          };
        default:
          return { o: !open ? 0 : 1 };
      }
    },
    [open],
  );

  useEffect(() => {
    api.start();
  }, []);

  return (
    <>
      {React.Children.map(children, (child, i) => {
        if (!React.isValidElement(child)) {
          return null;
        }
        const key = `${id}-${i}`;
        const v = springs[i] as any;

        return (
          <animated.View
            key={key}
            style={(() => {
              const base = {
                opacity: v.o.to((o: number) => o),
              };

              switch (effect) {
                case 1:
                case 3:
                case 6:
                  return {
                    ...base,
                    transform: [{ translateY: v.y.to((y: number) => y) }],
                  };
                case 2:
                  return {
                    ...base,
                    transform: [
                      { translateY: v.y.to((y: number) => y) },
                      { rotate: v.rotate.to((r: number) => `${r}deg`) },
                    ],
                  };
                case 4:
                  return {
                    ...base,
                    transform: [{ translateX: v.x.to((x: number) => x) }],
                  };
                case 5:
                  return {
                    ...base,
                    transform: [
                      { translateX: v.x.to((x: number) => x) },
                      { rotate: v.rotate.to((r: number) => `${r}deg`) },
                      { scale: v.scale.to((s: number) => s) },
                    ],
                  };
                default:
                  return base;
              }
            })()}
          >
            <Item index={i} onItemSelected={onItemSelected}>
              {child}
            </Item>
          </animated.View>
        );
      })}
    </>
  );
}

function Item({
  children,
  index,
  onPress,
  onItemSelected,
  ...props
}: ItemProps) {
  const press = useCallback(
    (e: GestureResponderEvent) => {
      if (onPress) {
        onPress(e);
      }

      if (onItemSelected) {
        onItemSelected(index);
      }
    },
    [onPress, onItemSelected],
  );

  return (
    <TouchableWithoutFeedback onPress={press} {...props}>
      {children}
    </TouchableWithoutFeedback>
  );
}

export interface ItemsProps {
  open: boolean;
  effect: DrawerProps['effect'];
  onItemSelected?: ItemProps['onItemSelected'];
  children: React.ReactNode;
}

interface ItemProps extends TouchableWithoutFeedbackProps {
  index: number;
  onItemSelected?: DrawerProps['onItemSelected'];
}
