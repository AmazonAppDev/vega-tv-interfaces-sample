import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useThemedStyles } from '@AppTheme';
import { CustomModal } from '@AppComponents/Modal';
import { useFocusCollection } from '@AppSrc/hooks';
import { getExampleModal } from './styles';

interface CustomModalProps {
  isVisible: boolean;
  imageUrl: string;
  onClose: () => void;
  testID?: string;
}

const BUTTON_REF = {
  startWorkout: (imageUrl: string) => `modal-button-start-workout-${imageUrl}`,
  close: (imageUrl: string) => `modal-button-close-${imageUrl}`,
};

const BUTTON_STATE = {
  startWorkout: 'start-workout',
  close: 'close',
};

export const ExampleModal = ({
  isVisible,
  onClose,
  imageUrl,
  testID = 'example-modal',
}: CustomModalProps) => {
  const { focusItem, blurItem, registerRef } = useFocusCollection();
  const [focusedButton, setFocusedButton] = useState<string | null>(null);
  const styles = useThemedStyles(getExampleModal);

  useEffect(() => {
    if (isVisible) {
      setFocusedButton(BUTTON_STATE.startWorkout);
      focusItem(BUTTON_REF.startWorkout(imageUrl));
    }

    return () => {
      setFocusedButton(null);
      blurItem(BUTTON_REF.startWorkout(imageUrl));
    };
  }, [isVisible, focusItem, blurItem, imageUrl]);

  return (
    <CustomModal.Root
      isVisible={isVisible}
      onClose={onClose}
      focusedButton={focusedButton}
      setFocusedButton={setFocusedButton}
      position={'center'}
    >
      <View style={styles.exampleModalContainer} testID={testID}>
        <CustomModal.Image imageUrl={imageUrl} />
        <CustomModal.Content>
          <CustomModal.Title>
            <Text>Total-body balance pilates</Text>
          </CustomModal.Title>
          <CustomModal.Subtitle>
            <Text>34 Min | Intensity ••••</Text>
          </CustomModal.Subtitle>
          <CustomModal.Description>
            <Text>
              Andrea&apos;s signature low-impact, total-body class in just 30
              minutes. Hit every muscle group with barre and Pilates moves that
              leave you feeling strong, refreshed, and energized.
            </Text>
          </CustomModal.Description>

          <Pressable
            testID={`modal-button-start-workout`}
            ref={(ref: React.ElementRef<typeof Pressable>) => {
              if (ref) {
                registerRef(BUTTON_REF.startWorkout(imageUrl), ref);
              }
            }}
            role="button"
            style={[
              styles.modalButton,
              focusedButton === BUTTON_STATE.startWorkout &&
                styles.modalButtonFocused,
            ]}
            onPress={() => focusItem(BUTTON_REF.startWorkout(imageUrl))}
            onFocus={() => {
              setFocusedButton(BUTTON_STATE.startWorkout);
              focusItem(BUTTON_REF.startWorkout(imageUrl));
            }}
            onBlur={() => {
              setFocusedButton(null);
              blurItem(BUTTON_REF.startWorkout(imageUrl));
            }}
          >
            <Text style={styles.modalButtonText}>▶ Start workout</Text>
          </Pressable>

          <Pressable
            testID={`modal-button-close`}
            role="button"
            style={[
              styles.modalButton,
              focusedButton === BUTTON_STATE.close && styles.modalButtonFocused,
            ]}
            onPress={onClose}
            onFocus={() => setFocusedButton(BUTTON_STATE.close)}
            onBlur={() => setFocusedButton(null)}
          >
            <Text style={styles.modalButtonText}>✖ Close</Text>
          </Pressable>
        </CustomModal.Content>
      </View>
    </CustomModal.Root>
  );
};
