import { Dimensions, StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';
import { scale } from '@AppUtils/scale';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const getFlexibleCardStyle = (theme: AppTheme) =>
  StyleSheet.create({
    gridContainer: {
      flex: 1,
      width: SCREEN_WIDTH,
    },
    container: {
      margin: scale(10),
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
      borderWidth: scale(5),
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
      padding: scale(16),
      backgroundColor: theme.isDarkTheme
        ? theme.colors.textBackground
        : theme.colors.transparent,
    },
    childrenText: {
      fontSize: scale(14),
      lineHeight: scale(20),
      maxHeight: scale(40),
      overflow: 'hidden',
    },

    // Grid
    carouselContainer: {
      width: '100%',
      height: scale(900),
    },

    // Activity Indicator
    activityIndicator: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: [{ translateX: scale(-20) }, { translateY: scale(-20) }],
      zIndex: 9999,
    },

    // Skeleton
    skeleton: {
      backgroundColor: theme.colors.onSurfaceVariant,
    },
  });
