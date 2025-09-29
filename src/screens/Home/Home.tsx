/**
 * Home Screen
 * -----------
 * Main entry point for the app's home interface.
 * Features a hero carousel and multiple horizontal rows of bird cards.
 * Focus management is handled for TV/remote navigation.
 */

import React from 'react';
import { View } from 'react-native';

import { ScreenContainer } from '@AppComponents';
import { useThemedStyles } from '@AppTheme';
import { FlexibleCardGrid } from '@AppComponents/FlexibleCard/FlexibleCardGrid';
import { getHomeStyles } from '@AppScreens/Home';
import { FocusGuideView } from '@AppServices/focusGuide';

export const Home = () => {
  // Themed styles for the screen
  const styles = useThemedStyles(getHomeStyles);

  // Main render
  return (
    <View style={styles.container}>
      <ScreenContainer testID="home">
        <FocusGuideView autoFocus trapFocusRight style={styles.listContainer}>
          <FlexibleCardGrid />
        </FocusGuideView>
      </ScreenContainer>
    </View>
  );
};
