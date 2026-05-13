import React, { memo, useCallback } from 'react';
import { Dimensions, Text } from 'react-native';

import { FlashList } from '@shopify/flash-list';

import { useAppTheme, useThemedStyles } from '@AppTheme';
import { FlexibleCard } from '@AppComponents/FlexibleCard';
import { getHomeStyles } from '@AppScreens/Home';
import { FocusGuideView } from '@AppServices/focusGuide';
import { getCardHeight } from '@AppSrc/hooks/usePosterSections';
import type { ContentRow } from '@AppSrc/hooks/usePosterSections';
import type { BirdItemHome } from '@AppUtils/birdImageUtils';

const SCREEN_WIDTH = Dimensions.get('window').width;

export interface FlexibleCardRowProps {
  row: ContentRow;
  visibleRowIndices?: Set<number>;
  onRowFocus?: (rowIndex: number) => void;
}

export const FlexibleCardRow = memo(
  ({ row, visibleRowIndices, onRowFocus }: FlexibleCardRowProps) => {
    const { isDarkTheme } = useAppTheme();
    const styles = useThemedStyles(getHomeStyles);

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
      [row.type, row.rowIndex, visibleRowIndices, styles.childText],
    );

    return (
      <FocusGuideView
        autoFocus
        trapFocusRight
        // @ts-ignore
        onFocus={() => {
          if (row.type === 'row') {
            onRowFocus?.(row.rowIndex);
          }
        }}
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
          style={styles.flashListHorizontal}
          data={row.type === 'row' ? row.data : []}
          renderItem={renderItem}
          keyExtractor={item => item.itemId}
          horizontal
          scrollEnabled={true}
          removeClippedSubviews={false}
          bounces={false}
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
