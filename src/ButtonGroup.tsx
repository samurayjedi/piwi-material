import React from 'react';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { getColor } from './styles';
import { ButtonProps } from './Button/types';

export default function ButtonGroup({
  children,
  style,
  orientation = 'horizontal',
  /** from Button */
  variant = 'text',
  color = 'primary',
  size = 'medium',
  ...props
}: ButtonGroupProps) {
  const theme = useTheme();

  return (
    <Container orientation={orientation}>
      {React.Children.map(children, (child, i) => {
        if (React.isValidElement(child)) {
          const newProps = {
            ...props,
            variant,
            color,
            size,
            style: (() => {
              if (i === 0) {
                if (orientation === 'horizontal') {
                  return {
                    borderRadius: 0,
                    borderTopLeftRadius: 4,
                    borderBottomLeftRadius: 4,
                    ...(variant === 'text'
                      ? {
                          borderRightWidth: 1,
                          borderColor: getColor(theme, color),
                        }
                      : {}),
                  };
                } else {
                  return {
                    borderRadius: 0,
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4,
                    ...(variant === 'text'
                      ? {
                          borderBottomWidth: 1,
                          borderColor: getColor(theme, color),
                        }
                      : {}),
                  };
                }
              } else if (i === React.Children.count(children) - 1) {
                if (orientation === 'horizontal') {
                  return {
                    borderRadius: 0,
                    borderTopRightRadius: 4,
                    borderBottomRightRadius: 4,
                    borderLeftWidth: 0,
                  };
                } else {
                  return {
                    borderRadius: 0,
                    borderBottomLeftRadius: 4,
                    borderBottomRightRadius: 4,
                    borderTopWidth: 0,
                  };
                }
              }

              return {
                borderRadius: 0,
                ...(orientation === 'horizontal'
                  ? { borderLeftWidth: 0 }
                  : { borderTopWidth: 0 }),
                ...(variant === 'text'
                  ? orientation === 'horizontal'
                    ? {
                        borderRightWidth: 1,
                        borderColor: getColor(theme, color),
                      }
                    : {
                        borderBottomWidth: 1,
                        borderColor: getColor(theme, color),
                      }
                  : {}),
              };
            })(),
          };
          return React.cloneElement(child, newProps);
        }
        return child;
      })}
    </Container>
  );
}

export interface ButtonGroupProps extends Omit<ButtonProps, 'children'> {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
}

const Container = styled.View<ButtonGroupProps>(({ orientation }) => ({
  flexDirection: orientation === 'horizontal' ? 'row' : 'column',
}));
