/**
 * Poster Sections Layout System
 *
 * This module manages the layout and organization of poster/card sections in a grid-based interface.
 * It's designed to create a dynamic, responsive layout system similar to streaming platforms like Netflix.
 *
 * Key Features:
 * 1. Flexible Card Sizes: Supports small, medium, and large card sizes
 * 2. Multiple Layout Directions: Horizontal and vertical arrangements
 * 3. Dynamic Row Generation: Creates rows with varying configurations
 * 4. Responsive Image Handling: Supports multiple image resolutions
 *
 * Main Components:
 * - Card Layouts: Defines dimensions and spacing for different card sizes
 * - Row Configurations: Manages row heights, widths, and item counts
 * - Layout Generation: Creates a structured layout with hero and content rows
 */

/**
 * HorizontalPosters contains an array of image URLs for horizontal card layouts.
 * These images are optimized for 16:9 aspect ratio display.
 */

import { useState, useEffect } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';

import HorizontalPosters from '@AppSrc/data/horizontal';
/**
 * VerticalPosters contains an array of image URLs for vertical card layouts.
 * These images are optimized for poster-style (portrait) display.
 */
import VerticalPosters from '@AppSrc/data/vertical';
/**
 * BirdItemHome type represents the structure of individual bird items in the layout.
 * It contains essential information for rendering each card including:
 * - id: Unique identifier for the item
 * - imageUrl: Source URL for the bird image
 * - index: Position within its row
 * - rowIndex: Position of the row in the layout
 * - title: Display name for the bird
 * - layoutConfig: Size and animation settings
 * - resolutions: Different image sizes for responsive loading
 */
import type { BirdItemHome } from '@AppUtils/birdImageUtils';

/**
 * Gets card dimensions based on size and direction
 * @param {CardSize} size - Card size (small, medium, large)
 * @param {Direction} direction - Layout direction (horizontal, vertical)
 * @returns {Object} Card dimensions (width, height, radius, gap)
 */
export const getCardLayout = (size: CardSize, direction: Direction) => {
  if (size === 'small') {
    return direction === 'horizontal'
      ? { width: 240, height: 135, radius: 4, gap: 6 } // 16:9
      : { width: 240, height: 320, radius: 4, gap: 6 }; // poster
  }

  if (size === 'medium') {
    return direction === 'horizontal'
      ? { width: 320, height: 180, radius: 6, gap: 8 } // 16:9
      : { width: 320, height: 400, radius: 6, gap: 8 }; // poster
  }

  return direction === 'horizontal'
    ? { width: 400, height: 225, radius: 10, gap: 10 } // 16:9
    : { width: 400, height: 480, radius: 10, gap: 10 }; // poster
};

/**
 * Type Definitions
 */

/**
 * CardSize defines the available sizes for cards in the layout
 * - small: Compact cards for dense layouts
 * - medium: Standard size for most content
 * - large: Featured size for prominent content
 */
export type CardSize = 'small' | 'medium' | 'large';

/**
 * Direction defines the layout orientation for cards
 * - horizontal: Cards arranged in a row (16:9 aspect ratio)
 * - vertical: Cards arranged in a column (poster aspect ratio)
 * - expand: Special state for expanded/focused cards
 */
export type Direction = 'horizontal' | 'vertical' | 'expand';

/**
 * AnimationType defines the available animations for card interactions
 * - zoomIn: Card expands when focused
 * - zoomOut: Card contracts when unfocused
 */
export type AnimationType = 'zoomIn' | 'zoomOut';

/**
 * CardLayoutKey is a composite type combining size and direction
 * Used as a key for looking up layout configurations
 */
export type CardLayoutKey = `${CardSize}-${Direction}`;

/**
 * RowConfig defines the layout parameters for a row of cards
 * - ITEM_COUNT: Maximum number of items in the row
 * - HEIGHT: Total height of the row including spacing
 * - WIDTH: Width of each item including spacing
 */
export interface RowConfig {
  ITEM_COUNT: number;
  HEIGHT: number;
  WIDTH: number;
}

