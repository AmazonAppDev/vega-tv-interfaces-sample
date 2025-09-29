import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';

export const getTextInputStyles = ({ colors, typography }: AppTheme) =>
  StyleSheet.create({
    wrapper: {
      width: '100%',
    },
    textContainer: {
      paddingVertical: 12,
      paddingHorizontal: 24,
    },
    outerContainer: {
      gap: 10,
    },
    label: {
      fontFamily: 'Amazon Ember',
      fontWeight: '700',
    },
    errorTextContainer: {
      marginTop: 6,
      minHeight: typography.size?.lineHeight?.label?.lg,
    },
    errorText: {
      color: colors.error,
    },
  });
