import React, { memo, useCallback, useMemo, useRef } from 'react';
import { Dimensions, Text } from 'react-native';

import { FlashList } from '@amazon-devices/shopify__flash-list';

import { useAppTheme, useThemedStyles } from '@AppTheme';
import { FlexibleCard } from '@AppComponents/FlexibleCard';
import { getHomeStyles } from '@AppScreens/Home';
import { FocusGuideView } from '@AppServices/focusGuide';
import { getCardHeight, getCardWidth } from '@AppSrc/hooks/usePosterSections';
import type { ContentRow } from '@AppSrc/hooks/usePosterSections';
import type { BirdItemHome } from '@AppUtils/birdImageUtils';

const SCREEN_WIDTH = Dimensions.get('window').width;

export interface FlexibleCardRowProps {
  row: ContentRow;
  scrollVertically?: (rowIndex: number) => void;
  visibleRowIndices?: Set<number>;
}

const FLASHLIST_FILLER = 20;

export const FlexibleCardRow = memo(
  ({ row, scrollVertically, visibleRowIndices }: FlexibleCardRowProps) => {
    const { isDarkTheme } = useAppTheme();
    const styles = useThemedStyles(getHomeStyles);
    const horizontalRef = useRef<FlashList<BirdItemHome>>(null);

    const scrollHorizontallyInternal = useCallback((index: number) => {
      horizontalRef.current?.scrollToIndex({
        animated: true,
        index,
        viewPosition: 0,
      });
    }, []);

    const renderItem = useCallback(
      ({ item, index }: { item: BirdItemHome; index: number }) => {
        return (
          <FlexibleCard
            index={index}
            rowIndex={row.type === 'row' ? row.rowIndex : 0}
            imageUrl={item.imageUrl}
            direction={item.layoutConfig?.direction ?? 'horizontal'}
            size={item.layoutConfig?.size ?? 'medium'}
            animations={item.layoutConfig?.animations ?? 'zoomIn'}
            scroll={{
              vertically: scrollVertically,
              horizontally: i => scrollHorizontallyInternal(i),
            }}
            isSkeleton={item.isSkeleton}
            isRowVisible={visibleRowIndices?.has(row.rowIndex)}
          >
            {row.type === 'row' && row.rowIndex % 2 === 0 && (
              <Text
                style={styles.childText}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                Lorem ipsum dolor sit amet consectetur adipiscing elit sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Text>
            )}
          </FlexibleCard>
        );
      },
      [
        row.type,
        row.rowIndex,
        scrollVertically,
        visibleRowIndices,
        styles.childText,
        scrollHorizontallyInternal,
      ],
    );

    /**
     * Estimates the total width of a horizontal item (card + spacing) for FlashList.
     *
     * FlashList uses `estimatedItemSize` to optimize rendering and layout calculations,
     * especially for virtualized horizontal lists.
     *
     * `getCardWidth()` returns the base width of the card based on its layout configuration,
     * but doesn't include:
     * - Horizontal gaps between cards (`columnGap`)
     * - Padding/margin from the row container
     * - Borders or shadows extending beyond the card
     *
     * The `FLASHLIST_FILLER` (20px) compensates for those visual extras, ensuring
     * the estimate aligns with what is actually rendered on screen.
     * Underestimating this can lead to broken snapping or premature onEndReached triggers.
     */
    const estimatedItemSize = useMemo(() => {
      return (
        getCardWidth(row.layoutConfig.size, row.layoutConfig.direction) +
        FLASHLIST_FILLER
      );
    }, [row.layoutConfig.size, row.layoutConfig.direction]);

    return (
      <FocusGuideView
        autoFocus
        trapFocusRight
        style={[
          styles.rowContainer,
          {
            minHeight: getCardHeight(
              row.layoutConfig.size,
              row.layoutConfig.direction,
            ),
          },
        ]}
      >
        <Text style={styles.text}>{row.type === 'row' ? row.title : ''}</Text>
        <FlashList
          key={isDarkTheme ? 'dark' : 'light'}
          ref={horizontalRef}
          data={row.type === 'row' ? row.data : []}
          renderItem={renderItem}
          keyExtractor={item => item.itemId}
          horizontal
          scrollEnabled={false}
          removeClippedSubviews
          bounces={false}
          estimatedItemSize={estimatedItemSize}
          drawDistance={SCREEN_WIDTH * 0.9}
        />
      </FocusGuideView>
    );
  },
  (prev, next) =>
    prev.row.type === 'row' &&
    next.row.type === 'row' &&
    prev.row.rowIndex === next.row.rowIndex,
);