/**
 * Generates a layout key from size and direction configuration
 * @param config - Object containing size and direction
 * @returns Composite key string for layout lookup
 */
export const getRowLayoutKey = (config: {
  size: CardSize;
  direction: Direction;
}): CardLayoutKey => `${config.size}-${config.direction}`;

/**
 * HeroRow represents the featured/hero section at the top of the layout
 * This is typically a full-width banner or featured content
 */
export type HeroRow = {
  type: 'hero';
};

/**
 * ContentRow represents a standard row of cards in the layout
 * Contains configuration and data for rendering a row of cards
 */
export type ContentRow = {
  type: 'row' | 'skeleton';
  rowIndex: number;
  title: string;
  height: number;
  offset: number;
  layoutConfig: {
    size: CardSize;
    direction: Direction;
  };
  data: BirdItemHome[];
  isSkeleton?: boolean;
};

/**
 * PosterRowData is a union type representing any row in the layout
 * Can be either a hero section or a content row
 */
export type PosterRowData = HeroRow | ContentRow;

// Constants
const FOCUSABLE_CARD_TYPES = ['zoomIn', 'zoomOut'] as const;

const ROW_ORDER: Array<{ size: CardSize; direction: Direction }> = [
  { size: 'large', direction: 'horizontal' },
  { size: 'medium', direction: 'vertical' },
  { size: 'small', direction: 'horizontal' },
  { size: 'medium', direction: 'horizontal' },
  { size: 'small', direction: 'vertical' },
];

const ROW_ITEMS_COUNT = 50;

const buildRowConfig = (size: CardSize, direction: Direction): RowConfig => {
  const layout = getCardLayout(size, direction);
  return {
    ITEM_COUNT: ROW_ITEMS_COUNT,
    HEIGHT: layout.height + 40 + layout.gap,
    WIDTH: layout.width + layout.gap,
  };
};

export const getCardHeight = (
  size: CardSize,
  direction: Direction,
  hasChildren = true,
): number => {
  const layout = getCardLayout(size, direction);
  const extra = hasChildren ? 100 + layout.gap : layout.gap;
  return layout.height + extra;
};

export const getCardWidth = (size: CardSize, direction: Direction): number => {
  const layout = getCardLayout(size, direction);
  return layout.width + layout.gap * 2;
};

export const ROW_CONFIG: Record<CardLayoutKey, RowConfig> = {
  'small-horizontal': buildRowConfig('small', 'horizontal'),
  'small-vertical': buildRowConfig('small', 'vertical'),
  'medium-horizontal': buildRowConfig('medium', 'horizontal'),
  'medium-vertical': buildRowConfig('medium', 'vertical'),
  'large-horizontal': buildRowConfig('large', 'horizontal'),
  'large-vertical': buildRowConfig('large', 'vertical'),
  'small-expand': buildRowConfig('small', 'expand'),
  'medium-expand': buildRowConfig('medium', 'expand'),
  'large-expand': buildRowConfig('large', 'expand'),
};

export const getAverageRowHeight = (): number => {
  const total = Object.values(ROW_CONFIG).reduce(
    (sum, row) => sum + row.HEIGHT,
    0,
  );
  return Math.floor(total / Object.keys(ROW_CONFIG).length);
};

// Utilities
const shuffle = <T>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i]!, copy[j]!] = [copy[j]!, copy[i]!];
  }
  return copy;
};

/**
 * Utility function to repeat an array until it reaches a specified count
 * This is useful for ensuring we have enough items to fill rows
 * It shuffles the array to add randomness and prevent repetition
 * Returns a new array with the specified count of items
 * If the original array is shorter than the count, it will repeat elements
 * Example: repeatUntil([1, 2, 3], 5) might return [2, 1, 3, 1, 2]
 */
const repeatUntil = <T>(arr: T[], count: number): T[] => {
  const result: T[] = [];
  while (result.length < count) {
    result.push(...shuffle(arr));
  }
  return result.slice(0, count);
};

