import React from 'react';
import { type AccessibilityProps, ScrollView, Text, View } from 'react-native';

import { useThemedStyles } from '@AppTheme';
import type { DetailsLayout } from '@AppModels/detailsLayout/DetailsLayout';
import { useScreenReaderEnabled } from '@AppServices/a11y';
import { getDetailsContentStyles } from './styles';

export type DetailsContentProps = {
  detailsLayoutData: DetailsLayout;
  openVideoPlayer: (() => void) | null;
  accessibilityHint?: AccessibilityProps['accessibilityHint'];
};

export const DetailsContent = ({ accessibilityHint }: DetailsContentProps) => {
  const screenReaderEnabled = useScreenReaderEnabled();

  const styles = useThemedStyles(getDetailsContentStyles);

  const renderedDetailsContent = (
    <View style={styles.container}>
      <View style={styles.container}>
        <Text>Details Content</Text>
      </View>
    </View>
  );

  return (
    <View
      style={styles.container}
      aria-hidden={!screenReaderEnabled}
      accessibilityHint={accessibilityHint}
    >
      <ScrollView style={styles.container}>{renderedDetailsContent}</ScrollView>
    </View>
  );
};
