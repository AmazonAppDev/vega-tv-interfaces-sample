import { Dimensions, StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';

const { width } = Dimensions.get('window');

const MODAL_HORIZONTAL_MARGIN = 50;

export const getBottomStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
    bottomModalContainer: {
      backgroundColor: colors.surfaceBright,
      minWidth: width - MODAL_HORIZONTAL_MARGIN * 2,
      flexDirection: 'row',
      padding: 50,
    },
    bottomModalContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    bottomModalButtonContainer: {
      width: '40%',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    bottomModalTitle: {
      color: colors.onPrimary,
      fontSize: 50,
      fontWeight: '100',
    },
    bottomModalDescription: {
      marginTop: 20,
      color: colors.onPrimary,
      fontSize: 30,
      fontWeight: '100',
      textAlign: 'left',
    },
    bottomModalButton: {
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      width: '80%',
      backgroundColor: colors.outline,
      marginVertical: 10,
      borderWidth: 2,
      borderColor: colors.transparent,
    },
    bottomModalButtonText: {
      fontSize: 30,
      fontWeight: '300',
    },
    modalButtonFocused: {
      borderWidth: 2,
      borderColor: colors.primary,
      backgroundColor: colors.onPrimary,
      color: colors.shadow,
    },
  });