const getRandomAnimation = (): AnimationType => {
  return FOCUSABLE_CARD_TYPES[
    Math.floor(Math.random() * FOCUSABLE_CARD_TYPES.length)
  ]!;
};

const scaleImageToResolutions = (url: string): Record<string, string> => {
  const baseUrl = url.replace(/SX\d+/, 'SX');
  return {
    '260': baseUrl + '260',
    '300': baseUrl + '300',
    '400': baseUrl + '400',
    '500': baseUrl + '500',
    '600': baseUrl + '600',
    '720': baseUrl + '720',
    '1080': baseUrl + '1080',
    '1440': baseUrl + '1440',
    '2160': baseUrl + '2160',
  };
};

export type LayoutConfig = {
  size: CardSize;
  direction: Direction;
};

export type HomeItem =
  | { type: 'hero' }
  | { type: 'row'; data: BirdItemHome[]; layoutConfig: LayoutConfig };

/**
 * PAGINATION CONSTANTS
 * ====================
 *
 * These constants control the pagination behavior and content generation.
 * Adjust these values to change the total content size and loading batch size.
 */
export const TOTAL_POSTER_ROWS = 30;
export const TOTAL_ROWS_PER_BATCH = 3;
export const ITEMS_PER_ROW = 18;

/**
 * CONTENT GENERATION FUNCTIONS
 * ============================
 *
 * These functions handle the creation of content rows and skeleton placeholders
 * for the pagination system.
 */

/**
 * Calculates page boundaries for row generation
 */
const calculatePageBoundaries = (page: number, pageSize: number) => {
  const startRow = page * pageSize;
  const endRow = Math.min(startRow + pageSize, TOTAL_POSTER_ROWS);
  return { startRow, endRow };
};

/**
 * Prepares image data for row generation
 */
const prepareImageData = () => {
  const estimatedImages = TOTAL_POSTER_ROWS * ITEMS_PER_ROW;
  return repeatUntil(
    [...HorizontalPosters, ...VerticalPosters],
    estimatedImages,
  );
};

/**
 * Gets layout configuration for a specific row
 */
const getRowLayoutConfig = (rowIndex: number) => {
  const { size, direction } = ROW_ORDER[rowIndex % ROW_ORDER.length] ?? {
    size: 'medium' as CardSize,
    direction: 'horizontal' as Direction,
  };

  const layoutKey = getRowLayoutKey({ size, direction });
  const { ITEM_COUNT, HEIGHT } = ROW_CONFIG[layoutKey];
  const rowAnimation = getRandomAnimation();

  return { size, direction, layoutKey, ITEM_COUNT, HEIGHT, rowAnimation };
};

/**
 * Selects and validates images for a row
 */
const selectRowImages = (
  images: string[],
  imageIndex: number,
  itemsCount: number,
) => {
  let selected = images.slice(imageIndex, imageIndex + itemsCount);

  if (selected.some((url: string) => !url || url.trim() === '')) {
    selected = repeatUntil(images, itemsCount);
  }

  return selected;
};

/**
 * Creates bird items for a row
 */
const createBirdItems = ({
  selectedImages,
  rowIndex,
  globalIndex,
  size,
  direction,
  rowAnimation,
}: {
  selectedImages: string[];
  rowIndex: number;
  globalIndex: { value: number };
  size: CardSize;
  direction: Direction;
  rowAnimation: AnimationType;
}): BirdItemHome[] => {
  return selectedImages.map((url: string, localIndex: number) => {
    const isSkeleton = !url || url.trim?.() === '';

    return {
      id: `row-${rowIndex}-item-${localIndex}`,
      imageUrl: url,
      index: globalIndex.value++,
      rowIndex,
      itemId: `row-${rowIndex}-item-${localIndex}`,
      title: isSkeleton ? '' : `Bird ${rowIndex}-${localIndex}`,
      isSkeleton,
      layoutConfig: { size, direction, animations: rowAnimation },
      resolutions: isSkeleton ? {} : scaleImageToResolutions(url),
    };
  });
};

