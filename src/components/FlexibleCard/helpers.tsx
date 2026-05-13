import React, { memo } from 'react';
import { type ViewStyle } from 'react-native';

import type { FlashListRef } from '@shopify/flash-list';

import { FlexibleCardRow } from '@AppComponents/FlexibleCard/FlexibleCardRow';
import type { FlexibleCardRowProps } from '@AppComponents/FlexibleCard/FlexibleCardRow';
import { HeroCarousel } from '@AppComponents/carousels/HeroCarousel';
import { FocusGuideView } from '@AppServices/focusGuide';
import type {
  LayoutConfig,
  PosterRowData,
} from '@AppSrc/hooks/usePosterSections';
import type { BirdItemHome } from '@AppUtils/birdImageUtils';

// ──────────────── SHARED TYPES ────────────────

/**
 * Represents a carousel item with its display properties
 */
type CarouselItem = {
  id: string;
  title: string;
  description: string;
  bgColor: string;
  backgroundImage?: string;
};

// ──────────────── COMPONENT-SPECIFIC PROPS ────────────────

/**
 * Props for the HeroRow component which displays a featured carousel
 */
interface HeroRowProps {
  row: PosterRowData;
  verticalRef: React.RefObject<FlashListRef<PosterRowData> | null>;
  styles: {
    carouselContainer: ViewStyle;
  };
  carouselData: CarouselItem[];
}

/**
 * Props for generic row components that can be either regular or vertical layouts
 */
interface GenericRowProps {
  row: PosterRowData;
  visibleRowIndices?: Set<number>;
  onRowFocus?: (rowIndex: number) => void;
}

// ──────────────── COMPARATORS ────────────────

const checkIfHeroRowDataSame = (
  prevProps: HeroRowProps,
  nextProps: HeroRowProps,
) =>
  prevProps.row === nextProps.row &&
  prevProps.verticalRef === nextProps.verticalRef &&
  prevProps.styles === nextProps.styles &&
  prevProps.carouselData === nextProps.carouselData;

const checkIfGenericRowDataSame = (
  prevProps: GenericRowProps,
  nextProps: GenericRowProps,
) =>
  prevProps.row === nextProps.row &&
  prevProps.visibleRowIndices === nextProps.visibleRowIndices &&
  prevProps.onRowFocus === nextProps.onRowFocus;

const checkIfFlexibleRowDataSame = (
  prevProps: FlexibleCardRowProps,
  nextProps: FlexibleCardRowProps,
) => prevProps.row === nextProps.row;

// ──────────────── ROW COMPONENTS ────────────────

/**
 * HeroRow Component
 * Displays a featured carousel at the top of the content
 * Includes auto-focus behavior and automatic scrolling to the top when focused
 */
const HeroRow = memo(({ verticalRef, styles, carouselData }: HeroRowProps) => {
  return (
    <FocusGuideView
      autoFocus
      trapFocusRight
      style={styles.carouselContainer}
      // @ts-ignore - FocusGuideView is not typed but should support onFocus
      onFocus={() => {
        requestAnimationFrame(() => {
          void verticalRef.current?.scrollToIndex({
            animated: false,
            index: 0,
            viewPosition: 0,
          });
        });
      }}
    >
      <HeroCarousel data={carouselData} autoInterval={5000} />
    </FocusGuideView>
  );
}, checkIfHeroRowDataSame);

/**
 * GenericCardRow Component
 * A flexible row component that can display different types of content
 * Renders a FlexibleCardRow for non-hero content types
 */
const GenericCardRow = memo(
  ({ row, visibleRowIndices, onRowFocus }: GenericRowProps) => {
    if (row.type === 'hero') {
      return null;
    }

    return (
      <FlexibleCardRow
        row={row}
        visibleRowIndices={visibleRowIndices}
        onRowFocus={onRowFocus}
      />
    );
  },
  checkIfGenericRowDataSame,
);

/**
 * FlexibleRow Component
 * A memoized wrapper around FlexibleCardRow for optimized rendering
 * Used for standard row layouts with vertical scrolling capability
 */
const FlexibleRow = memo(FlexibleCardRow, checkIfFlexibleRowDataSame);

// ──────────────── VARIATION REGISTRY ────────────────

/**
 * Registry of all available row component variations
 * Maps row types to their corresponding components:
 * - hero: Featured carousel at the top
 * - regular: Standard card layout
 * - vertical: Vertically stacked cards
 * - row: Flexible row layout
 */
export const POSTER_ROW_VARIATIONS = {
  hero: HeroRow,
  regular: GenericCardRow,
  vertical: GenericCardRow,
  row: FlexibleRow,
} as const;

// ──────────────── TYPE MAPS ────────────────

export type PosterRowComponentMap = typeof POSTER_ROW_VARIATIONS;
export type PosterRowType = keyof PosterRowComponentMap;

export type PosterRowPropsMap = {
  hero: HeroRowProps;
  row: {
    data: BirdItemHome[];
    layout: LayoutConfig;
    scrollHorizontally?: (rowIndex: number, index: number) => void;
  };
};
