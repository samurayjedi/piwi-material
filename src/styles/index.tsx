import _ from 'lodash';
import { Theme } from '@emotion/react';
import PIWI_THEME from './theme';

const theme = PIWI_THEME;
export default theme;

export function hexToRgb(hex: string) {
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

export const getColor = (theme: Theme, color: Color) => {
  switch (color) {
    case 'transparent':
      return 'rgba(52, 52, 52, 0)';
    case 'primary':
    case 'secondary':
    case 'error':
    case 'info':
    case 'success':
    case 'warning':
      return theme.palette[color].main;
    case 'default':
    case undefined:
      return theme.palette.background.default;
  }

  return _.get(theme.palette, color);
};
