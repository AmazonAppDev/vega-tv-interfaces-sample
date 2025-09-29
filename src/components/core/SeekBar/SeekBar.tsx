import React from 'react';

import {
  SeekBar as KeplerSeekBar,
  type SeekBarProps as KeplerSeekBarProps,
} from '@amazon-devices/kepler-ui-components';

export type SeekBarProps = KeplerSeekBarProps;

export const SeekBar = ({ ...props }: SeekBarProps) => {
  return (
    <KeplerSeekBar
      role="slider"
      aria-valuemin={0}
      aria-valuemax={props.totalValue}
      aria-valuenow={props.currentValue}
      {...props}
    />
  );
};
