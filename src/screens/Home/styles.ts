import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';

export const getHomeStyles = ({ colors, typography, isDarkTheme }: AppTheme) =>
  StyleSheet.create({
    background: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      alignItems: 'center',
      padding: 0,
    },
    carouselContainer: {
      width: '100%',
      height: 900,
    },
    rowContainer: {
      flex: 1,
      width: '100%',
      paddingHorizontal: 20,
      overflow: 'hidden',
    },
    listContainer: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardContainer: {},
    headerContainer: {
      marginLeft: 200,
    },
    subHeaderText: {
      color: colors.primaryFixed,
      marginBottom: 20,
    },
    links: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-around',
      height: 600,
    },
    image: {
      flex: 1,
      paddingLeft: 150,
    },
    textContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      marginTop: 20,
      fontSize: typography.size?.fontSize?.headline?.sm,
      color: isDarkTheme ? colors.onPrimary : colors.primary,
    },
    childText: {
      fontSize: 16,
      color: isDarkTheme ? colors.onPrimary : colors.primary,
    },
    logOutButton: {
      marginTop: 50,
      padding: 50,
      fontSize: typography.size?.fontSize?.headline?.sm,
      borderColor: colors.primaryFixed,
      borderWidth: 1,
      width: '50%',
    },
    preassableText: {
      color: colors.primaryFixed,
      fontSize: typography.size?.fontSize?.headline?.md,
    },
    bottomModalButton: {
      marginTop: 50,
      width: 200,
      alignSelf: 'center',
    },

    // BrowseStack Style
    screenContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingContainer: {
      paddingTop: 100,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDarkTheme ? colors.onPrimary : colors.primary,
      marginBottom: 16,
    },
  });
