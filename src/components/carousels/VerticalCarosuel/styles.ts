import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';

export const getVerticalStackStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: '90%',
      flexDirection: 'row',
      alignItems: 'stretch',
    },
    flashlist: {
      marginBottom: 50,
    },
    column: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      overflow: 'hidden',
    },
    leftContainer: {
      width: '100%',
      justifyContent: 'space-around',
      flex: 1,
    },
    imageContainer: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: 30,
    },
    leftContent: {
      flexBasis: '60%',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    leftText: {
      fontSize: 20,
      color: theme.colors.onPrimary,
    },
    rightContainer: {
      flex: 1,
      alignSelf: 'stretch',
      marginTop: 50,
    },
    avatarContainer: {
      alignItems: 'flex-start',
      flex: 1,
      flexBasis: '10%',
      justifyContent: 'flex-start',
    },
    playButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.colors.outlineVariant,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.colors.onPrimary,
    },
    playButtonText: {
      color: theme.colors.onPrimary,
    },
    boxTextContainer: {
      alignItems: 'flex-start',
      flexBasis: '90%',
    },
    headerText: {
      fontSize: 24,
      color: theme.colors.onPrimary,
      marginBottom: 20,
    },
    box: {
      flex: 1,
      width: '100%',
      marginBottom: 20,
      borderRadius: 30,
      backgroundColor: theme.colors.outlineVariant,
      borderWidth: 2,
      borderColor: theme.colors.transparent,
    },
    boxFocused: {
      borderWidth: 2,
      borderColor: theme.colors.onPrimary,
      backgroundColor: theme.colors.shadow,
    },
    boxPressed: {
      borderWidth: 2,
      borderColor: theme.colors.onPrimary,
      backgroundColor: theme.colors.shadow,
    },
    boxContainer: {
      flex: 1,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    boxText: {
      fontSize: 18,
      color: theme.colors.onPrimary,
    },
    innerContainer: {
      width: '100%',
      flex: 1,
    },

    title: {
      fontSize: 20,
      color: theme.colors.onPrimary,
    },
    dateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginVertical: 5,
    },
    date: {
      fontSize: 14,
      color: theme.colors.outline,
    },
    bullet: {
      fontSize: 14,
      color: theme.colors.outline,
    },
    duration: {
      fontSize: 14,
      color: theme.colors.outline,
    },
    shortDescription: {
      fontSize: 16,
      color: theme.colors.onPrimary,
    },
  });
