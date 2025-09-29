import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';

export const getExampleModal = (theme: AppTheme) =>
  StyleSheet.create({
    exampleModalContainer: {
      width: 600,
    },
    modalButton: {
      width: '100%',
      backgroundColor: theme.colors.tertiary,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 10,
    },
    modalButtonFocused: {
      backgroundColor: theme.colors.primary,
    },
    modalSecondaryButton: {
      width: '100%',
      backgroundColor: theme.colors.tertiary,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    modalButtonText: {
      color: theme.colors.background,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