/**
 * Creates skeleton bird items for a row
 */
const createSkeletonBirdItems = ({
  itemCount,
  rowIndex,
  size,
  direction,
}: {
  itemCount: number;
  rowIndex: number;
  size: CardSize;
  direction: Direction;
}): BirdItemHome[] => {
  return Array.from({ length: itemCount }).map((_, localIndex) => ({
    id: `skeleton-${rowIndex}-item-${localIndex}`,
    imageUrl: '',
    index: localIndex,
    rowIndex,
    itemId: `skeleton-${rowIndex}-item-${localIndex}`,
    title: '',
    isSkeleton: true,
    layoutConfig: { size, direction, animations: 'zoomIn' as AnimationType },
    resolutions: {},
  }));
};

/**
 * Creates a content row object
 */
const createContentRow = ({
  rowIndex,
  HEIGHT,
  currentOffset,
  size,
  direction,
  birdItems,
}: {
  rowIndex: number;
  HEIGHT: number;
  currentOffset: number;
  size: CardSize;
  direction: Direction;
  birdItems: BirdItemHome[];
}): ContentRow => ({
  type: 'row',
  rowIndex,
  title: `Row ${rowIndex + 1}`,
  height: HEIGHT,
  offset: currentOffset,
  layoutConfig: { size, direction },
  data: birdItems,
});

/**
 * Generates a specific page of poster rows for pagination
 */
export const getPosterRowsPage = ({
  page = 0,
  pageSize = TOTAL_ROWS_PER_BATCH,
}: {
  page?: number;
  pageSize?: number;
}): ContentRow[] => {
  const { startRow, endRow } = calculatePageBoundaries(page, pageSize);
  const images = prepareImageData();

  const rows: ContentRow[] = [];
  let currentOffset = 0;
  let globalIndex = { value: startRow * ITEMS_PER_ROW };
  let imageIndex = startRow * ITEMS_PER_ROW;

  for (let rowIndex = startRow; rowIndex < endRow; rowIndex++) {
    const { size, direction, ITEM_COUNT, HEIGHT, rowAnimation } =
      getRowLayoutConfig(rowIndex);
    const itemsCount = Math.min(ITEMS_PER_ROW, ITEM_COUNT);

    const selectedImages = selectRowImages(images, imageIndex, itemsCount);
    imageIndex += itemsCount;

    const birdItems = createBirdItems({
      selectedImages,
      rowIndex,
      globalIndex,
      size,
      direction,
      rowAnimation,
    });
    const row = createContentRow({
      rowIndex,
      HEIGHT,
      currentOffset,
      size,
      direction,
      birdItems,
    });

    rows.push(row);
    currentOffset += HEIGHT;
  }

  return rows;
};

/**
 * Creates placeholder skeleton rows for loading states
 */
export const getSkeletonRows = (
  startRow: number,
  count: number,
): ContentRow[] => {
  const rows: ContentRow[] = [];
  let currentOffset = 0;

  for (let i = 0; i < count; i++) {
    const rowIndex = startRow + i;
    const { size, direction, ITEM_COUNT, HEIGHT } =
      getRowLayoutConfig(rowIndex);

    const birdItems = createSkeletonBirdItems({
      itemCount: ITEM_COUNT,
      rowIndex,
      size,
      direction,
    });
    const row = createContentRow({
      rowIndex,
      HEIGHT,
      currentOffset,
      size,
      direction,
      birdItems,
    });

    rows.push(row);
    currentOffset += HEIGHT;
  }

  return rows;
};

/**
 * REACT HOOKS FOR PAGINATION
 * ==========================
 *
 * These hooks provide React Query integration for efficient data fetching,
 * caching, and state management of the pagination system.
 */

