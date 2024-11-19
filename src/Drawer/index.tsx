import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useImperativeHandle,
} from 'react';
import styled from '@emotion/native';
import { useSprings, animated } from '@react-spring/native';
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
          {open && (
            <Content>
              <Glue />
              <Items open={open} items={items} />
              <Glue />
            </Content>
          )}
        </Wrapper>
      </Root>
    );
  },
);

function Items({
  open,
  items,
}: {
  open: boolean;
  items: DrawerProps['items'];
}) {
  const springs = useSprings(
    items.length,
    items.map((v, i) =>
      i % 2 === 0
        ? {
            x: !open ? 100 : 0,
            rotate: !open ? 10 : 0,
            scale: !open ? 0.5 : 0,
            o: !open ? 0 : 1,
          }
        : {
            x: !open ? 100 : 0,
            rotate: !open ? -10 : 0,
            scale: !open ? 0.5 : 0,
            o: !open ? 0 : 1,
          },
    ),
  );

  return (
    <>
      {springs.map((v, i) => {
        const [key, label] = items[i];

        return (
          <animated.View
            style={{
              opacity: v.o.to((o) => o),
              transform: [
                { translateX: v.x.to((x) => x) },
                { rotate: v.rotate.to((r) => `${r}deg`) },
                { scale: v.scale.to((s) => s) },
              ],
            }}
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
