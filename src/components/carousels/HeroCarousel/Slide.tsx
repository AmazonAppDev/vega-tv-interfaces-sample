import React from 'react';
import { Text, View, Pressable, Image } from 'react-native';

import Animated from '@amazon-devices/react-native-reanimated';

import { useThemedStyles } from '@AppTheme';
import { getHeroCarouselStyles } from './styles';

/**
 * Props for the Slide component in the Hero Carousel.
 * @typedef {Object} SlideProps
 *
 * @property {Object} Content
 * @property {string} Content.title - The main heading text displayed on the slide
 * @property {string} Content.description - The descriptive text shown below the title
 * @property {React.ReactNode} [Content.children] - Optional additional content rendered below description
 *
 * @property {Object} Styling
 * @property {string} Styling.bgColor - The background color of the slide
 * @property {string} [Styling.backgroundImage] - Optional URL for a background image that covers the slide
 *
 * @property {Object} Navigation
 * @property {number} Navigation.index - Zero-based index of the slide in the carousel
 *
 * @property {Object} Interactions
 * @property {(index: number) => void} [Interactions.onPressSlide] - Callback triggered when slide is pressed/clicked
 * @property {() => void} [Interactions.onFocusSlide] - Callback triggered when slide receives focus (useful for TV navigation)
 */
type SlideProps = {
  // Content
  title: string;
  description: string;
  children?: React.ReactNode;

  // Styling
  bgColor: string;
  backgroundImage?: string;

  // Navigation
  index: number;

  // Interactions
  onPressSlide?: (index: number) => void;
  onFocusSlide?: () => void;
};

const AnimatedImage = Animated.createAnimatedComponent(Image);

/**
 * A slide component for use within a hero carousel.
 *
 * This component represents an individual slide in a carousel, featuring:
 * - A title and description
 * - Optional background image
 * - Customizable background color
 * - TV focus support
 * - Touch/click interaction
 * - Custom child content support
 *
 * @example
 * ```tsx
 * <Slide
 *   index={0}
 *   title="Welcome"
 *   description="Discover amazing content"
 *   bgColor="#f5f5f5"
 *   backgroundImage="https://example.com/image.jpg"
 *   onPressSlide={(index) => console.log(`Slide ${index} pressed`)}
 * />
 * ```
 */
const SlideComponent: React.FC<SlideProps> = ({
  index,
  title,
  description,
  bgColor,
  onPressSlide,
  onFocusSlide,
  children,
  backgroundImage,
}: SlideProps) => {
  const styles = useThemedStyles(getHeroCarouselStyles);
  return (
    <View style={styles.slideContainer}>
      <Pressable
        role="button"
        hasTVPreferredFocus={index === 0}
        focusable
        onPress={() => onPressSlide?.(index)}
        onFocus={onFocusSlide}
        style={[styles.slide, { backgroundColor: bgColor }]}
        testID={`hero-carousel-slide-${index + 1}`}
      >
        {backgroundImage && (
          <AnimatedImage
            source={{ uri: backgroundImage }}
            style={[styles.backgroundImage]}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
            testID={`hero-carousel-slide-image-${index + 1}`}
          />
        )}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          {children && <View style={styles.childrenContainer}>{children}</View>}
        </View>
      </Pressable>
    </View>
  );
};

export const Slide = React.memo(SlideComponent);