/**
 * Basic infinite query hook for poster row pagination
 *
 * This hook provides a simple pagination interface using React Query's
 * useInfiniteQuery. It handles data fetching, caching, and loading states.
 *
 * Returns:
 * - rows: Array of all loaded content rows
 * - fetchNextPage: Function to load the next page
 * - hasNextPage: Boolean indicating if more pages are available
 * - isLoading: Boolean indicating if initial load is in progress
 * - isFetchingNextPage: Boolean indicating if next page is being fetched
 *
 * Features:
 * - Automatic caching of fetched pages
 * - Handles loading and error states
 * - Provides infinite scroll functionality
 * - Optimized for performance with small batch sizes
 *
 * Example:
 * const { rows, fetchNextPage, hasNextPage } = usePosterRows();
 *
 * // Load next page when user scrolls
 * if (hasNextPage) {
 *   fetchNextPage();
 * }
 */
export const usePosterRows = () =>
  useInfiniteQuery({
    queryKey: ['posterRows'],
    queryFn: ({ pageParam = 0 }) => {
      const rows = getPosterRowsPage({
        page: pageParam,
        pageSize: TOTAL_ROWS_PER_BATCH,
      });
      return { rows, page: pageParam };
    },
    initialPageParam: 0,
    getNextPageParam: lastPage =>
      lastPage.rows.length < TOTAL_ROWS_PER_BATCH
        ? undefined
        : lastPage.page + 1,
    initialData: {
      pages: [
        {
          rows: getPosterRowsPage({
            page: 0,
            pageSize: TOTAL_ROWS_PER_BATCH,
          }),
          page: 0,
        },
      ],
      pageParams: [0],
    },
  });

/**
 * Enhanced hook with skeleton preloading for seamless UX
 *
 * This hook extends the basic pagination with skeleton loading capabilities.
 * It provides immediate visual feedback by showing skeleton placeholders
 * while real content is being fetched, then seamlessly replaces them.
 *
 * Key Features:
 * - Shows skeletons immediately on first load
 * - Replaces skeletons with real content when available
 * - Maintains smooth scrolling experience
 * - Handles complex state merging between skeleton and real data
 *
 * Returns:
 * - rows: Merged array of skeleton and real content rows
 * - fetchNextPage: Function to load the next page
 * - hasNextPage: Boolean indicating if more pages are available
 * - isPreloading: Boolean indicating if content is being preloaded
 * - All standard React Query states (isLoading, isFetching, etc.)
 *
 * How it works:
 * 1. Initially shows skeleton rows for immediate feedback
 * 2. Fetches real content in the background
 * 3. Merges skeleton and real data based on availability
 * 4. Provides smooth transitions between loading states
 *
 * Example:
 * const { rows, fetchNextPage, isPreloading } = usePosterRowsWithSkeletonPreload();
 *
 * // Rows will show skeletons initially, then real content
 * // isPreloading indicates when content is being fetched
 */
