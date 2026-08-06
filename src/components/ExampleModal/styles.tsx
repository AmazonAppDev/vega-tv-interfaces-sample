import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';
import { scale } from '@AppUtils/scale';

export const getExampleModal = (theme: AppTheme) =>
  StyleSheet.create({
    exampleModalContainer: {
      width: scale(600),
    },
    modalButton: {
      width: '100%',
      backgroundColor: theme.colors.tertiary,
      padding: scale(12),
      borderRadius: scale(8),
      alignItems: 'center',
      marginBottom: scale(10),
    },
    modalButtonFocused: {
      backgroundColor: theme.colors.primary,
    },
    modalSecondaryButton: {
      width: '100%',
      backgroundColor: theme.colors.tertiary,
      padding: scale(12),
      borderRadius: scale(8),
      alignItems: 'center',
    },
    modalButtonText: {
      color: theme.colors.background,
      fontSize: scale(16),
      fontWeight: 'bold',
    },
  });
