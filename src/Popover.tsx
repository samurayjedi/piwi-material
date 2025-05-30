import React, { useImperativeHandle, useRef } from 'react';
import styled from '@emotion/native';
import { LayoutRectangle, Modal, View } from 'react-native';

export default React.forwardRef<PopoverRef, PopoverProps>(
  ({ open, onClose = () => {}, anchors: { x, y }, children }, ref) => {
    const pop = useRef<View>(null);
    const rect = useRef<LayoutRectangle>({ x: 0, y: 0, width: 0, height: 0 });

    useImperativeHandle(ref, () => ({
      getRect: () => rect.current,
    }));

    return (
      <Modal transparent={true} visible={open} onRequestClose={onClose}>
        <PopoverView
          ref={pop}
          onLayout={() => {
            if (pop.current) {
              pop.current.measure((x, y, width, height, pageX, pageY) => {
                rect.current = { x: pageX, y: pageY, width, height };
              });
            }
          }}
          style={[
            {
              top: y + 10,
              left: x + rect.current.width / 2,
            },
          ]}
        >
          <PopoverText>{children}</PopoverText>
        </PopoverView>
      </Modal>
    );
  },
);

export interface PopoverProps {
  open: boolean;
  onClose?: () => void;
  anchors: { x: number; y: number };
  children: React.ReactNode;
}

export interface PopoverRef {
  getRect: () => LayoutRectangle;
}

const PopoverView = styled.View({
  position: 'absolute',
  backgroundColor: 'white',
  borderRadius: 4,
  padding: 4,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
});

const PopoverText = styled.Text({
  padding: 8,
  fontWeight: 'bold',
});
