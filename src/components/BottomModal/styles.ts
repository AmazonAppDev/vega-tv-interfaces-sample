import { Dimensions, StyleSheet } from 'react-native';

import type { AppTheme } from '@AppTheme';
import { scale } from '@AppUtils/scale';

const { width } = Dimensions.get('window');

const MODAL_HORIZONTAL_MARGIN = scale(50);

export const getBottomStyles = ({ colors }: AppTheme) =>
  StyleSheet.create({
    bottomModalContainer: {
      backgroundColor: colors.surfaceBright,
      minWidth: width - MODAL_HORIZONTAL_MARGIN * 2,
      flexDirection: 'row',
      padding: scale(50),
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
      fontSize: scale(50),
      fontWeight: '100',
    },
    bottomModalDescription: {
      marginTop: scale(20),
      color: colors.onPrimary,
      fontSize: scale(30),
      fontWeight: '100',
      textAlign: 'left',
    },
    bottomModalButton: {
      padding: scale(16),
      borderRadius: scale(12),
      alignItems: 'center',
      justifyContent: 'center',
      width: '80%',
      backgroundColor: colors.outline,
      marginVertical: scale(10),
      borderWidth: scale(2),
      borderColor: colors.transparent,
    },
    bottomModalButtonText: {
      fontSize: scale(30),
      fontWeight: '300',
    },
    modalButtonFocused: {
      borderWidth: scale(2),
      borderColor: colors.primary,
      backgroundColor: colors.onPrimary,
      color: colors.shadow,
    },
  });
