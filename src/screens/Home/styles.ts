import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';
import { scale } from '@AppUtils/scale';

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
      height: scale(900),
    },
    rowContainer: {
      flex: 1,
      width: '100%',
      paddingHorizontal: scale(20),
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
      marginLeft: scale(200),
    },
    subHeaderText: {
      color: colors.primaryFixed,
      marginBottom: scale(20),
    },
    links: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-around',
      height: scale(600),
    },
    image: {
      flex: 1,
      paddingLeft: scale(150),
    },
    textContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      marginTop: scale(20),
      marginLeft: scale(50),
      fontSize: typography.size?.fontSize?.headline?.sm,
      color: isDarkTheme ? colors.onPrimary : colors.primary,
    },
    flashListHorizontal: {
      marginLeft: scale(50),
    },
    childText: {
      fontSize: scale(16),
      color: isDarkTheme ? colors.onPrimary : colors.primary,
    },
    logOutButton: {
      marginTop: scale(50),
      padding: scale(50),
      fontSize: typography.size?.fontSize?.headline?.sm,
      borderColor: colors.primaryFixed,
      borderWidth: scale(1),
      width: '50%',
    },
    preassableText: {
      color: colors.primaryFixed,
      fontSize: typography.size?.fontSize?.headline?.md,
    },
    bottomModalButton: {
      marginTop: scale(50),
      width: scale(200),
      alignSelf: 'center',
    },

    // BrowseStack Style
    screenContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingContainer: {
      paddingTop: scale(100),
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerText: {
      fontSize: scale(24),
      fontWeight: 'bold',
      color: isDarkTheme ? colors.onPrimary : colors.primary,
      marginBottom: scale(16),
    },
  });
