import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';

export const getDetailsStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
    screenContainer: {
      backgroundColor: colors.background,
      marginHorizontal: 50,
    },
    container: {
      flex: 1,
      alignItems: 'center',
    },
    headerContainer: {
      paddingTop: 50,
      paddingLeft: 50,
    },
    headerText: {
      marginBottom: 10,
    },
    button: {
      width: 150,
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
