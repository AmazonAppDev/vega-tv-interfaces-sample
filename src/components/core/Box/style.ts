import { StyleSheet } from 'react-native';

import type { ThemeColors } from '@AppTheme';
import { darkPalette, lightPalette } from '@AppTheme/palette';
import { scale } from '@AppUtils/scale';

export const getBoxStyles = ({ colors }: { colors: ThemeColors }) =>
  StyleSheet.create({
    // Variants
    default: {
      elevation: 0,
      backgroundColor: colors.outline,
      width: '100%',
    },
    primary: {
      backgroundColor: colors.primary,
      borderRadius: scale(8),
      elevation: 4,
    },
    secondary: {
      backgroundColor: colors.secondary,
      borderRadius: scale(8),
      elevation: 6,
    },
    outlined: {
      borderWidth: scale(1),
      borderColor: colors.primary,
      borderRadius: scale(8),
      elevation: 2,
    },
    ghost: {
      elevation: 0,
    },
    // Sizes
    sm: {
      padding: scale(8),
      borderRadius: scale(4),
    },
    md: {
      padding: scale(16),
      borderRadius: scale(8),
    },
    lg: {
      padding: scale(24),
      borderRadius: scale(12),
    },
    // States
    focused: {
      borderColor: colors.onPrimary,
      borderWidth: scale(3),
      backgroundColor: colors.outline,
    },
    pressed: {
      borderColor: colors.inversePrimary,
      borderWidth: scale(3),
      backgroundColor: colors.secondary,
    },
    disabled: {
      opacity: 0.5,
    },
  });

export const boxTokensLight = getBoxStyles({ colors: lightPalette });
export const boxTokensDark = getBoxStyles({ colors: darkPalette });
export const defaultTheme = boxTokensLight;
