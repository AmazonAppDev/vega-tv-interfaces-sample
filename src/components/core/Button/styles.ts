import { StyleSheet } from 'react-native';

import { scale } from '@AppUtils/scale';

export const getButtonStyles = () =>
  StyleSheet.create({
    button: {
      minWidth: scale(120),
    },
  });
