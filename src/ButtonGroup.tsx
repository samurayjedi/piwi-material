import React from 'react';
import styled from '@emotion/native';
import type { ButtonProps } from './Button';

export default function ButtonGroup({
  children,
  style,
  orientation = 'horizontal',
  ...props
}: ButtonGroupProps) {
  return (
    <Container orientation={orientation}>
      {React.Children.map(children, (child, i) => {
        if (React.isValidElement(child)) {
          const newProps = {
            ...props,
            style: (() => {
              if (i === 0) {
                if (orientation === 'horizontal') {
                  return {
                    borderRadius: 0,
                    borderTopLeftRadius: 4,
                    borderBottomLeftRadius: 4,
                  };
                } else {
                  return {
                    borderRadius: 0,
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4,
                  };
                }
              } else if (i === React.Children.count(children) - 1) {
                if (orientation === 'horizontal') {
                  return {
                    borderRadius: 0,
                    borderTopRightRadius: 4,
                    borderBottomRightRadius: 4,
                  };
                } else {
                  return {
                    borderRadius: 0,
                    borderBottomLeftRadius: 4,
                    borderBottomRightRadius: 4,
                  };
                }
              }

              return {
                borderRadius: 0,
                ...(orientation === 'horizontal'
                  ? { borderLeftWidth: 0 }
                  : { borderTopWidth: 0 }),
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
  orientation: 'horizontal' | 'vertical';
}

const Container = styled.View<ButtonGroupProps>(({ orientation }) => ({
  flexDirection: orientation === 'horizontal' ? 'row' : 'column',
}));
