import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useImperativeHandle,
} from 'react';
import styled from '@emotion/native';
import { useSprings, animated, config } from '@react-spring/native';
import {
  ViewProps,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
} from 'react-native';
import Constants from 'expo-constants';
import DrawerOverlay, { OverlayInterface, OverlayProps } from './Overlay';

export default React.forwardRef<Ref, DrawerProps>(
  ({ open, items, effect = 3, colors, ...props }, ref) => {
    const overlayRef = useRef<OverlayInterface>(null);
    const [display, setDisplay] = useState(false);

    useEffect(() => {
      if (overlayRef.current && !overlayRef.current.overlays.isAnimating) {
        if (open) {
          if (!overlayRef.current.overlays.isOpened) {
            overlayRef.current.overlays.toggle();
          }
        } else {
          if (overlayRef.current.overlays.isOpened) {
            overlayRef.current.overlays.toggle();
          }
        }
      }
    }, [open]);

    useImperativeHandle(ref, () => ({
      ref: overlayRef,
    }));

    const onOpenOverlay = useCallback(() => setDisplay(true), []);
    const onCloseOverlay = useCallback(() => setDisplay(false), []);

    return (
      <Root display={display} {...props}>
        <Wrapper>
          <DrawerOverlay
            ref={overlayRef}
            effect={effect}
            colors={colors}
            onOpen={onOpenOverlay}
            onClose={onCloseOverlay}
          />
          <Content>
            <Glue />
            <Items open={open} items={items} effect={effect} />
            <Glue />
          </Content>
        </Wrapper>
      </Root>
    );
  },
);

function Items({
  open,
  items,
  effect,
}: {
  open: boolean;
  items: DrawerProps['items'];
  effect: DrawerProps['effect'];
}) {
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
            <Item>{label}</Item>
          </animated.View>
        );
      })}
    </>
  );
}

export interface DrawerProps extends ViewProps {
  open: boolean;
  items: [string, string][];
  onClose?: () => void;
  effect?: OverlayProps['effect'];
  colors: OverlayProps['colors'];
}

function Item({ children, ...props }: TouchableWithoutFeedbackProps) {
  return (
    <TouchableWithoutFeedback {...props}>
      <MenuItem>{children}</MenuItem>
    </TouchableWithoutFeedback>
  );
}

const Root = styled.View<{ display: boolean }>(({ display }) => ({
  display: display ? 'flex' : 'none',
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  zIndex: 997,
  elevation: 997,
}));

const Wrapper = styled.View({
  position: 'relative',
  height: '100%',
});

const Content = styled.View({
  width: '100%',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: Constants.statusBarHeight,
});

const MenuItem = styled.Text(({ theme }) => ({
  ...theme.typography.h3,
  color: theme.palette.common.white,
  letterSpacing: 1,
  textTransform: 'uppercase',
  paddingBottom: theme.spacing(2),
}));

const Glue = styled.View({
  flex: 1,
});

export interface Ref {
  ref: React.RefObject<OverlayInterface>;
}
