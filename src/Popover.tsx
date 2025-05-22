import styled from '@emotion/native';
import React, { useRef } from 'react';
import { LayoutRectangle, Modal } from 'react-native';

export default function Popover({
  open,
  onClose = () => {},
  anchors,
  children,
}: PopoverProps) {
  const { x, y } = anchors;
  const rect = useRef<LayoutRectangle>({ x: 0, y: 0, width: 0, height: 0 });

  return (
    <Modal transparent={true} visible={open} onRequestClose={onClose}>
      <PopoverView
        onLayout={(e) => (rect.current = e.nativeEvent.layout)}
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
}

export interface PopoverProps {
  open: boolean;
  onClose?: () => void;
  anchors: { x: number; y: number };
  children: React.ReactNode;
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
