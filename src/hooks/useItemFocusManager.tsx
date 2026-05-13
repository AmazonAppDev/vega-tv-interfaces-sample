import type { RefObject } from 'react';
import { useCallback } from 'react';
import type { View } from 'react-native';

import {
  findNodeHandle,
  FocusManager,
} from '@amazon-devices/react-native-kepler';
import type { FlashListRef } from '@shopify/flash-list';

type UseItemFocusManagerParams<T> = {
  itemRefs: RefObject<Array<View | null> | null>; // Reference to an array of focusable elements
  flashListRef: RefObject<FlashListRef<T> | null>; // Reference to the FlashList component
  dataLength: number; // Total number of items in the list
  isCircular?: boolean; // Optional: Whether the list should wrap around
  orientation?: 'vertical' | 'horizontal'; // Optional: Orientation of the list
};

/**
 * useItemFocusManager
 *
 * A custom hook to manage focus navigation for a list of items in a FlashList component.
 * This hook helps in setting up the focus direction for each item in the list and optionally
 * supports circular navigation.
 *
 * @param {Object} params - The parameters for the hook.
 * @param {RefObject<Array<TouchableOpacity | null> | null>} params.itemRefs - Reference to an array of TouchableOpacity elements.
 * @param {RefObject<FlashListRef<T>>} params.flashListRef - Reference to the FlashList component.
 * @param {number} params.dataLength - Total number of items in the list.
 * @param {boolean} [params.isCircular=false] - Optional: Whether the list should wrap around.
 * @param {'vertical' | 'horizontal'} [params.orientation='vertical'] - Optional: Orientation of the list.
 *
 * @returns {Function} - A callback function to update child references.
 *
 * @exampleL
 * const itemRefs = useRef([]);
 * const flashListRef = useRef(null);
 * const handleChildRefsUpdate = useItemFocusManager({
 *   itemRefs,
 *   flashListRef,
 *   dataLength: items.length,
 *   isCircular: true,
 *   orientation: 'horizontal',
 * });
 *
 * // In your component rendering
 * <TouchableOpacity ref={handleChildRefsUpdate(index)} />
 */
export const useItemFocusManager = <T,>({
  itemRefs,
  flashListRef,
  dataLength,
  isCircular = false,
  orientation = 'vertical',
}: UseItemFocusManagerParams<T>) => {
  // Callback to update child references
  const handleChildRefsUpdate = useCallback(
    (index: number) => (ref: View | null) => {
      if (!ref || !itemRefs.current) {
        return; // Exit if ref is null or itemRefs is not initialized
      }
      itemRefs.current[index] = ref; // Store the reference at the current index

      const isLastItem = index === dataLength - 1; // Check if the current item is the last one
      const isFirstItem = index === 0; // Check if the current item is the first one

      // Determine the next and previous indices
      let nextIndex = isLastItem ? 0 : index + 1;
      let prevIndex: number | null;
      if (isFirstItem) {
        prevIndex = isCircular ? dataLength - 1 : null;
      } else {
        prevIndex = index - 1;
      }

      let nextRef: View | null = null; // Initialize next reference
      let prevRef: View | null = null; // Initialize previous reference

      if (itemRefs.current) {
        // Get the next and previous references if they exist
        nextRef = itemRefs.current[nextIndex] ?? null; // Get the next reference or null if out of bounds
        prevRef =
          prevIndex !== null ? (itemRefs.current[prevIndex] ?? null) : null; // Get the previous reference or null if out of bounds
      }

      const currentHandle = findNodeHandle(ref); // Get the native handle for the current ref
      const nextHandle = nextRef ? findNodeHandle(nextRef) : null; // Get the native handle for the next ref
      const prevHandle = prevRef ? findNodeHandle(prevRef) : null; // Get the native handle for the previous ref

      // Determine the focus direction based on orientation
      const nextDirection = orientation === 'vertical' ? 'down' : 'right';
      const prevDirection = orientation === 'vertical' ? 'up' : 'left';

      // Set the next focus direction if handles are available
      if (currentHandle && nextHandle) {
        FocusManager.setNextFocus(currentHandle, nextHandle, nextDirection);
      }

      // Set the previous focus direction if handles are available
      if (currentHandle && prevHandle) {
        FocusManager.setNextFocus(currentHandle, prevHandle, prevDirection);
      }

      // If the current item is the last one, set a focus event to scroll to the top
      if (isLastItem && currentHandle) {
        ref.setNativeProps({
          onFocus: () => {
            void flashListRef.current?.scrollToIndex({
              index: 0,
              animated: true,
            });
          },
        });
      }
    },
    [dataLength, itemRefs, flashListRef, isCircular, orientation], // Dependencies for the useCallback
  );

  return handleChildRefsUpdate; // Return the callback function
};
