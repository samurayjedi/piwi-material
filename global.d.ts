import '@emotion/react';
import type { PiwiTheme } from './src/styles/theme';

declare module '@emotion/react' {
  export interface Theme extends PiwiTheme {}
}

declare global {
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
    | 'transparent';
}
