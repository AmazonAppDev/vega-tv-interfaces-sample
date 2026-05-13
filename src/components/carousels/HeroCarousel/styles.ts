import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';

export const getHeroCarouselStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      position: 'relative',
      backgroundColor: theme.isDarkTheme
        ? theme.colors.background
        : theme.colors.transparent,
    },
    slideWrapper: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    renderItemContainer: {
      height: '100%',
    },
    dotContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      padding: 16,
      flexWrap: 'wrap',
    },

    // Slide
    slideContainer: {
      flex: 1,
      width: '100%',
      height: '100%',
      zIndex: 0,
    },
    slide: {
      flex: 1,
      justifyContent: 'flex-end',
      padding: 40,
    },
    backgroundImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      objectFit: 'cover',
    },
    contentContainer: {
      alignSelf: 'flex-start',
      backgroundColor: theme.colors.modalBackground,
      padding: 30,
      borderRadius: 12,
      maxWidth: '30%',
      marginLeft: 50,
    },
    title: {
      fontSize: 38,
      fontWeight: 'bold',
      color: theme.colors.onPrimary,
    },
    description: {
      fontSize: 16,
      color: theme.colors.onPrimary,
      marginTop: 8,
    },
    childrenContainer: {
      marginTop: 20,
    },

    // Dot
    dot: {
      width: 15,
      height: 15,
      borderRadius: 15,
      backgroundColor: theme.colors.primary,
      marginHorizontal: 6,
      marginBottom: 16,
    },
  });
