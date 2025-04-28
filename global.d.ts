import '@emotion/react';
import type { PiwiTheme } from './src/styles/theme';

declare module '@emotion/react' {
  export interface Theme extends PiwiTheme {}
}

declare global {
  type HexColor = `#${string}`;
  type RGBAColor = `rgba(${number}, ${number}, ${number}, ${number})`;
  type RGBColor = `rgb(${number}, ${number}, ${number})`;
  type Color =
    | 'default'
    | 'primary'
    | 'primary.dark'
    | 'primary.light'
    | 'secondary'
    | 'secondary.dark'
    | 'secondary.light'
    | 'error'
    | 'error.dark'
    | 'error.light'
    | 'info'
    | 'info.dark'
    | 'info.light'
    | 'success'
    | 'success.dark'
    | 'success.light'
    | 'warning'
    | 'warning.dark'
    | 'warning.light'
    | 'transparent'
    | HexColor
    | RGBAColor
    | RGBColor;
}
