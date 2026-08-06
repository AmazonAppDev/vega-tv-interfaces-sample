import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';
import { scale } from '@AppUtils/scale';

export const getModalStyles = (theme: AppTheme) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.colors.modalBackground,
      alignItems: 'center',
    },
    modalContent: {
      minWidth: scale(600),
      backgroundColor: theme.colors.surface,
      borderRadius: scale(40),
      alignItems: 'center',
      overflow: 'hidden',
      marginBottom: scale(20),
    },
    modalContentPadding: {
      width: '100%',
      padding: scale(20),
    },
    modalImage: {
      width: '100%',
      minHeight: scale(600),
      borderRadius: scale(8),
      marginBottom: scale(15),
      resizeMode: 'contain',
    },
    modalTitle: {
      fontSize: scale(30),
      color: theme.colors.onPrimary,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: scale(5),
    },
    modalSubtitle: {
      fontSize: scale(16),
      color: theme.colors.onPrimary,
      textAlign: 'center',
      marginBottom: scale(10),
    },
    modalDescription: {
      fontSize: scale(18),
      color: theme.colors.onPrimary,
      textAlign: 'center',
      marginBottom: scale(20),
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
