import React from 'react';

import type { ButtonProps as KeplerButtonProps } from '@amazon-devices/kepler-ui-components';
import { Button as KeplerButton } from '@amazon-devices/kepler-ui-components';

import { useThemedStyles } from '@AppTheme';
import { getButtonStyles } from './styles';

export type ButtonProps = KeplerButtonProps & {
  label?: string;
};

export const Button = ({ role = 'button', ...buttonProps }: ButtonProps) => {
  const styles = useThemedStyles(getButtonStyles);

  return (
    <KeplerButton
      style={styles.button}
      role={role}
      {...buttonProps}
      // hide the contents of the button if aria-label is specified & aria-hidden is not overridden
      {...(buttonProps['aria-hidden'] === undefined &&
      buttonProps['aria-label'] !== undefined
        ? { contentWrapperProps: { 'aria-hidden': true } }
        : {})}
    />
  );
};
