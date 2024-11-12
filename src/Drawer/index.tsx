import React, { useState, useCallback, useRef, useEffect } from 'react';
import styled from '@emotion/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  ViewProps,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
} from 'react-native';
import Constants from 'expo-constants';
import IconButton from '../IconButton';
import DrawerOverlay, { OverlayInterface, OverlayProps } from './Overlay';

// ['#1d1d1f', '#413f46', '#cccccc']

function Drawer({
  open,
  items,
  effect = 3,
  colors,
  onClose,
  ...props
}: DrawerProps) {
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

  const onPressBack = useCallback(() => {
    if (overlayRef.current && !overlayRef.current.overlays.isAnimating) {
      if (onClose) {
        onClose();
      }
      overlayRef.current.overlays.toggle();
    }
  }, []);
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
            <IconButton
              onPress={onPressBack}
              style={{ alignSelf: 'flex-start' }}
            >
              <FontAwesome name="arrow-left" color="#ffffff" />
            </IconButton>
            <Glue />
            {items.map(([key, label]) => (
              <Item key={key}>{label}</Item>
            ))}
            <Glue />
          </Content>
        )}
      </Wrapper>
    </Root>
  );
}

export interface DrawerProps extends ViewProps {
  open: boolean;
  items: [string, string][];
  onClose?: () => void;
  effect?: OverlayProps['effect'];
  colors: OverlayProps['colors'];
}

export default Drawer;

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
