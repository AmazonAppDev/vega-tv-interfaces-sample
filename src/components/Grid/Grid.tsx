import React, { useRef, useState, useCallback } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { ActivityIndicator, Dimensions, View } from 'react-native';

import { FlashList } from '@amazon-devices/shopify__flash-list';

import { useThemedStyles } from '@AppTheme';
import { ExampleModal } from '@AppComponents/ExampleModal/ExampleModal';
import { FocusGuideView } from '@AppServices/focusGuide';
import { GridItem } from './GridItem';
import { GridStyle } from './styles';

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

export const COLUMNS = 6;
export const IMAGE_ASPECT_RATIO = 695 / 360;
export const BASE_ITEM_WIDTH = 360;
export const BASE_GRID_ITEM_HEIGHT = Math.floor(
  BASE_ITEM_WIDTH * IMAGE_ASPECT_RATIO,
);
export const BASE_MARGIN = 40;
const TOTAL_MARGIN = BASE_MARGIN * (COLUMNS - 1);
const AVAILABLE_WIDTH = SCREEN_WIDTH * 0.9 - TOTAL_MARGIN;

export const ITEM_WIDTH = Math.floor(AVAILABLE_WIDTH / COLUMNS);
export const GRID_ITEM_HEIGHT = Math.floor(ITEM_WIDTH * IMAGE_ASPECT_RATIO);
const MIN_ITEM_WIDTH = 200;
export const ITEM_WIDTH_FINAL = Math.max(ITEM_WIDTH, MIN_ITEM_WIDTH);

export const GRID_ITEM_HEIGHT_FINAL = Math.max(
  GRID_ITEM_HEIGHT,
  MIN_ITEM_WIDTH * IMAGE_ASPECT_RATIO,
);
export const MARGIN = BASE_MARGIN;
export const TOTAL_ITEM_WIDTH = ITEM_WIDTH_FINAL + MARGIN;
export const TOTAL_WIDTH = Math.min(
  TOTAL_ITEM_WIDTH * COLUMNS,
  SCREEN_WIDTH * 0.9,
);

/**
 * Explanation for the 120px correction in layout size:
 *
 * 1. FlashList Uses Estimated Sizes:
 *    - FlashList relies on estimated sizes for rendering optimization.
 *    - Incorrect estimates can lead to performance issues or visual glitches.
 *    - The 120px correction likely adjusts for overestimation, ensuring proper item calculation.
 *
 * 2. Hidden Margins, Padding, and Scaling Effects:
 *    - Grid items are wrapped and may have scaling (e.g., transform: [{ scale: 1.1 }]).
 *    - This scaling and any additional padding/margins are not automatically accounted for.
 *    - The 120px adjustment compensates for these extra pixels.
 *
 * 3. Preventing Over-Rendering:
 *    - Overestimated item sizes lead to fewer items rendered and empty gaps.
 *    - Reducing layout.size by 120px aligns estimated and actual sizes, preventing re-renders.
 *
 * 4. The 360x540 Image Size Is Not the Full Story:
 *    - Grid items include borders, padding, and other layout constraints.
 *    - The 120px correction accounts for these additional layout elements.
 *
 * 5. Ensuring Consistent Scroll Behavior:
 *    - Correcting the item height ensures smooth and consistent scrolling.
 *    - Aligns the virtualized list with real item sizes.
 */
const FLASHLIST_CORRECTION = 120;

interface GridItemProps {
  id: string;
  title: string;
  imageUrl: string;
}

interface GridProps {
  items: GridItemProps[];
  isFetching?: boolean;
  isLoading?: boolean;
  onEndReached?: () => void;
  isFetchingNextPage?: boolean;
}

const MemoizedGridItem = React.memo(GridItem);

export const Grid = ({
  items,
  isFetching,
  isLoading,
  isFetchingNextPage,
  onEndReached,
}: GridProps) => {
  const [listSize, setListSize] = useState({
    width: TOTAL_WIDTH,
    height: SCREEN_HEIGHT - 220,
  });

  const styles = useThemedStyles(GridStyle);
  const listRef = useRef<FlashList<GridItemProps>>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const renderItem = useCallback(
    ({ item }: { item: GridItemProps }) => (
      <View style={styles.gridItemWrapper}>
        <MemoizedGridItem
          id={item.id}
          imageUrl={item.imageUrl}
          onPress={() => setSelectedImage(item.imageUrl)}
        />
      </View>
    ),
    [styles.gridItemWrapper],
  );

  /**
   * Handles the layout measurement of the grid container and updates the list size state.
   * This is crucial for FlashList's performance optimization as it:
   * 1. Provides accurate dimensions for virtual rendering calculations
   * 2. Helps FlashList determine the visible area and optimize item rendering
   * 3. Ensures proper initial rendering and scrolling behavior
   * 4. Improves the performance of the grid by reducing unnecessary re-renders
   *
   * Without it FlashList will try to render all items at once, which can lead to performance
   * issues because of the large number of items and we will have a lot of re-renders since
   * the Virtualization will be disabled.
   * @param event - Layout event containing width and height measurements
   */
  const handleGridContainerLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setListSize({ width, height });
    }
  }, []);

  if ((isFetching || isLoading) && items.length === 0) {
    return <ActivityIndicator />;
  }

  return (
    <FocusGuideView autoFocus trapFocusRight>
      <View style={styles.grid}>
        <View style={styles.gridContainer} onLayout={handleGridContainerLayout}>
          <FlashList
            ref={listRef}
            data={items}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            numColumns={COLUMNS}
            estimatedItemSize={GRID_ITEM_HEIGHT_FINAL}
            estimatedListSize={listSize}
            removeClippedSubviews
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            bounces={false}
            overrideItemLayout={layout => {
              layout.size = GRID_ITEM_HEIGHT_FINAL - FLASHLIST_CORRECTION;
            }}
            ListFooterComponent={() => {
              if (isFetchingNextPage && items.length > 0) {
                return <ActivityIndicator />;
              }
              return null;
            }}
            scrollEventThrottle={20}
            decelerationRate={0.92}
          />
        </View>
        {selectedImage && (
          <ExampleModal
            isVisible={true}
            imageUrl={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </View>
    </FocusGuideView>
  );
};
