import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

import { useThemedStyles } from '@AppTheme/useThemedStyles';
import { getFlexibleCardStyle } from './styles';

interface PlaceholderCardProps {
  width: number;
  height: number;
  radius: number;
}

export const PlaceholderCard = ({
  width,
  height,
  radius,
}: PlaceholderCardProps) => {
  const styles = useThemedStyles(getFlexibleCardStyle);
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [shimmer]);

  const opacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius: radius,
          opacity,
        },
      ]}
    />
  );
};
