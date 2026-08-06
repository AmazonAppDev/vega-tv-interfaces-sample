import React, { useRef, useCallback, memo, useState, useEffect } from 'react';
import { Animated, Pressable, View } from 'react-native';

import { useThemedStyles } from '@AppTheme';
import { useImagePrefetchQueue } from '@AppSrc/hooks/useImagePrefetchQueue';
import { getCardHeight, getCardLayout } from '@AppSrc/hooks/usePosterSections';
import { logDebug } from '@AppUtils/logging';
import { scale } from '@AppUtils/scale';
import { PlaceholderCard } from './PlaceholderCard';
import { getFlexibleCardStyle } from './styles';

/**
 * Direction types for card layout
 * - horizontal: Horizontal arrangement
 * - vertical: Vertical arrangement
 * - expand: Allows expansion
 */
export type Direction = 'horizontal' | 'vertical' | 'expand';

/**
 * Predefined card sizes
 * - small: Small size
 * - medium: Medium size
 * - large: Large size
 */
export type CardSize = 'small' | 'medium' | 'large';

/**
 * Props for the FlexibleCard component
 * @property {number} index - Card index in its row
 * @property {number} rowIndex - Row index
 * @property {string} [imageUrl] - URL of the image to display
 * @property {CardSize} [size='medium'] - Card size
 * @property {Direction} direction - Layout direction
 * @property {'zoomIn' | 'zoomOut' | 'expand'} [animations='zoomIn'] - Animation to apply on focus
 * @property {(index: number) => void} [onFocus] - Callback when card receives focus
 * @property {(index: number) => void} [onBlur] - Callback when card loses focus
 * @property {() => void} [onPress] - Callback when card is pressed
 * @property {Object} [scroll] - Scroll configuration
 * @property {React.ReactNode} [children] - Additional card content
 * @property {Object} [customSize] - Custom card size
 * @property {string} [testID] - ID for testing
 * @property {string} [itemId] - Unique item ID
 * @property {boolean} [isSkeleton] - Whether the card is a skeleton
 * @property {boolean} [isRowVisible] - Whether the row is visible
 *
 * @warning The 'expand' animation is currently a work in progress due to limitations in the layout animation system.
 * We are actively working on improving this functionality. For now, it's recommended to use 'zoomIn' or 'zoomOut' animations.
 */
export type FlexibleCardProps = {
  index: number;
  rowIndex: number;
  imageUrl?: string;
  size?: CardSize;
  direction: Direction;
  animations?: 'zoomIn' | 'zoomOut' | 'expand';
  onFocus?: (index: number) => void;
  onBlur?: (index: number) => void;
  onPress?: () => void;
  scroll?: {
    vertically?: (rowIndex: number) => void;
    horizontally?: (index: number) => void;
  };
  children?: React.ReactNode;
  customSize?: { width: number; height: number; radius: number; gap: number };
  testID?: string;
  itemId?: string;
  isSkeleton?: boolean;
  isRowVisible?: boolean;
};

const FOCUS_BORDER = scale(8);

const HIGH_PRIORITY = 1;
const MEDIUM_PRIORITY = 2;
const LOW_PRIORITY = 3;

const checkIfDataSame = (
  prevProps: FlexibleCardProps,
  nextProps: FlexibleCardProps,
) =>
  prevProps.imageUrl === nextProps.imageUrl &&
  prevProps.index === nextProps.index &&
  prevProps.rowIndex === nextProps.rowIndex &&
  prevProps.animations === nextProps.animations &&
  prevProps.size === nextProps.size;

/**
 * Animated focus border layer
 */
const CardFocusBorder = memo(
  ({
    isFocused,
    cardHeight,
    radius,
  }: {
    isFocused: boolean;
    cardHeight: number;
    radius: number;
  }) => {
    const styles = useThemedStyles(getFlexibleCardStyle);
    return (
      <Animated.View
        style={[
          styles.border,
          isFocused && styles.focusBorder,
          {
            minHeight: cardHeight,
            borderRadius: radius,
          },
        ]}
        testID="flexible-card-focus-border"
      />
    );
  },
);

/**
 * Memoized animated image
 */
const CardImage = memo(
  ({
    imageUrl,
    width,
    height,
    radius,
    imageScale,
    testID = 'flexible-card-image',
  }: {
    imageUrl: string;
    width: number;
    height: number;
    radius: number;
    imageScale: Animated.Value;
    testID?: string;
  }) => (
    <Animated.Image
      source={{ uri: imageUrl }}
      style={{
        height: height - FOCUS_BORDER * 2,
        width: width - FOCUS_BORDER * 2,
        margin: FOCUS_BORDER,
        borderRadius: radius,
        transform: [{ scale: imageScale }],
      }}
      resizeMode="cover"
      accessibilityIgnoresInvertColors
      testID={testID}
      role="img"
    />
  ),
  (prev, next) => prev.imageUrl === next.imageUrl,
);

/**
 * Optional children container
 */
