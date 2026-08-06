import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';
import { scale } from '@AppUtils/scale';

export const getComponentsStyles = (theme: AppTheme) =>
  StyleSheet.create({
    screenContainer: {
      flex: 1,
    },
    container: {
      flex: 1,
      padding: scale(16),
    },
    buttonContainer: {
      gap: scale(16),
    },
    headerText: {
      fontSize: scale(24),
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: scale(16),
    },
    button: {
      backgroundColor: theme.colors.primary,
      padding: scale(12),
      borderRadius: scale(8),
      alignItems: 'center',
    },
    buttonText: {
      color: theme.colors.secondary,
      fontSize: scale(16),
      fontWeight: '600',
    },
  });

export const getComponentsContentStyles = (_: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignSelf: 'stretch',
    },
  });

export const getComponentsContentContainerStyles = (_: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignSelf: 'stretch',
    },
  });
