import React from 'react';
import { Text } from 'react-native';

import { useThemedStyles } from '@AppTheme';
import { ScreenContainer } from '@AppComponents/containers';
import { FocusGuideView } from '@AppServices/focusGuide';
import { getDetailsStyles } from './styles';

export const Details = () => {
  const styles = useThemedStyles(getDetailsStyles);

  return (
    <ScreenContainer testID="details" style={styles.screenContainer}>
      <FocusGuideView trapFocusDown trapFocusUp style={styles.container}>
        <Text>Details Screen</Text>
      </FocusGuideView>
    </ScreenContainer>
  );
};
