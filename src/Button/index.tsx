import React from 'react';
import _ from 'lodash';
import styled from '@emotion/native';
import Ripple from '../depend/Ripple';
import { getColor } from '../styles';
import { AdornmentProps, ButtonProps, Variants } from './types';
import Adornment from './Adornment';
import { SIZE } from './consts';

export default function Button({
  children,
  color = 'primary',
  variant = 'text',
  startIcon,
  endIcon,
  disabled = false,
  size = 'medium',
  ...props
}: ButtonProps) {
  const haveStartIcon = typeof startIcon !== 'undefined';
  const haveEndIcon = typeof endIcon !== 'undefined';

  return (
    <ButtonRoot {...props} variant={variant} color={color} size={size}>
      {startIcon && (
        <Adornment
          disabled={disabled}
          variant={variant}
          color={color}
          adornment={startIcon}
          size={size}
          position="start"
        />
      )}
      <Ripple disabled={disabled}>
        <PiwiButton
          haveStartIcon={haveStartIcon}
          haveEndIcon={haveEndIcon}
          variant={variant}
          color={color}
          size={size}
        >
          {children}
        </PiwiButton>
      </Ripple>
      {endIcon && (
        <Adornment
          disabled={disabled}
          variant={variant}
          color={color}
          adornment={endIcon}
          size={size}
          position="end"
        />
      )}
    </ButtonRoot>
  );
}

const ButtonRoot = styled.View<{
  variant: Variants;
  color: NonNullable<ButtonProps['color']>;
  size: NonNullable<ButtonProps['size']>;
}>(({ theme, variant, color, size }) => ({
  position: 'relative',
  // overflow: 'hidden',
  alignItems: 'center',
  flexDirection: 'row',
  borderRadius: 4,
  ...(() => {
    switch (variant) {
      case 'contained':
        return { backgroundColor: getColor(theme, color) };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderColor: getColor(theme, color),
          borderWidth: 1,
        };
      default:
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
    }
  })(),
  zIndex: 0,
  elevation: 0,
  ...(() => {
    switch (size) {
      case 'small':
        return {
          padding: 6,
          paddingRight: theme.spacing(1),
          paddingLeft: theme.spacing(1),
        };
      case 'large':
        return {
          padding: 14,
          paddingRight: theme.spacing(2),
          paddingLeft: theme.spacing(2),
        };
      default:
        return {
          padding: 10,
          paddingRight: theme.spacing(2),
          paddingLeft: theme.spacing(2),
        };
    }
  })(),
}));

const PiwiButton = styled.Text<PiwiButtonProps>(
  ({ theme, variant, size, color, haveStartIcon, haveEndIcon }) => {
    const factor = (() => {
      switch (size) {
        case 'small':
          return 1.2;
        case 'large':
          return 1.4;
      }

      return 2;
    })();

    return {
      ...theme.typography.button,
      color:
        variant === 'contained'
          ? theme.palette.common.white
          : getColor(theme, color),
      paddingLeft: haveStartIcon ? SIZE(size) / factor : 0,
      paddingRight: haveEndIcon ? SIZE(size) / factor : 0,
    };
  },
);

interface PiwiButtonProps
  extends Omit<AdornmentProps, 'disabled' | 'adornment' | 'position'> {
  haveStartIcon: boolean;
  haveEndIcon: boolean;
}
