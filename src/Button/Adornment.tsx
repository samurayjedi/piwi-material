import React from 'react';
import { useTheme } from '@emotion/react';
import styled from '@emotion/native';
import { AdornmentProps } from './types';
import { getColor } from '../styles';
import { SIZE } from './consts';

export default function Adornment(props: AdornmentProps) {
  const { adornment, disabled, color, variant, size } = props;
  const theme = useTheme();

  return (
    <StyledAdornment {...props}>
      {React.Children.map(adornment, (child) => {
        if (React.isValidElement(child)) {
          const props = {
            color: disabled
              ? theme.palette.text.disabled
              : variant === 'text'
                ? theme.palette.common.white
                : getColor(theme, color),
            ...child.props,
            size: SIZE(size),
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
  width: SIZE(size) + 2,
  height: SIZE(size),
  overflow: 'hidden',
  marginLeft: position === 'start' ? SIZE(size) / 2 : 0,
  ...(position === 'end' ? { right: 0, marginRight: SIZE(size) / 2 } : {}),
}));
