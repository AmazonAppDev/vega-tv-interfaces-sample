import React from 'react';
import { Text, View } from 'react-native';

import { useNavigation } from '@amazon-devices/react-navigation__core';

import { Button } from '@AppComponents';
import { useThemedStyles } from '@AppTheme';
import { ScreenContainer } from '@AppComponents/containers';
import { FocusGuideView } from '@AppServices/focusGuide';
import { getComponentsStyles } from './styles';

export const Components = () => {
  const styles = useThemedStyles(getComponentsStyles);

  const navigation = useNavigation();

  const handleGoToVerticalStack = () => {
    navigation.navigate('Components', {
      screen: 'VerticalStack',
    });
  };

  const handleGoToBrowseStack = () => {
    navigation.navigate('Components', {
      screen: 'BrowseStack',
    });
  };

  return (
    <ScreenContainer testID="components" style={styles.screenContainer}>
      <FocusGuideView trapFocusRight style={styles.container}>
        <Text style={styles.headerText}>Components Screen</Text>
        <View style={styles.buttonContainer}>
          <Button
            variant="primary"
            label="Go to Vertical Stack"
            onPress={handleGoToVerticalStack}
            testID="go-to-vertical-stack-button"
          />

          <Button
            variant="primary"
            label="Go to Browse Stack"
            onPress={handleGoToBrowseStack}
            testID="go-to-browse-stack-button"
          />
        </View>
      </FocusGuideView>
    </ScreenContainer>
  );
};
