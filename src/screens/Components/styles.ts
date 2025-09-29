import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';

export const getComponentsStyles = (theme: AppTheme) =>
  StyleSheet.create({
    screenContainer: {
      flex: 1,
    },
    container: {
      flex: 1,
      padding: 16,
    },
    buttonContainer: {
      gap: 16,
    },
    headerText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: 16,
    },
    button: {
      backgroundColor: theme.colors.primary,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: theme.colors.secondary,
      fontSize: 16,
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
