import React, { useState, useImperativeHandle, useMemo } from 'react';
import styled from '@emotion/native';
import Svg, { Path } from 'react-native-svg';
import WavesOverlay from './effects/WavesOverlay';
import CascadeOverlay from './effects/CascadeOverlay';

const DrawerOverlay = React.forwardRef<OverlayInterface, OverlayProps>(
  ({ onClose = () => {}, onOpen = () => {}, effect = 'waves' }, ref) => {
    const [d1, setD1] = useState('');
    const [d2, setD2] = useState('');
    const [d3, setD3] = useState('');

    const overlays = useMemo(() => {
      const Instance = (() => {
        switch (effect) {
          case 'cascade':
            return CascadeOverlay;
        }

        return WavesOverlay;
      })() as any;

      return new Instance({
        setD: [setD1, setD2, setD3],
        onOpen,
        onClose,
      });
    }, [effect, onOpen, onClose]);

    useImperativeHandle(ref, () => ({
      overlays,
    }));

    return (
      <Overlay viewBox="0 0 100 100" preserveAspectRatio="none">
        <Path fill="#1d1d1f" d={d1} />
        <Path fill="#413f46" d={d2} />
        <Path fill="#cccccc" d={d3} />
      </Overlay>
    );
  },
);

const Overlay = styled(Svg)({
  position: 'absolute',
  zIndex: -1,
  elevation: -1,
});

export interface OverlayProps {
  effect?: 'waves' | 'cascade';
  onOpen?: () => void;
  onClose?: () => void;
}

export interface OverlayInterface {
  overlays: WavesOverlay;
}

export default DrawerOverlay;