export const usePosterRowsWithSkeletonPreload = () => {
  // STEP 1: Initialize local state for merged rows
  // This state holds the final array of rows that combines skeletons and real content
  // It gets updated whenever new data is fetched from the infinite query
  const [mergedRows, setMergedRows] = useState<ContentRow[]>([]);

  // STEP 2: Set up React Query infinite query
  // This handles data fetching, caching, and pagination automatically
  const {
    data, // All fetched pages of data (real + skeleton)
    fetchNextPage, // Function to load the next page
    hasNextPage, // Boolean: true if more pages are available
    isFetchingNextPage, // Boolean: true while loading next page
    isLoading, // Boolean: true during initial load
    isFetching, // Boolean: true during any fetch operation
    status, // String: 'idle' | 'pending' | 'error' | 'success'
  } = useInfiniteQuery({
    // Unique key for React Query cache - all queries with this key share the same cache
    queryKey: ['posterRows'],

    // Function that fetches data for each page
    // pageParam is the page number (0, 1, 2, etc.)
    queryFn: ({ pageParam = 0 }) => {
      // Get both real content and skeleton data for this page
      const { rows, skeletonRows } = getPosterRowsPageWithSkeletons({
        page: pageParam, // Which page to fetch
        pageSize: TOTAL_ROWS_PER_BATCH, // How many rows per page (3)
        includeSkeletons: true, // Include skeleton data
      });

      // Return a Promise that resolves to the page data
      // React Query expects this to be a Promise
      return Promise.resolve({
        real: rows, // Real content rows for this page
        skeleton: skeletonRows, // Skeleton rows for this page
        page: pageParam, // Current page number
      });
    },

    // Start with page 0 (first page)
    initialPageParam: 0,

    // Determine if there are more pages to fetch
    // If the last page has fewer rows than expected, we've reached the end
    getNextPageParam: lastPage =>
      lastPage.real.length < TOTAL_ROWS_PER_BATCH
        ? undefined // No more pages (undefined stops pagination)
        : lastPage.page + 1, // Next page number
  });

  // STEP 3: Merge skeleton and real data when data changes
  // This effect runs whenever the query data updates
  useEffect(() => {
    // If no data is available yet, don't do anything
    if (!data) {
      return;
    }

    // STEP 3a: Extract all real and skeleton rows from all fetched pages
    // flatMap combines all pages into a single array
    const allReal = data.pages.flatMap(p => p.real); // All real content rows
    const allSkeletons = data.pages.flatMap(p => p.skeleton); // All skeleton rows

    // STEP 3b: Create the final merged array
    const merged = allSkeletons
      // Only include skeletons for rows that actually exist (max 30 rows)
      .filter(s => s.rowIndex < TOTAL_POSTER_ROWS)
      // For each skeleton row, decide whether to show skeleton or real content
      .map((skeletonRow, index) => {
        // Find the corresponding real row at the same index
        const realRow = allReal[index];

        // DECISION LOGIC: Choose between skeleton and real content
        // If real row exists AND has at least one non-skeleton item → show real content
        // Otherwise → show skeleton (loading placeholder)
        return realRow?.data.some(item => !item.isSkeleton)
          ? realRow // Show real content (images, titles, etc.)
          : skeletonRow; // Show skeleton (empty placeholders)
      });

    // STEP 3c: Update the local state with the merged result
    // This triggers a re-render with the new combined data
    setMergedRows(merged);
  }, [data]); // Re-run effect whenever data changes

  // STEP 4: Return the hook interface
  // This provides all the data and functions needed by the component
  return {
    rows: mergedRows, // Final array: skeletons + real content
    fetchNextPage, // Function to load more content
    hasNextPage, // Boolean: can load more?
    isFetchingNextPage, // Boolean: currently loading more?
    isLoading, // Boolean: initial loading state
    isFetching, // Boolean: any fetch in progress
    isPreloading: isLoading, // Alias for isLoading (for clarity)
    status, // Current query status
  };
};

/**
 * Enhanced version of getPosterRowsPage that supports skeleton preloading
 *
 * This function combines real content generation with skeleton creation
 * for seamless loading experiences. It returns both real and skeleton data
 * that can be used together for smooth transitions.
 *
 * @param page - The page number to generate (0-based)
 * @param pageSize - Number of rows per page (default: 3)
 * @param includeSkeletons - Whether to include skeleton data (default: true)
 * @returns Object containing both real and skeleton rows
 *
 * Features:
 * - Generates real content rows using getPosterRowsPage
 * - Creates matching skeleton rows using getSkeletonRows
 * - Allows optional skeleton generation for performance
 * - Maintains consistent data structure
 *
 * Example:
 * const { rows, skeletonRows } = getPosterRowsPageWithSkeletons({
 *   page: 0,
 *   pageSize: 5,
 *   includeSkeletons: true
 * });
 */
export const getPosterRowsPageWithSkeletons = ({
  page = 0,
  pageSize = TOTAL_ROWS_PER_BATCH,
  includeSkeletons = true,
}: {
  page?: number;
  pageSize?: number;
  includeSkeletons?: boolean;
}): { rows: ContentRow[]; skeletonRows: ContentRow[] } => {
  const realRows = getPosterRowsPage({ page, pageSize });
  const skeletonRows = includeSkeletons
    ? getSkeletonRows(page * pageSize, pageSize)
    : [];

  return { rows: realRows, skeletonRows };
};
