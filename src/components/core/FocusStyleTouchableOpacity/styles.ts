import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';
import { scale } from '@AppUtils/scale';

export const getTouchableOpacityStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
    base: {
      backgroundColor: colors.surfaceBright,
      borderColor: colors.transparent,
      borderRadius: scale(8),
      borderWidth: scale(4),
    },
    focused: {
      backgroundColor: colors.primaryFixed,
      borderColor: colors.primary,
      borderStyle: 'solid',
    },
  });
