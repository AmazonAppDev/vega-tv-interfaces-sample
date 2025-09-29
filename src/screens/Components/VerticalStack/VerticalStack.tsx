import React from 'react';
import { View } from 'react-native';

import { ScreenContainer } from '@AppComponents';
import { useThemedStyles } from '@AppTheme';
import { VerticalCarousel } from '@AppComponents/carousels/VerticalCarosuel';
import { getVerticalStackStyles } from './styles';

export type Item = {
  id: string;
  title: string;
  date: string;
  duration: string;
  shortDescription: string;
};

const generateItems = (count: number): Item[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: (index + 1).toString(),
    title: `Guns N' Roses - ${index + 1}`, // Random classic rock name + id
    date: `April ${index + 1}, 2025`,
    duration: `1h 30m`,
    shortDescription: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
  }));
};

const data: Item[] = generateItems(20);

export const VerticalStack = () => {
  const styles = useThemedStyles(getVerticalStackStyles);

  return (
    <ScreenContainer testID="components" style={[styles.screenContainer]}>
      <View style={[styles.container]}>
        <VerticalCarousel data={data} />
      </View>
    </ScreenContainer>
  );
};
