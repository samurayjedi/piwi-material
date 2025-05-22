import { ViewProps } from 'react-native';

export interface ButtonProps extends ViewProps {
  children: string;
  color?: Color;
  variant?: Variants;
  startIcon?: JSX.Element;
  endIcon?: JSX.Element;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export type Variants = 'contained' | 'outlined' | 'text';

export interface AdornmentProps {
  adornment: React.ReactNode;
  disabled: boolean;
  color: NonNullable<ButtonProps['color']>;
  variant: Variants;
  position: 'start' | 'end';
  size: ButtonProps['size'];
}
