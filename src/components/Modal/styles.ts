import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';

export const getModalStyles = (theme: AppTheme) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.colors.modalBackground,
      alignItems: 'center',
    },
    modalContent: {
      minWidth: 600,
      backgroundColor: theme.colors.surface,
      borderRadius: 40,
      alignItems: 'center',
      overflow: 'hidden',
      marginBottom: 20,
    },
    modalContentPadding: {
      width: '100%',
      padding: 20,
    },
    modalImage: {
      width: '100%',
      minHeight: 600,
      borderRadius: 8,
      marginBottom: 15,
      resizeMode: 'contain',
    },
    modalTitle: {
      fontSize: 30,
      color: theme.colors.onPrimary,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 5,
    },
    modalSubtitle: {
      fontSize: 16,
      color: theme.colors.onPrimary,
      textAlign: 'center',
      marginBottom: 10,
    },
    modalDescription: {
      fontSize: 18,
      color: theme.colors.onPrimary,
      textAlign: 'center',
      marginBottom: 20,
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
