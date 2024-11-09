import React, {
  useState,
  useImperativeHandle,
  useMemo,
  useEffect,
} from 'react';
import styled from '@emotion/native';
import Svg, { Path } from 'react-native-svg';
import WavesOverlay from './effects/WavesOverlay';
import CascadeOverlay from './effects/CascadeOverlay';
import FourWavesOverlay from './effects/FourWavesOverlay';

const DrawerOverlay = React.forwardRef<OverlayInterface, OverlayProps>(
  (
    { effect = 'waves', colors, onOpen = () => {}, onClose = () => {} },
    ref,
  ) => {
    const [paths, setPaths] = useState<string[]>([]);

    const overlays = useMemo(() => {
      switch (effect) {
        case 'cascade':
          return new CascadeOverlay(setPaths);
        case 'four-waves':
          return new FourWavesOverlay(setPaths);
      }

      return new WavesOverlay(setPaths);
    }, [effect]);

    useEffect(() => {
      overlays.setOnOpen(onOpen);
      overlays.setOnClose(onClose);
    }, [onOpen, onClose]);

    useImperativeHandle(ref, () => ({
      overlays,
    }));

    return (
      <Overlay viewBox="0 0 100 100" preserveAspectRatio="none">
        {paths.map((path, index) => {
          const color = colors[index] ?? '#000';

          return <Path key={`path-${color}`} fill={color} d={path} />;
        })}
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
  effect?: 'waves' | 'cascade' | 'four-waves';
  colors: string[];
  onOpen?: () => void;
  onClose?: () => void;
}

export interface OverlayInterface {
  overlays: WavesOverlay;
}

export default DrawerOverlay;
