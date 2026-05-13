import React, { useRef, useState, useCallback } from 'react';
import { ActivityIndicator, Dimensions, View } from 'react-native';

import { FlashList, type FlashListRef } from '@shopify/flash-list';

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
  const styles = useThemedStyles(GridStyle);
  const listRef = useRef<FlashListRef<GridItemProps>>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const renderItem = useCallback(
    ({ item, index }: { item: GridItemProps; index: number }) => (
      <View
        style={styles.gridItemWrapper}
        onFocus={() => {
          if (index >= items.length - COLUMNS * 3) {
            onEndReached?.();
          }
        }}
      >
        <MemoizedGridItem
          id={item.id}
          imageUrl={item.imageUrl}
          onPress={() => setSelectedImage(item.imageUrl)}
        />
      </View>
    ),
    [styles.gridItemWrapper, items.length, onEndReached],
  );

  if ((isFetching || isLoading) && items.length === 0) {
    return <ActivityIndicator />;
  }

  return (
    <FocusGuideView autoFocus trapFocusRight>
      <View style={styles.grid}>
        <View style={styles.gridContainer}>
          <FlashList
            ref={listRef}
            data={items}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            numColumns={COLUMNS}
            removeClippedSubviews={false}
            scrollEnabled={true}
            drawDistance={Number.MAX_SAFE_INTEGER}
            onEndReached={onEndReached}
            onEndReachedThreshold={2}
            bounces={false}
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
