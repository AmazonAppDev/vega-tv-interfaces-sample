import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';
import {
  COLUMNS,
  ITEM_WIDTH,
  ITEM_WIDTH_FINAL,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from './Grid';

const MAX_ITEM_WIDTH = 300;
const MAX_COLUMNS = 4;
const BASE_BORDER_RADIUS = 55;
const BASE_PADDING_BOTTOM = 220;

const BORDER_RADIUS_FINAL =
  ITEM_WIDTH_FINAL > MAX_ITEM_WIDTH
    ? BASE_BORDER_RADIUS
    : BASE_BORDER_RADIUS / 4;

const PADDING_BOTTOM = COLUMNS > MAX_COLUMNS ? 200 : BASE_PADDING_BOTTOM;

export const GridStyle = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      width: ITEM_WIDTH,
      padding: 0,
      margin: 0,
      marginBottom: 20,
    },
    imageWrapper: {
      width: ITEM_WIDTH,
      borderRadius: BORDER_RADIUS_FINAL,
      borderWidth: 5,
      borderColor: theme.colors.transparent,
      overflow: 'hidden',
    },
    imageFocused: {
      borderColor: theme.colors.primary,
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
      transform: [{ scale: 1.1 }],
    },

    // GRID Styles
    grid: {
      position: 'relative',
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
      justifyContent: 'center',
      alignItems: 'center',
    },
    gridContainer: {
      width: '90%',
      height: SCREEN_HEIGHT,
      paddingBottom: PADDING_BOTTOM,
    },
    gridItemWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
