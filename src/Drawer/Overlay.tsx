import React, {
  useState,
  useImperativeHandle,
  useMemo,
  useEffect,
} from 'react';
import styled from '@emotion/native';
import Svg, { Path } from 'react-native-svg';
import Effect1 from './effects/Effect1';
import Effect2 from './effects/Effect2';
import Effect3 from './effects/Effect3';
import Effect4 from './effects/Effect4';

const DrawerOverlay = React.forwardRef<OverlayInterface, OverlayProps>(
  ({ effect = 3, colors, onOpen = () => {}, onClose = () => {} }, ref) => {
    const [paths, setPaths] = useState<string[]>([]);

    const overlays = useMemo(() => {
      switch (effect) {
        case 1:
          return new Effect1(setPaths);
        case 2:
          return new Effect2(setPaths);
        case 3:
          return new Effect3(setPaths);
        case 4:
          return new Effect4(setPaths);
      }

      throw new Error('Invalid effect.');
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
  effect?: 1 | 2 | 3 | 4;
  colors: string[];
  onOpen?: () => void;
  onClose?: () => void;
}

export interface OverlayInterface {
  overlays: Effect1 | Effect2 | Effect3 | Effect4;
}

export default DrawerOverlay;
