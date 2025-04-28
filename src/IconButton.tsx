import React, { useContext } from 'react';
import _ from 'lodash';
import { useTheme } from '@emotion/react';
import styled from '@emotion/native';
import { TouchableWithoutFeedbackProps, View } from 'react-native';
import Ripple from './depend/Ripple';
import { INPUT_BASE_CONTEXT } from './InputBase';

const IconButton = React.forwardRef<View, IconButtonProps>(
  ({ children, size = 'medium', color = 'primary', style, ...props }, ref) => {
    const theme = useTheme();
    const ctxInput = useContext(INPUT_BASE_CONTEXT);

    return (
      <PiwiIconButton ref={ref} style={style} size={size}>
        <Ripple {...props}>
          <PiwiIconContainer>
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                let piwi = { size, color };
                if (ctxInput.in && ctxInput.adornment) {
                  // remember remove the any type here in the future, changing the types color: string to color: Color in InputAdornment by example
                  if (ctxInput.adornment.size) piwi = ctxInput.adornment as any;
                }
                return React.cloneElement(child, {
                  size: theme.iconButton[piwi.size],
                  color: (() => {
                    if (!Object.hasOwnProperty.call(child.props, 'color')) {
                      switch (piwi.color) {
                        case 'primary':
                        case 'secondary':
                        case 'success':
                        case 'warning':
                        case 'info':
                        case 'error':
                          return theme.palette[piwi.color].main;
                        case 'error.dark':
                        case 'error.light':
                        case 'info.dark':
                        case 'info.light':
                        case 'primary.dark':
                        case 'primary.light':
                        case 'secondary.dark':
                        case 'secondary.light':
                        case 'success.dark':
                        case 'success.light':
                        case 'warning.dark':
                        case 'warning.light':
                          return _.get(theme.palette, piwi.color);
                        case 'default':
                          return theme.palette.background.default;
                        default:
                          return color;
                      }
                    }
                    return _.get(child.props, 'color');
                  })(),
                } as any);
              }
              return child;
            })}
          </PiwiIconContainer>
        </Ripple>
      </PiwiIconButton>
    );
  },
);

export default IconButton;

export interface IconButtonProps extends TouchableWithoutFeedbackProps {
  children: React.ReactNode;
  color?: Exclude<Color, 'transparent'>;
  size?: 'small' | 'medium' | 'large';
}

const PiwiIconButton = styled.View<{ size: IconButtonProps['size'] }>(
  ({ size }) => ({
    overflow: 'hidden',
    borderRadius: 50,
    ...(() => {
      switch (size) {
        default:
          return {
            width: 43,
            height: 40,
          };
        case 'large':
          return {
            width: 45,
            height: 46,
          };
        case 'small':
          return {
            width: 35,
            height: 33,
          };
      }
    })(),
  }),
);

const PiwiIconContainer = styled.View({
  padding: 7,
  paddingLeft: 9.5,
  paddingRight: 9.5,
});
