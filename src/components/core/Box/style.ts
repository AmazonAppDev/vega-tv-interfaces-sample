import { StyleSheet } from 'react-native';

import type { ThemeColors } from '@AppTheme';
import { darkPalette, lightPalette } from '@AppTheme/palette';

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
      borderRadius: 8,
      elevation: 4,
    },
    secondary: {
      backgroundColor: colors.secondary,
      borderRadius: 8,
      elevation: 6,
    },
    outlined: {
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 8,
      elevation: 2,
    },
    ghost: {
      elevation: 0,
    },
    // Sizes
    sm: {
      padding: 8,
      borderRadius: 4,
    },
    md: {
      padding: 16,
      borderRadius: 8,
    },
    lg: {
      padding: 24,
      borderRadius: 12,
    },
    // States
    focused: {
      borderColor: colors.onPrimary,
      borderWidth: 3,
      backgroundColor: colors.outline,
    },
    pressed: {
      borderColor: colors.inversePrimary,
      borderWidth: 3,
      backgroundColor: colors.secondary,
    },
    disabled: {
      opacity: 0.5,
    },
  });

export const boxTokensLight = getBoxStyles({ colors: lightPalette });
export const boxTokensDark = getBoxStyles({ colors: darkPalette });
export const defaultTheme = boxTokensLight;
