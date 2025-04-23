import React from 'react';
import { ViewProps, Dimensions, View } from 'react-native';
import Constants from 'expo-constants';
import { Theme } from '@emotion/react';
import styled from '@emotion/native';

export default React.forwardRef<View, AppBarProps>(
  ({ children, ...props }, ref) => {
    return (
      <PiwiAppBar {...props} ref={ref}>
        <PiwiStatusBar />
        {children}
      </PiwiAppBar>
    );
  },
);

const PiwiAppBar = styled.View<AppBarProps>(({ theme, color = 'primary' }) => ({
  backgroundColor: getColor(theme, color),
  zIndex: 5,
  width: Dimensions.get('window').width + 10,
  marginLeft: -5,
  height: 90,
  // bottom shadow
  ...(color === 'transparent'
    ? {}
    : {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 1,
        elevation: 5,
      }),
}));

const PiwiStatusBar = styled.View({
  width: '100%',
  height: Constants.statusBarHeight,
  backgroundColor: 'rgba(52, 52, 52, .4)',
});

export interface AppBarProps extends ViewProps {
  color?: 'default' | 'primary' | 'secondary' | 'transparent';
}

export const getColor = (theme: Theme, color: AppBarProps['color']) => {
  switch (color) {
    case 'primary':
    case 'secondary':
      return theme.palette[color].main;
    case 'transparent':
      return 'rgba(52, 52, 52, 0)';
  }

  return theme.palette.common.white;
};

function hexToRgb(hex: string) {
  if (!/^#?([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    throw new Error('Invalid hexadecimal color');
  }

  hex = hex.replace('#', '');

  // when hexadecimal haver only 3 symbols, example, #fff
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('');
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b } as const;
}
