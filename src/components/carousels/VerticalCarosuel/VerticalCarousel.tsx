import React, { useCallback, useRef, useState } from 'react';
import {
  type View as ViewType,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { FlashList, type FlashListRef } from '@shopify/flash-list';

import { useThemedStyles } from '@AppTheme';
import { ImageTile } from '@AppComponents/core';
import { Box } from '@AppComponents/core/Box/Box';
import type { Item } from '@AppScreens/Components/VerticalStack';
import { useItemFocusManager } from '@AppSrc/hooks/useItemFocusManager';
import { getBirdImageUrl } from '@AppUtils/birdImageUtils';
import { scale } from '@AppUtils/scale';
import { getVerticalStackStyles } from './styles';

export const VerticalCarousel = ({ data }: { data: Item[] }) => {
  const styles = useThemedStyles(getVerticalStackStyles);
  const flashListRef = useRef<FlashListRef<Item>>(null);
  const itemRefs = useRef<Array<ViewType | null>>([]);
  const [albumIndex, setAlbumIndex] = useState(1);

  const handleChildRefsUpdate = useItemFocusManager<Item>({
    itemRefs,
    flashListRef,
    dataLength: data.length,
  });

  const ItemView = useCallback(
    ({ item, index }: { item: Item; index: number }) => {
      return (
        <Box
          ref={handleChildRefsUpdate(index)}
          style={[styles.box]}
          testID={`box-${item.id}`}
          hasTVPreferredFocus={index === 0}
          focusStyle={styles.boxFocused}
          pressableStyle={styles.boxPressed}
          onFocus={() => setAlbumIndex(index + 1)}
          onPress={() => setAlbumIndex(index + 1)}
        >
          <View style={[styles.boxContainer]}>
            <View style={[styles.column, styles.avatarContainer]}>
              <TouchableOpacity style={styles.playButton} role="button">
                <Text style={styles.playButtonText}>Play</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.column, styles.boxTextContainer]}>
              <Text style={styles.title}>{item.title}</Text>
              <View style={styles.dateContainer}>
                <Text style={styles.date}>{item.date}</Text>
                <Text style={styles.bullet}> • </Text>
                <Text style={styles.duration}>{item.duration}</Text>
              </View>
              <Text style={styles.shortDescription}>
                {item.shortDescription}
              </Text>
            </View>
          </View>
        </Box>
      );
    },
    [styles, handleChildRefsUpdate],
  );

  const keyProvider = useCallback(
    (item: Item, index: number) => `vertical-carousel-${item.id}-${index}`,
    [],
  );

  return (
    <View style={[styles.container]}>
      <View style={styles.column}>
        <View style={styles.leftContainer}>
          <View style={styles.leftContent}>
            <View style={styles.imageContainer}>
              <ImageTile
                testID={`vertical-carousel-image-${albumIndex}`}
                style={styles.image}
                width={scale(340)}
                height={scale(540)}
                imageUrl={getBirdImageUrl(albumIndex)}
              />
            </View>
          </View>
        </View>
      </View>
      <View style={[styles.column]}>
        <View style={styles.rightContainer}>
          <Text style={styles.headerText}>Shopify FlashList</Text>
          <FlashList
            ref={flashListRef}
            data={data}
            renderItem={ItemView}
            keyExtractor={keyProvider}
            horizontal={false}
            bounces={false}
            initialScrollIndex={0}
            scrollEnabled={true}
            removeClippedSubviews={false}
            drawDistance={Number.MAX_SAFE_INTEGER}
          />
        </View>
      </View>
    </View>
  );
};
