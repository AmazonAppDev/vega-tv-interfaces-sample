import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';
import { scale } from '@AppUtils/scale';

export const getTextInputStyles = ({ colors, typography }: AppTheme) =>
  StyleSheet.create({
    wrapper: {
      width: '100%',
    },
    textContainer: {
      paddingVertical: scale(12),
      paddingHorizontal: scale(24),
    },
    outerContainer: {
      gap: scale(10),
    },
    label: {
      fontFamily: 'Amazon Ember',
      fontWeight: '700',
    },
    errorTextContainer: {
      marginTop: scale(6),
      minHeight: typography.size?.lineHeight?.label?.lg,
    },
    errorText: {
      color: colors.error,
    },
  });
