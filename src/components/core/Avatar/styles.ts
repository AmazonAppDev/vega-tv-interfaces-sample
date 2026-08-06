import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';
import { scale } from '@AppUtils/scale';

export const getAvatarStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
    wrapper: {
      alignItems: 'center',
    },
    imageWrapper: {
      backgroundColor: colors.surfaceContainer,
      borderColor: colors.transparent,
      borderWidth: scale(2),
      borderRadius: scale(20),
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    imageWrapperFocused: {
      borderColor: colors.focusPrimary,
    },
    placeholder: {
      fontWeight: '800',
    },
    placeholderFocused: {
      color: colors.focusPrimary,
    },
    labelFocused: {
      color: colors.focusPrimary,
    },
  });

export const imageStyle = StyleSheet.create({
  image: { width: '100%', height: '100%' },
});
