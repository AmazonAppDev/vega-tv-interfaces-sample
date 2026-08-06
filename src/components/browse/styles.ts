import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';
import { scale } from '@AppUtils/scale';

export const getBrowseStyle = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      alignItems: 'center',
      marginVertical: scale(30),
    },
    title: {
      fontSize: scale(50),
      color: theme.colors.outline,
    },
    tabContainer: {
      flexDirection: 'row',
      paddingHorizontal: scale(16),
      paddingVertical: scale(8),
      height: scale(48),
    },
    tab: {
      width: scale(200),
      height: scale(48),
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: scale(8),
      padding: 0,
      borderRadius: scale(50),
      borderWidth: scale(3),
    },
    activeTab: {
      backgroundColor: theme.colors.primary,
    },
    tabFocused: {
      backgroundColor: theme.colors.surfaceVariant,
    },
    tabText: {
      fontSize: scale(25),
      color: theme.colors.onPrimary,
      fontWeight: 'bold',
    },
    tabContentContainer: {
      height: '100%',
      alignItems: 'center',
    },
    drawerContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingLeft: scale(20),
      paddingRight: scale(10),
      paddingTop: scale(20),
      width: '100%',
    },
    scrollContainer: {
      flex: 1,
      width: '100%',
    },
    header: {
      color: theme.colors.onSurface,
      fontSize: scale(24),
      fontWeight: 'bold',
      marginBottom: scale(20),
    },
    filterItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: scale(15),
      paddingRight: scale(10),
      borderBottomWidth: scale(1),
      borderBottomColor: theme.colors.outline,
      width: '100%',
      minHeight: scale(100),
    },
    focusedItem: {
      borderBottomColor: theme.colors.primary,
    },
    filterItemFocused: {
      borderBottomColor: theme.colors.primary,
    },
    filterText: {
      color: theme.colors.onSurface,
      fontSize: scale(25),
    },
    arrow: {
      color: theme.colors.onPrimary,
      fontSize: scale(25),
    },
    closeButton: {
      marginTop: scale(20),
      marginBottom: scale(20),
      paddingVertical: scale(12),
      paddingHorizontal: scale(24),
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      borderRadius: scale(8),
      borderWidth: scale(1),
      borderColor: theme.colors.outline,
      alignSelf: 'center',
    },
    closeButtonFocused: {
      borderColor: theme.colors.primary,
    },
    closeText: {
      color: theme.colors.onSurface,
      fontSize: scale(16),
    },
    subFiltersContainer: {
      width: '100%',
      paddingLeft: scale(20),
      paddingRight: scale(10),
      backgroundColor: theme.colors.surfaceVariant,
    },
    subFilterItem: {
      padding: scale(12),
      borderBottomWidth: scale(1),
      borderBottomColor: theme.colors.outline,
      width: '100%',
    },
    subFilterText: {
      color: theme.colors.onPrimary,
      fontSize: scale(20),
      fontWeight: 'bold',
    },
  });
