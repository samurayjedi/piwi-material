import React, { useCallback, useEffect } from 'react';
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
  items,
  effect,
  onItemSelected,
}: ItemsProps) {
  const [springs, api] = useSprings(
    items.length,
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
      {springs.map((spring, i) => {
        const v = spring as any;
        const [key, label] = items[i];

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
            <Item item={items[i]} index={i} onItemSelected={onItemSelected}>
              {label}
            </Item>
          </animated.View>
        );
      })}
    </>
  );
}

function Item({
  children,
  item,
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
        onItemSelected(item, index);
      }
    },
    [onPress, onItemSelected],
  );

  return (
    <TouchableWithoutFeedback onPress={press} {...props}>
      <MenuItem>{children}</MenuItem>
    </TouchableWithoutFeedback>
  );
}

export interface ItemsProps {
  open: boolean;
  items: DrawerProps['items'];
  effect: DrawerProps['effect'];
  onItemSelected?: ItemProps['onItemSelected'];
}

interface ItemProps extends TouchableWithoutFeedbackProps {
  item: DrawerProps['items'][number];
  index: number;
  onItemSelected?: DrawerProps['onItemSelected'];
}

const MenuItem = styled.Text(({ theme }) => ({
  ...theme.typography.h3,
  color: theme.palette.common.white,
  letterSpacing: 1,
  textTransform: 'uppercase',
  paddingBottom: theme.spacing(2),
}));
