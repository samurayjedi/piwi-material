import { ButtonProps } from './types';

export const SIZE = (size: ButtonProps['size']) => {
  switch (size) {
    case 'small':
      return 18;
    case 'large':
      return 25;
  }

  return 20;
};
