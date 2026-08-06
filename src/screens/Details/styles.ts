import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';
import { scale } from '@AppUtils/scale';

export const getDetailsStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
    screenContainer: {
      backgroundColor: colors.background,
      marginHorizontal: scale(50),
    },
    container: {
      flex: 1,
      alignItems: 'center',
    },
    headerContainer: {
      paddingTop: scale(50),
      paddingLeft: scale(50),
    },
    headerText: {
      marginBottom: scale(10),
    },
    button: {
      width: scale(150),
    },
  });

export const getDetailsContentStyles = (_: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignSelf: 'stretch',
    },
  });

export const getDetailsContentContainerStyles = (_: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignSelf: 'stretch',
    },
  });
