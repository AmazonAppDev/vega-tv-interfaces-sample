import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { Dimensions, Pressable, View } from 'react-native';

import { Platform, type HWEvent } from '@amazon-devices/react-native-kepler';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  runOnJS,
} from '@amazon-devices/react-native-reanimated';

import { useAppTheme, useThemedStyles } from '@AppTheme';
import { useFocusGuideEventHandler } from '@AppServices/focusGuide';
import { DPADEventType, EVENT_KEY_DOWN, EVENT_KEY_UP } from '@AppSrc/constants';
import { Dot } from './Dot';
import { Slide } from './Slide';
import { getHeroCarouselStyles } from './styles';

/**
 * Represents a single item in the carousel.
 * @typedef {Object} CarouselItem
 * @property {string} title - The title text to display on the slide
 * @property {string} description - The description text to display on the slide
 * @property {string} bgColor - The background color of the slide
 * @property {string} [backgroundImage] - Optional URL for the slide's background image
 */
export type CarouselItem = {
  title: string;
  description: string;
  bgColor: string;
  backgroundImage?: string;
};

/**
 * Props for the HeroCarousel component
 * @typedef {Object} CarouselProps
 * @property {CarouselItem[]} data - Array of items to display in the carousel
 * @property {string} [backgroundColor='#000'] - Background color of the carousel container
 * @property {number} [autoInterval=3000] - Time in milliseconds between auto-scrolling slides
 * @property {function} [onPress] - Callback function when a slide is pressed
 * @property {function} [onFocus] - Callback function when a slide receives focus
 * @property {function} [onBlur] - Callback function when a slide loses focus
 */
