import React from 'react';

import type { InfiniteData } from '@tanstack/react-query';
import { useInfiniteQuery } from '@tanstack/react-query';

import type { BirdItem } from '@AppUtils/birdImageUtils';
import {
  checkBirdImageExists,
  getBirdImageUrl,
} from '@AppUtils/birdImageUtils';

interface QueryResponse {
  items: Array<BirdItem>;
  nextPage: number | undefined;
}

export const useVerticalPosters = () => {
  const ITEMS_PER_PAGE = 24;

  const {
    data,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery<
    QueryResponse,
    Error,
    InfiniteData<QueryResponse>,
    [string],
    number
  >({
    queryKey: ['verticalPosters'],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const startIndex = pageParam;
      const endIndex = startIndex + ITEMS_PER_PAGE - 1;

      const firstImageExists = await checkBirdImageExists(startIndex);
      if (!firstImageExists) {
        return { items: [], nextPage: undefined };
      }

      let actualLastIndex = endIndex;
      const lastImageExists = await checkBirdImageExists(endIndex);

      if (!lastImageExists) {
        let left = startIndex;
        let right = endIndex;
        while (left <= right) {
          const mid = Math.floor((left + right) / 2);
          const exists = await checkBirdImageExists(mid);
          if (exists) {
            left = mid + 1;
            actualLastIndex = mid;
          } else {
            right = mid - 1;
          }
        }
      }

      const items = Array.from(
        { length: actualLastIndex - startIndex + 1 },
        (_, batchIndex) => {
          const birdIndex = startIndex + batchIndex;
          return {
            id: `${birdIndex}`,
            title: `Bird ${birdIndex}`,
            imageUrl: getBirdImageUrl(birdIndex),
            index: birdIndex - 1,
            rowIndex: Math.floor((birdIndex - 1) / ITEMS_PER_PAGE) + 1,
            itemId: `item-${birdIndex}`,
          };
        },
      );

      return {
        items,
        nextPage: lastImageExists ? actualLastIndex + 1 : undefined,
      };
    },
    getNextPageParam: lastPage => lastPage.nextPage,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
  });

  const { ids, byId } = React.useMemo(() => {
    const allIds: Array<string> = [];
    const allById: Record<string, BirdItem> = {};

    if (data?.pages) {
      data.pages.forEach(page => {
        page.items.forEach(item => {
          if (!allById[item.id]) {
            allIds.push(item.id);
            allById[item.id] = item;
          }
        });
      });
    }

    return { ids: allIds, byId: allById };
  }, [data?.pages]);

  return {
    ids,
    byId,
    items: data?.pages.flatMap(page => page.items) ?? [],
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  };
};
