import React, { forwardRef } from 'react';
import { type View } from 'react-native';

import type { ButtonProps as KeplerButtonProps } from '@amazon-devices/kepler-ui-components';
import { Button as KeplerUiButton } from '@amazon-devices/kepler-ui-components';

export type ButtonRef = View;
export type ButtonProps = KeplerButtonProps;

export const Button = forwardRef<ButtonRef, ButtonProps>(
  ({ role = 'button', ...props }, ref) => {
    return (
      <KeplerUiButton
        ref={ref}
        role={role}
        aria-disabled={props.disabled}
        {...props}
      />
    );
  },
);
