import React from 'react';
import type { ViewStyle } from 'react-native';
import { View } from 'react-native';

import type { CarouselProps as VegaCarouselProps } from '@amazon-devices/vega-carousel';
import { Carousel as VegaCarousel } from '@amazon-devices/vega-carousel';

import { useThemedStyles } from '@AppTheme';
import { getCarouselStyles } from './styles';

export type ExtendedCarouselProps<T> = VegaCarouselProps<T> & {
  customStyles?: ViewStyle;
  testID?: string;
};

export function Carousel<T>({
  testID = 'carousel-wrapper',
  ...carouselProps
}: ExtendedCarouselProps<T>) {
  const styles = useThemedStyles(getCarouselStyles);

  return (
    <View style={[styles.wrapper, carouselProps.customStyles]} testID={testID}>
      <VegaCarousel {...carouselProps} />
    </View>
  );
}
