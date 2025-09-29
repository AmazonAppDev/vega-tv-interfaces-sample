import React from 'react';

import Animated, {
  useAnimatedStyle,
} from '@amazon-devices/react-native-reanimated';

import { useThemedStyles } from '@AppTheme';
import { getHeroCarouselStyles } from './styles';

/**
 * A animated dot indicator for the Hero Carousel.
 *
 * This component renders a single dot that is part of the carousel's pagination indicator.
 * The dot animates its opacity and scale when it becomes active/inactive.
 *
 * @param props.index - The position of this dot in the sequence of dots
 * @param props.currentIndex - A shared value that tracks which dot should be active
 *
 * Features:
 * - Smooth animations for opacity (1 when active, 0.3 when inactive)
 * - Scale animation (1.2x when active, 0.8x when inactive)
 * - 300ms transition duration for smooth visual feedback
 */

type DotProps = {
  index: number;
  currentIndex: number;
};

const DotComponent: React.FC<DotProps> = ({ index, currentIndex }) => {
  const styles = useThemedStyles(getHeroCarouselStyles);

  const animatedDotStyle = useAnimatedStyle(() => {
    const isActive = currentIndex === index;
    return {
      opacity: isActive ? 1 : 0.3,
      transform: [{ scale: isActive ? 1.2 : 0.8 }],
    };
  });

  return <Animated.View style={[styles.dot, animatedDotStyle]} />;
};

export const Dot = React.memo(DotComponent, (prevProps, nextProps) => {
  return (
    prevProps.currentIndex === nextProps.currentIndex &&
    prevProps.index === nextProps.index
  );
});
