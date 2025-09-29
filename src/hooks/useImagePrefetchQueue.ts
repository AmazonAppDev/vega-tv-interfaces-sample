import { useRef, useEffect } from 'react';
import { Image } from 'react-native';

/**
 * Represents a single image prefetch request in the queue.
 */
type PrefetchRequest = {
  /** The URL of the image to prefetch */
  imageUrl: string;
  /** Priority level for the request (higher number = higher priority) */
  priority: number;
  /** Promise resolve function to call when prefetch succeeds */
  resolve: () => void;
  /** Promise reject function to call when prefetch fails */
  reject: (err: unknown) => void;
};

/**
 * A custom hook that manages a queue of image prefetch requests with concurrency control.
 *
 * This hook provides a way to prefetch images in the background while limiting the number
 * of concurrent requests to avoid overwhelming the network and device resources.
 *
 * @param limit - Maximum number of concurrent prefetch requests (default: 10)
 *
 * @returns An object containing:
 *   - `prefetch`: Function to add an image to the prefetch queue
 *   - `subscribe`: Function to subscribe to active request count changes
 *
 * @example
 * ```tsx
 * const { prefetch, subscribe } = useImagePrefetchQueue(5);
 *
 * // Prefetch an image
 * const prefetchImage = async () => {
 *   try {
 *     await prefetch('https://example.com/image.jpg');
 *     console.log('Image prefetched successfully');
 *   } catch (error) {
 *     console.error('Failed to prefetch image:', error);
 *   }
 * };
 *
 * // Subscribe to active request count
 * useEffect(() => {
 *   const unsubscribe = subscribe((count) => {
 *     console.log(`Active prefetch requests: ${count}`);
 *   });
 *   return unsubscribe;
 * }, [subscribe]);
 * ```
 */
export const useImagePrefetchQueue = (limit = 10) => {
  /** Queue of pending prefetch requests */
  const queue = useRef<PrefetchRequest[]>([]);
  /** Number of currently active prefetch requests */
  const active = useRef(0);
  /** Set of subscribers to notify when active count changes */
  const subscribers = useRef<Set<(count: number) => void>>(new Set());

  /**
   * Notifies all subscribers of the current active request count.
   */
  const notify = () => {
    for (const cb of subscribers.current) {
      cb(active.current);
    }
  };

  /**
   * Processes the next request in the queue if capacity allows.
   * This function is called recursively to continue processing the queue.
   */
  const processQueue = () => {
    // Stop if we've reached the limit or there are no pending requests
    if (active.current >= limit || queue.current.length === 0) {
      return;
    }

    // Get the next request from the queue
    const { imageUrl, resolve, reject } = queue.current.shift()!;
    active.current++;
    notify();

    // Add a small delay to prevent overwhelming the system
    setTimeout(async () => {
      try {
        await Image.prefetch(imageUrl);
        resolve();
      } catch (error) {
        reject(error);
      } finally {
        active.current--;
        notify();
        // Continue processing the queue
        void processQueue();
      }
    }, 30);
  };

  /**
   * Adds an image to the prefetch queue.
   *
   * @param imageUrl - The URL of the image to prefetch
   * @param priority - Priority level for the request (default: 2)
   * @returns A promise that resolves when the image is prefetched or rejects on error
   */
  const prefetch = (imageUrl: string, priority: number = 2) => {
    return new Promise<void>((resolve, reject) => {
      queue.current.push({ imageUrl, priority, resolve, reject });
      void processQueue();
    });
  };

  /**
   * Subscribes to changes in the active request count.
   *
   * @param cb - Callback function that receives the current active count
   * @returns Unsubscribe function to remove the callback
   */
  const subscribe = (cb: (count: number) => void) => {
    subscribers.current.add(cb);
    return () => subscribers.current.delete(cb);
  };

  // Clean up the queue when the component unmounts
  useEffect(
    () => () => {
      queue.current = [];
    },
    [],
  );

  return { prefetch, subscribe };
};
