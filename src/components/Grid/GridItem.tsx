import React, { useRef, useCallback, useState } from 'react';
import { View, Pressable, Animated } from 'react-native';

import { useThemedStyles } from '@AppTheme';
import { GRID_ITEM_HEIGHT, ITEM_WIDTH } from './Grid';
import { GridStyle } from './styles';

interface GridItemProps {
  id: string;
  imageUrl: string;
  onPress?: () => void;
  onFocus?: () => void;
  testID?: string;
}

const IMAGE_HEIGHT = GRID_ITEM_HEIGHT - 150;

export const GridItem = ({
  id,
  imageUrl,
  onPress,
  onFocus,
  testID,
}: GridItemProps) => {
  const styles = useThemedStyles(GridStyle);
  const scaleAnim = useRef(new Animated.Value(1.1)).current;
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      speed: 20,
      bounciness: 5,
      useNativeDriver: true,
    }).start();
    onFocus?.();
    setIsFocused(true);
  }, [scaleAnim, onFocus]);

  const handleBlur = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1.1,
      speed: 20,
      bounciness: 5,
      useNativeDriver: true,
    }).start();
    setIsFocused(false);
  }, [scaleAnim]);

  return (
    <Pressable
      testID={`grid-item-${testID || id}`}
      role="button"
      key={id}
      onPress={onPress}
      onFocus={handleFocus}
      onBlur={handleBlur}
      style={styles.container}
    >
      <View style={[styles.imageWrapper, isFocused && styles.imageFocused]}>
        <Animated.Image
          testID={`grid-item-image-${testID || id}`}
          accessibilityIgnoresInvertColors
          style={[styles.image, { transform: [{ scale: scaleAnim }] }]}
          source={{ uri: imageUrl }}
          width={ITEM_WIDTH}
          height={IMAGE_HEIGHT}
        />
      </View>
    </Pressable>
  );
};
