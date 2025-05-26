import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useImperativeHandle,
} from 'react';
import styled from '@emotion/native';
import { ViewProps } from 'react-native';
import Constants from 'expo-constants';
import DrawerOverlay, { OverlayInterface, OverlayProps } from './Overlay';
import Items from './Items';

export default React.forwardRef<Ref, DrawerProps>(
  ({ open, effect = 3, colors, onItemSelected, children, ...props }, ref) => {
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
            <Items open={open} effect={effect} onItemSelected={onItemSelected}>
              {children}
            </Items>
            <Glue />
          </Content>
        </Wrapper>
      </Root>
    );
  },
);

export interface DrawerProps extends ViewProps {
  open: boolean;
  onClose?: () => void;
  effect?: OverlayProps['effect'];
  colors: OverlayProps['colors'];
  onItemSelected?: (i: number) => void;
  children: React.ReactNode;
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
  alignItems: 'stretch',
  justifyContent: 'center',
  paddingTop: Constants.statusBarHeight,
});

const Glue = styled.View({
  flex: 1,
});

export interface Ref {
  ref: React.RefObject<OverlayInterface>;
}
