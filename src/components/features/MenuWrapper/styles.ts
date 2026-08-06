import { StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';
import { scale } from '@AppUtils/scale';

export const getMenuWRapperStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: colors.surfaceContainer,
      flex: 1,
      justifyContent: 'space-between',
      borderRightColor: colors.surfaceBright,
      borderRightWidth: scale(2),
      paddingHorizontal: scale(25),
      paddingVertical: scale(50),
    },
    closeButtonWrapper: {
      height: scale(50),
      justifyContent: 'center',
    },
    avatar: {
      borderColor: colors.surfaceTint,
    },
    avatarWrapper: {
      width: scale(50),
    },
  });

export const getMenuItemStyles = ({ colors, typography }: AppTheme) =>
  StyleSheet.create({
    icon: {
      width: scale(50),
      height: scale(50),
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconText: {
      fontSize: scale(30),
      lineHeight: scale(30),
    },
    item: {
      marginVertical: scale(8),
      height: scale(50),
      justifyContent: 'center',
      borderColor: colors.transparent,
    },
    itemExpanded: {
      paddingLeft: '20%',
      justifyContent: 'flex-start',
    },
    itemFocused: {
      borderColor: colors.focusPrimary,
    },
    itemActive: {
      backgroundColor: colors.focusActive,
    },
    label: {
      marginLeft: scale(8),
      lineHeight: typography?.size?.fontSize?.body?.md,
    },
  });

export const getCloseMenuButtonStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
    closeButton: {
      borderWidth: scale(2),
      borderColor: colors.transparent,
      paddingHorizontal: scale(16),
      paddingVertical: scale(8),
    },
    closeButtonFocused: {
      borderColor: colors.focusPrimary,
    },
  });
