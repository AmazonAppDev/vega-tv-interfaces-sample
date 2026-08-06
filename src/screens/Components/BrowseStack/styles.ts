import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';
import { scale } from '@AppUtils/scale';

export const getBrowseStackStyles = (theme: AppTheme) =>
  StyleSheet.create({
    screenContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    background: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
      marginTop: scale(10),
      alignItems: 'center',
      padding: 0,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerText: {
      fontSize: scale(24),
      fontWeight: 'bold',
      color: theme.colors.onPrimary,
      marginBottom: scale(16),
    },
  });