const CardChildren = memo(({ children }: { children: React.ReactNode }) => {
  const styles = useThemedStyles(getFlexibleCardStyle);
  return (
    <View style={styles.childrenContainer} testID="flexible-card-children">
      {children}
    </View>
  );
});

/**
 * FlexibleCard Component
 *
 * A flexible card component that can change size, animate, and handle interactions.
 * Key features:
 * - Supports different sizes (small, medium, large)
 * - Single animation on focus (zoomIn, zoomOut, or expand)
 * - Focus handling with visual effects
 * - Image and custom content support
 * - Automatic scroll on focus
 */
export const FlexibleCard = memo(
  ({
    index,
    rowIndex,
    imageUrl,
    size = 'medium',
    direction,
    animations,
    onFocus,
    onBlur,
    onPress,
    scroll,
    children,
    customSize,
    testID = 'flexible-card',
    isSkeleton,
    isRowVisible,
  }: FlexibleCardProps) => {
    const styles = useThemedStyles(getFlexibleCardStyle);
    const [isFocused, setIsFocused] = useState(false);
    const { prefetch } = useImagePrefetchQueue();

    const [shouldShowImage, setShouldShowImage] = useState(false);

    const isVisible = isRowVisible ?? false;
    let priority: 1 | 2 | 3 = LOW_PRIORITY;
    if (isFocused) {
      priority = HIGH_PRIORITY;
    } else if (isVisible) {
      priority = MEDIUM_PRIORITY;
    } else {
      priority = LOW_PRIORITY;
    }

    const layout = customSize ?? getCardLayout(size, direction);
    const cardHeight = getCardHeight(size, direction, Boolean(children));
    const imageScale = useRef(new Animated.Value(1)).current;
    const cardScale = useRef(new Animated.Value(1)).current;
    const cardWidth = useRef(new Animated.Value(layout.width)).current;

    const stopAnimations = () => {
      imageScale.stopAnimation();
      cardScale.stopAnimation();
      cardWidth.stopAnimation();
    };

    const handleFocusAnim = useCallback(() => {
      setIsFocused(true);
      if (!animations) {
        return;
      }
      stopAnimations();

      if (animations === 'zoomIn') {
        Animated.spring(imageScale, {
          toValue: 0.95,
          useNativeDriver: true,
        }).start();
      }
      if (animations === 'zoomOut') {
        Animated.spring(cardScale, {
          toValue: 1.1,
          useNativeDriver: true,
        }).start();
      }
      // expand animation: TODO
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [animations]);

    const handleBlurAnim = useCallback(() => {
      setIsFocused(false);
      if (!animations) {
        return;
      }

      stopAnimations();

      Animated.spring(imageScale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
      Animated.spring(cardScale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const focusHandler = useCallback(() => {
      handleFocusAnim();
      scroll?.horizontally?.(index);
      scroll?.vertically?.(rowIndex);
      onFocus?.(index);
    }, [handleFocusAnim, index, rowIndex, scroll, onFocus]);

    const blurHandler = useCallback(() => {
      handleBlurAnim();
      onBlur?.(index);
    }, [handleBlurAnim, index, onBlur]);

    const handlePress = useCallback(() => {
      onPress?.();
    }, [onPress]);

    useEffect(() => {
      let isMounted = true;

      if (imageUrl) {
        // eslint-disable-next-line promise/prefer-await-to-then
        prefetch(imageUrl, priority).catch(() => logDebug('prefetch failed'));
      }

      const delay = rowIndex * 3 + index * 3;
      const timeout = setTimeout(() => {
        if (isMounted) {
          setShouldShowImage(true);
        }
      }, delay);

      return () => {
        isMounted = false;
        clearTimeout(timeout);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imageUrl, isVisible, rowIndex]);

    return (
      <Pressable
        onFocus={focusHandler}
        onBlur={blurHandler}
        onPress={handlePress}
        role="button"
        testID={`${testID}-${rowIndex + 1}-${index + 1}`}
      >
        <Animated.View
          style={[
            styles.outContainer,
            {
              minHeight: cardHeight,
              paddingVertical: layout.gap * 2,
              paddingHorizontal: layout.gap,
              borderRadius: layout.radius,
              transform: [{ scale: cardScale }],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.container,
              {
                minHeight: cardHeight,
                width: cardWidth,
                borderRadius: layout.radius,
              },
            ]}
          >
            <CardFocusBorder
              isFocused={isFocused}
              cardHeight={cardHeight}
              radius={layout.radius}
            />

            {isSkeleton || !shouldShowImage ? (
              <PlaceholderCard
                width={layout.width}
                height={layout.height}
                radius={layout.radius}
              />
            ) : (
              imageUrl && (
                <CardImage
                  imageUrl={imageUrl}
                  width={layout.width}
                  height={layout.height}
                  radius={layout.radius}
                  imageScale={imageScale}
                  testID={`flexible-card-image-${rowIndex + 1}-${index + 1}`}
                />
              )
            )}

            {children && <CardChildren>{children}</CardChildren>}
          </Animated.View>
        </Animated.View>
      </Pressable>
    );
  },
  checkIfDataSame,
);
