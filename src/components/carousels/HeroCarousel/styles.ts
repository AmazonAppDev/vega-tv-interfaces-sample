import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';
import { scale } from '@AppUtils/scale';

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
      padding: scale(16),
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
      padding: scale(40),
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
      padding: scale(30),
      borderRadius: scale(12),
      maxWidth: '30%',
      marginLeft: scale(50),
    },
    title: {
      fontSize: scale(38),
      fontWeight: 'bold',
      color: theme.colors.onPrimary,
    },
    description: {
      fontSize: scale(16),
      color: theme.colors.onPrimary,
      marginTop: scale(8),
    },
    childrenContainer: {
      marginTop: scale(20),
    },

    // Dot
    dot: {
      width: scale(15),
      height: scale(15),
      borderRadius: scale(15),
      backgroundColor: theme.colors.primary,
      marginHorizontal: scale(6),
      marginBottom: scale(16),
    },
  });
