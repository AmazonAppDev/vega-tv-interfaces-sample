import React, { memo, useCallback, useRef, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { FlashList, type FlashListRef } from '@shopify/flash-list';

import { useThemedStyles } from '@AppTheme';
import {
  getCardHeight,
  usePosterRowsWithSkeletonPreload,
} from '@AppSrc/hooks/usePosterSections';
import type {
  LayoutConfig,
  PosterRowData,
} from '@AppSrc/hooks/usePosterSections';
import { POSTER_ROW_VARIATIONS } from './helpers';
import { getFlexibleCardStyle } from './styles';

// Type for carousel items
type CarouselItem = {
  id: string;
  title: string;
  description: string;
  bgColor: string;
  backgroundImage?: string;
};

// Hardcoded data for the hero carousel
const carouselData: Array<CarouselItem> = [
  {
    id: '1',
    bgColor: 'plum',
    title: 'Title 1',
    description:
      'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
  },
  {
    id: '2',
    bgColor: 'orange',
    title: 'Title 2',
    description:
      'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
  },
  {
    id: '3',
    bgColor: 'orangered',
    title: 'Title 3',
    description:
      'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
  },
  {
    id: '4',
    bgColor: 'purple',
    title: 'Title 4',
    description:
      'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
  },
  {
    id: '5',
    bgColor: 'burlywood',
    title: 'Title 5',
    description:
      'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
  },
  {
    id: '6',
    bgColor: 'darkgreen',
    title: 'Title 6',
    description:
      'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
  },
];

const CAROUSEL_ROW_DISTANCE = 895;
const FLASHLIST_FILLER = 169;

export const FlexibleCardGrid = memo(() => {
  const styles = useThemedStyles(getFlexibleCardStyle);

  const verticalRef = useRef<FlashListRef<PosterRowData>>(null);

  const [visibleRowIndices, setVisibleRowIndices] = useState<Set<number>>(
    new Set(),
  );

  // Use the enhanced hook with skeleton preloading
  const {
    rows: contentRows,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePosterRowsWithSkeletonPreload();

  const rows: PosterRowData[] = useMemo(() => {
    return [{ type: 'hero' } as const, ...contentRows];
  }, [contentRows]);

  // Trigger pagination when focus approaches the end of loaded rows
  const onRowFocus = useCallback(
    (rowIndex: number) => {
      const totalRows = rows.length;
      if (hasNextPage && rowIndex >= totalRows - 3) {
        void fetchNextPage();
      }
    },
    [rows.length, hasNextPage, fetchNextPage],
  );

  const renderItem = useCallback(
    ({ item }: { item: PosterRowData }) => {
      const HeroRow = POSTER_ROW_VARIATIONS['hero'];

      if (item.type === 'hero') {
        return (
          <HeroRow
            row={item}
            verticalRef={verticalRef}
            styles={styles}
            carouselData={carouselData}
          />
        );
      }

      // For 'row' and 'skeleton' types, use the 'row' component
      const RowComponent = POSTER_ROW_VARIATIONS['row'];
      return (
        <RowComponent
          row={item}
          visibleRowIndices={visibleRowIndices}
          onRowFocus={onRowFocus}
        />
      );
    },
    [styles, visibleRowIndices, onRowFocus],
  );

  /**
   * Returns the total visual height of a row based on the card layout.
   *
   * FlashList requires an accurate layout size for each item to avoid scroll jump issues.
   * `getCardHeight()` only returns the height of the card itself, not the full row.
   *
   * The extra `FLASHLIST_FILLER` accounts for additional vertical space in the row, such as:
   * - Section headings or titles above the cards
   * - Vertical padding or margins in the row container
   * - Gaps between cards (`rowGap`)
   * - Extra spacing from wrappers like FocusGuideView
   * - Any visual offset introduced by transforms or shadows
   *
   * If this value is underestimated, FlashList will miscalculate scroll offsets,
   * potentially leading to items being partially cut off or scrollToIndex landing incorrectly.
   */
  const getRowHeight = (layout: LayoutConfig): number => {
    return getCardHeight(layout.size, layout.direction) + FLASHLIST_FILLER;
  };

  const overrideItemLayout = useCallback(
    (
      layout: {
        span?: number;
        size?: number;
      },
      item: PosterRowData,
    ) => {
      if (item.type === 'hero') {
        layout.size = CAROUSEL_ROW_DISTANCE;
      } else {
        layout.size = getRowHeight(item.layoutConfig);
      }
    },
    [],
  );

  const getItemType = useCallback((item: PosterRowData) => {
    return item.type;
  }, []);

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<{ item: PosterRowData }> }) => {
      const newVisible = new Set<number>();

      for (const vi of viewableItems) {
        if (vi.item.type === 'row') {
          newVisible.add(vi.item.rowIndex);
        }
      }

      setVisibleRowIndices(newVisible);
    },
    [],
  );

  return (
    <View style={styles.gridContainer}>
      {isFetchingNextPage && (
        <ActivityIndicator
          style={styles.activityIndicator}
          size="large"
          color="white"
        />
      )}
      <FlashList<PosterRowData>
        ref={verticalRef}
        data={rows}
        keyExtractor={item =>
          item.type === 'hero' ? 'hero-carousel' : `row-${item.rowIndex}`
        }
        renderItem={renderItem}
        getItemType={getItemType}
        overrideItemLayout={overrideItemLayout}
        drawDistance={Number.MAX_SAFE_INTEGER}
        scrollEnabled={true}
        removeClippedSubviews={false}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={2}
        scrollEventThrottle={20}
        decelerationRate={0.92}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 20,
          minimumViewTime: 100,
        }}
      />
    </View>
  );
});
