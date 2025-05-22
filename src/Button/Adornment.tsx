import React from 'react';
import { useTheme } from '@emotion/react';
import styled from '@emotion/native';
import { AdornmentProps } from './types';
import { getColor } from '../styles';
import { SIZE } from './consts';

export default function Adornment(props: AdornmentProps) {
  const { adornment, disabled, color, variant } = props;
  const theme = useTheme();

  return (
    <StyledAdornment {...props}>
      {React.Children.map(adornment, (child) => {
        if (React.isValidElement(child)) {
          const props = {
            size: 20,
            color: disabled
              ? theme.palette.text.disabled
              : variant === 'text'
                ? getColor(theme, color)
                : theme.palette.common.white,
            ...child.props,
          };
          return React.cloneElement(child, props);
        }
        return child;
      })}
    </StyledAdornment>
  );
}

const StyledAdornment = styled.View<AdornmentProps>(({ position, size }) => ({
  position: 'absolute',
  width: SIZE(size),
  height: SIZE(size),
  overflow: 'hidden',
  marginLeft: position === 'start' ? 3 : 0,
  ...(position === 'end' ? { right: 0, marginRight: 3 } : {}),
}));
