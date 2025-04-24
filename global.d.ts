import '@emotion/react';
import type { PiwiTheme } from './src/styles/theme';

declare module '@emotion/react' {
  export interface Theme extends PiwiTheme {}
}
