import { Dimensions, StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const getFlexibleCardStyle = (theme: AppTheme) =>
  StyleSheet.create({
    gridContainer: {
      flex: 1,
      width: SCREEN_WIDTH,
    },
    container: {
      margin: 10,
      position: 'relative',
    },
    outContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    border: {
      position: 'absolute',
      top: 0,
      left: 0,
      borderColor: theme.colors.transparent,
      borderWidth: 5,
      zIndex: 9999,
      width: '100%',
      height: '100%',
    },
    focusBorder: {
      borderColor: theme.colors.primary,
    },
    imageWrapper: {
      width: '100%',
      height: '80%',
    },
    image: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
    childrenContainer: {
      width: '100%',
      padding: 16,
      backgroundColor: theme.isDarkTheme
        ? theme.colors.textBackground
        : theme.colors.transparent,
    },
    childrenText: {
      fontSize: 14,
      lineHeight: 20,
      maxHeight: 40,
      overflow: 'hidden',
    },

    // Grid
    carouselContainer: {
      width: '100%',
      height: 900,
    },

    // Activity Indicator
    activityIndicator: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: [{ translateX: -20 }, { translateY: -20 }],
      zIndex: 9999,
    },

    // Skeleton
    skeleton: {
      backgroundColor: theme.colors.onSurfaceVariant,
    },
  });
