/**
 * Function to get a bird image URL by its index
 * @param index The index of the bird image (1-based)
 * @returns The complete URL for the bird image
 */
export const getBirdImageUrl = (index: number): string => {
  const paddedIndex = index.toString().padStart(2, '0');
  return `https://d1v0fxmwkpxbrg.cloudfront.net/birds/360x540/${paddedIndex}.jpg`;
};

/**
 * Function to check if a bird image exists
 * @param index The index of the bird image to check
 * @returns Promise that resolves to true if the image exists
 */
export const checkBirdImageExists = async (index: number): Promise<boolean> => {
  try {
    const response = await fetch(getBirdImageUrl(index), { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

export const allAnimations = ['zoomIn', 'zoomOut'] as const;

export type BirdItem = {
  id: string;
  title: string;
  imageUrl: string;
  index: number;
  rowIndex: number;
  itemId: string;
};

export type BirdItemHome = {
  id: string;
  title: string;
  imageUrl: string;
  index: number;
  rowIndex: number;
  itemId: string;
  layoutConfig?: {
    direction: 'horizontal' | 'vertical' | 'expand';
    size: 'small' | 'medium' | 'large';
    animations: (typeof allAnimations)[number];
  };
  resolutions?: Record<string, string>;
  isSkeleton?: boolean;
};
