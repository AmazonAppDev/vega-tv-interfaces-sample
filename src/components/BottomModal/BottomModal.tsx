import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useThemedStyles } from '@AppTheme';
import { CustomModal } from '@AppComponents/Modal';
import { useFocusCollection } from '@AppSrc/hooks';
import { getBottomStyles } from './styles';

// Define button refs and states
const BUTTON_REF = {
  update: 'modal-button-update',
  close: 'modal-button-close',
};

const BUTTON_STATE = {
  update: 'update',
  close: 'close',
};

interface BottomModalProps {
  isVisible: boolean;
  onClose: () => void;
  testID?: string;
}

export const BottomModal = ({
  isVisible,
  onClose,
  testID = 'bottom-modal',
}: BottomModalProps) => {
  const { focusItem, blurItem, registerRef } = useFocusCollection();
  const [focusedButton, setFocusedButton] = useState<string | null>(null);
  const styles = useThemedStyles(getBottomStyles);

  useEffect(() => {
    if (isVisible) {
      setFocusedButton(BUTTON_STATE.update);
      focusItem(BUTTON_REF.update);
    }

    return () => {
      setFocusedButton(null);
      blurItem(BUTTON_REF.update);
      blurItem(BUTTON_REF.close);
    };
  }, [isVisible, focusItem, blurItem]);

  return (
    <CustomModal.Root
      isVisible={isVisible}
      onClose={onClose}
      focusedButton={focusedButton}
      setFocusedButton={setFocusedButton}
      position={'bottom'}
    >
      <CustomModal.Content style={styles.bottomModalContainer}>
        <View style={styles.bottomModalContent}>
          <CustomModal.Title>
            <Text style={styles.bottomModalTitle}>New title here</Text>
          </CustomModal.Title>
          <CustomModal.Description>
            <Text style={styles.bottomModalDescription}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt,
              est voluptatum. Exercitationem debitis est provident.
            </Text>
          </CustomModal.Description>
        </View>

        <View style={styles.bottomModalButtonContainer} testID={testID}>
          <Pressable
            testID="bottom-modal-button-update"
            ref={(ref: React.ElementRef<typeof Pressable>) => {
              if (ref) {
                registerRef(BUTTON_REF.update, ref);
              }
            }}
            role="button"
            style={[
              styles.bottomModalButton,
              focusedButton === BUTTON_STATE.update &&
                styles.modalButtonFocused,
            ]}
            onPress={() => {}}
            onFocus={() => {
              setFocusedButton(BUTTON_STATE.update);
              focusItem(BUTTON_REF.update);
            }}
            onBlur={() => {
              setFocusedButton(null);
              blurItem(BUTTON_REF.update);
            }}
          >
            <Text style={styles.bottomModalButtonText}>Update now</Text>
          </Pressable>

          <Pressable
            testID="bottom-modal-button-close"
            ref={(ref: React.ElementRef<typeof Pressable>) => {
              if (ref) {
                registerRef(BUTTON_REF.close, ref);
              }
            }}
            role="button"
            style={[
              styles.bottomModalButton,
              focusedButton === BUTTON_STATE.close && styles.modalButtonFocused,
            ]}
            onPress={onClose}
            onFocus={() => {
              setFocusedButton(BUTTON_STATE.close);
              focusItem(BUTTON_REF.close);
            }}
            onBlur={() => {
              setFocusedButton(null);
              blurItem(BUTTON_REF.close);
            }}
          >
            <Text style={styles.bottomModalButtonText}>No thanks</Text>
          </Pressable>
        </View>
      </CustomModal.Content>
    </CustomModal.Root>
  );
};
