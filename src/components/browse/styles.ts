import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';

export const getBrowseStyle = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      alignItems: 'center',
      marginVertical: 30,
    },
    title: {
      fontSize: 50,
      color: theme.colors.outline,
    },
    tabContainer: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 8,
      height: 48,
    },
    tab: {
      width: 200,
      height: 48,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 8,
      padding: 0,
      borderRadius: 50,
    },
    activeTab: {
      backgroundColor: theme.colors.primary,
    },
    tabFocused: {
      backgroundColor: theme.colors.surfaceVariant,
    },
    tabText: {
      fontSize: 25,
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
      paddingLeft: 20,
      paddingRight: 10,
      paddingTop: 20,
      width: '100%',
    },
    scrollContainer: {
      flex: 1,
      width: '100%',
    },
    header: {
      color: theme.colors.onSurface,
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    filterItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 15,
      paddingRight: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline,
      width: '100%',
      minHeight: 100,
    },
    focusedItem: {
      borderBottomColor: theme.colors.primary,
    },
    filterItemFocused: {
      borderBottomColor: theme.colors.primary,
    },
    filterText: {
      color: theme.colors.onSurface,
      fontSize: 25,
    },
    arrow: {
      color: theme.colors.onPrimary,
      fontSize: 25,
    },
    closeButton: {
      marginTop: 20,
      marginBottom: 20,
      paddingVertical: 12,
      paddingHorizontal: 24,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      alignSelf: 'center',
    },
    closeButtonFocused: {
      borderColor: theme.colors.primary,
    },
    closeText: {
      color: theme.colors.onSurface,
      fontSize: 16,
    },
    subFiltersContainer: {
      width: '100%',
      paddingLeft: 20,
      paddingRight: 10,
      backgroundColor: theme.colors.surfaceVariant,
    },
    subFilterItem: {
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline,
      width: '100%',
    },
    subFilterText: {
      color: theme.colors.onPrimary,
      fontSize: 20,
      fontWeight: 'bold',
    },
  });