type CarouselProps = {
  data: Array<CarouselItem>;
  backgroundColor?: string;
  autoInterval?: number;
  onPress?: (index: number) => void;
  onFocus?: (index: number) => void;
  onBlur?: (index: number) => void;
  testID?: string;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * HeroCarousel is a full-width carousel component that supports:
 * - Automatic sliding with configurable intervals
 * - DPAD navigation (left/right) for TV interfaces
 * - Animated dot indicators showing current slide position
 * - Custom background colors and images for each slide
 * - Responsive layout that adapts to screen width
 *
 * The carousel will automatically pause its auto-scroll when user interaction is detected
 * and resume after interaction ends.
 *
 * @component
 * @example
 * ```tsx
 * const items = [
 *   {
 *     title: "Welcome",
 *     description: "Discover amazing content",
 *     bgColor: "#1a1a1a",
 *     backgroundImage: "https://example.com/image.jpg"
 *   },
 *   // ... more items
 * ];
 *
 * const handleSlidePress = (index: number) => {
 *   console.log(`Slide ${index} pressed`);
 *   // Handle slide press, e.g., navigate to detail view
 * };
 *
 * <HeroCarousel
 *   data={items}
 *   autoInterval={5000}
 *   backgroundColor="#000000"
 *   onPress={handleSlidePress}
 * />
 * ```
 */
export const HeroCarousel: React.FC<CarouselProps> = ({
  data,
  backgroundColor = '#000',
  autoInterval = 3000,
  onPress,
  onFocus,
  onBlur,
  testID = 'hero-carousel-container',
}) => {
  const { isDarkTheme, colors } = useAppTheme();

  // Ref to the Pressable component for focus management and accessibility
  const pressableRef = useRef<View>(null);

  // Platform check to enable TV-specific behavior and navigation
  const isTV = Platform.isTV;

  // State to track if the carousel is currently focused for TV navigation
  const [isFocused, setIsFocused] = useState(false);

  // State to store the current width of the carousel for slide calculations
  const [layoutWidth, setLayoutWidth] = useState(SCREEN_WIDTH);

  const styles = useThemedStyles(getHeroCarouselStyles);

  // Ref to the FlatList for programmatic scrolling and index management
  const flatListRef = useRef<Animated.FlatList<CarouselItem>>(null);

  // state to store the current slide index
  const [currentIndex, setCurrentIndex] = useState(0);

  // Shared value to control auto-scrolling behavior and pause/resume
  const isAutoScroll = useSharedValue<boolean>(true);

  // Ref to store the auto-scroll interval timer for cleanup
  const autoScrollInterval = useRef<NodeJS.Timeout | null>(null);

  // Ref to track if auto-scrolling is currently active to prevent duplicate intervals
  const isAutoScrolling = useRef(false);

  const scrollItemWidth = useRef(SCREEN_WIDTH / 2);

  /**
   * Handles layout changes and updates the carousel width
   * This ensures proper slide width calculations when the screen size changes
   * @param event - The layout change event containing the new dimensions
   */
  const onLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    if (width > 0 && width !== layoutWidth) {
      setLayoutWidth(width);
    }
  };

  /**
   * Scrolls to a specific slide index using the real item width.
   * Uses scrollToOffset with the Fabric-corrected item width to ensure
   * each scroll advances exactly one slide.
   * @param index - The target slide index to scroll to
   */
  const scrollToIndex = useCallback(
    (index: number, animated = true) => {
      if (layoutWidth === 0 || !flatListRef.current) {
        return;
      }
      const offset = index * scrollItemWidth.current;
      // @ts-ignore - scrollToOffset exists on Animated.FlatList
      flatListRef.current.scrollToOffset({ offset, animated });
    },
    [layoutWidth],
  );

  /**
   * Handles scroll events and updates the current index
   * Also pauses auto-scrolling when user interaction is detected
   * @param event - The scroll event containing offset information
   */
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      const offsetX = event.contentOffset.x;
      const index = Math.round(offsetX / scrollItemWidth.current);
      runOnJS(setCurrentIndex)(index);
      isAutoScroll.value = false;
    },
  });

  /**
   * Effect to handle auto-scrolling behavior
   * Starts the auto-scroll interval when the component is ready
   * Cleans up the interval when the component unmounts
   */
  useEffect(() => {
    if (isAutoScrolling.current) {
      return;
    }

    autoScrollInterval.current = setInterval(() => {
      if (currentIndex < data.length - 1) {
        scrollToIndex(currentIndex + 1);
      }
    }, autoInterval);

    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, [currentIndex, data.length, autoInterval, scrollToIndex]);

  /**
   * Handles TV remote control events (DPAD navigation)
   * Pauses auto-scrolling during navigation and resumes after
   * @param evt - The hardware event from the TV remote
   */
  useFocusGuideEventHandler((evt: HWEvent) => {
    if (!isTV || !isFocused) {
      return;
    }

    if (evt.eventKeyAction === EVENT_KEY_DOWN) {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
        autoScrollInterval.current = null;
      }

      if (evt.eventType === DPADEventType.RIGHT) {
        if (currentIndex < data.length - 1) {
          scrollToIndex(currentIndex + 1);
        }
      }

      if (evt.eventType === DPADEventType.LEFT) {
        if (currentIndex > 0) {
          scrollToIndex(currentIndex - 1);
        }
      }
    }

    if (evt.eventKeyAction === EVENT_KEY_UP) {
      if (!autoScrollInterval.current) {
        autoScrollInterval.current = setInterval(() => {
          if (currentIndex < data.length - 1) {
            scrollToIndex(currentIndex + 1);
          }
        }, autoInterval);
      }
    }
  });

  const itemStyle = useMemo(
    () => [styles.renderItemContainer, { width: layoutWidth }],
    [styles.renderItemContainer, layoutWidth],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: CarouselItem; index: number }) => (
      <View style={itemStyle}>
        <Slide
          index={index}
          title={item.title}
          description={item.description}
          bgColor={item.bgColor}
          backgroundImage={item.backgroundImage}
        />
      </View>
    ),
    [itemStyle],
  );

  const handlePress = (index: number) => {
    onPress?.(index);
    setIsFocused(true);
  };

  const handleFocus = (index: number) => {
    onFocus?.(index);
    setIsFocused(true);
  };

  const handleBlur = (index: number) => {
    onBlur?.(index);
    setIsFocused(false);
  };

  return (
    <Pressable
      ref={pressableRef}
      role="button"
      style={[
        styles.container,
        { backgroundColor: isDarkTheme ? backgroundColor : colors.transparent },
      ]}
      onLayout={onLayout}
      focusable
      hasTVPreferredFocus
      onFocus={() => handleFocus(currentIndex)}
      onBlur={() => handleBlur(currentIndex)}
      onPress={() => handlePress(currentIndex)}
      testID={testID}
    >
      <Animated.FlatList
        // @ts-ignore - ref is not typed, Reanimated issue
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => `item-${index}-${item.title}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={layoutWidth}
        snapToAlignment="start"
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        scrollEnabled={!isTV}
        getItemLayout={(_, index) => ({
          length: layoutWidth,
          offset: layoutWidth * index,
          index,
        })}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        removeClippedSubviews
      />

      <View style={styles.dotContainer}>
        {data.map((_, i) => (
          <Dot key={`dot-${i}`} index={i} currentIndex={currentIndex} />
        ))}
      </View>
    </Pressable>
  );
};
