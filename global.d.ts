import type { PiwiTheme } from './material/styles/theme';

declare module '@emotion/react' {
  export interface Theme extends PiwiTheme {}
}
