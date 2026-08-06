import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';
import { scale } from '@AppUtils/scale';

export const getVerticalStackStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: '90%',
      flexDirection: 'row',
      alignItems: 'stretch',
    },
    flashlist: {
      marginBottom: scale(50),
    },
    column: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      padding: scale(20),
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
      borderRadius: scale(30),
    },
    leftContent: {
      flexBasis: '60%',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    leftText: {
      fontSize: scale(20),
      color: theme.colors.onPrimary,
    },
    rightContainer: {
      flex: 1,
      alignSelf: 'stretch',
      marginTop: scale(50),
    },
    avatarContainer: {
      alignItems: 'flex-start',
      flex: 1,
      flexBasis: '10%',
      justifyContent: 'flex-start',
    },
    playButton: {
      width: scale(50),
      height: scale(50),
      borderRadius: scale(25),
      backgroundColor: theme.colors.outlineVariant,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: scale(1),
      borderColor: theme.colors.onPrimary,
    },
    playButtonText: {
      color: theme.colors.onPrimary,
      fontSize: scale(16),
    },
    boxTextContainer: {
      alignItems: 'flex-start',
      flexBasis: '90%',
    },
    headerText: {
      fontSize: scale(24),
      color: theme.colors.onPrimary,
      marginBottom: scale(20),
    },
    box: {
      flex: 1,
      width: '100%',
      marginBottom: scale(20),
      borderRadius: scale(30),
      backgroundColor: theme.colors.outlineVariant,
      borderWidth: scale(2),
      borderColor: theme.colors.transparent,
    },
    boxFocused: {
      borderWidth: scale(2),
      borderColor: theme.colors.onPrimary,
      backgroundColor: theme.colors.shadow,
    },
    boxPressed: {
      borderWidth: scale(2),
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
      fontSize: scale(18),
      color: theme.colors.onPrimary,
    },
    innerContainer: {
      width: '100%',
      flex: 1,
    },

    title: {
      fontSize: scale(20),
      color: theme.colors.onPrimary,
    },
    dateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(10),
      marginVertical: scale(5),
    },
    date: {
      fontSize: scale(14),
      color: theme.colors.outline,
    },
    bullet: {
      fontSize: scale(14),
      color: theme.colors.outline,
    },
    duration: {
      fontSize: scale(14),
      color: theme.colors.outline,
    },
    shortDescription: {
      fontSize: scale(16),
      color: theme.colors.onPrimary,
    },
  });
