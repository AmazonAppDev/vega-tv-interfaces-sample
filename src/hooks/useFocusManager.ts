import { useRef, useEffect, useCallback, useState } from 'react';
import type { View } from 'react-native';
import { BackHandler } from 'react-native';

// Types
type FocusableElement = View | null;

interface FocusConfig {
  autoFocus?: boolean;
  onFocusChange?: (isFocused: boolean) => void;
  trapFocus?: boolean;
}

interface UseFocusManagerResult {
  ref: React.RefObject<View | null>;
  focus: () => void;
  blur: () => void;
  isFocused: boolean;
}

interface UseFocusCollectionResult {
  registerRef: (id: string, ref: FocusableElement) => void;
  focusItem: (id: string) => void;
  blurItem: (id: string) => void;
  getCurrentFocused: () => string | null;
}

/**
 * A custom hook for managing focus state of a single focusable element.
 *
 * @param config Configuration options for focus behavior
 * @param config.autoFocus Automatically focus the element when mounted
 * @param config.onFocusChange Callback triggered when focus state changes
 * @param config.trapFocus Prevents focus from leaving the element (captures back button on Android)
 *
 * @returns Object containing:
 * - ref: Reference to attach to the focusable element
 * - focus: Function to focus the element
 * - blur: Function to blur the element
 * - isFocused: Current focus state
 */
export const useFocusManager = (
  config: FocusConfig = {},
): UseFocusManagerResult => {
  const { autoFocus = false, onFocusChange, trapFocus = false } = config;
  const ref = useRef<View | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const focus = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (ref.current as any)?.focus();
    setIsFocused(true);
    onFocusChange?.(true);
  }, [onFocusChange]);

  const blur = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (ref.current as any)?.blur();
    setIsFocused(false);
    onFocusChange?.(false);
  }, [onFocusChange]);

  useEffect(() => {
    if (autoFocus) {
      focus();
    }

    if (trapFocus) {
      const handleBackPress = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (ref.current as any)?.focus();
        return true;
      };
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress,
      );
      return () => subscription.remove();
    }
  }, [autoFocus, trapFocus, focus]);

  return { ref, focus, blur, isFocused };
};

/**
 * A custom hook for managing focus across multiple focusable elements.
 * Useful for implementing focus management in lists, grids, or any collection of focusable items.
 * Includes debouncing to prevent rapid focus changes.
 *
 * @returns Object containing:
 * - registerRef: Function to register a focusable element with an ID
 * - focusItem: Function to focus an item by ID (debounced)
 * - blurItem: Function to blur an item by ID
 * - getCurrentFocused: Function to get the currently focused item's ID
 *
 * @example
 * const { registerRef, focusItem } = useFocusCollection();
 *
 * // In your component:
 * <TouchableOpacity ref={(ref) => registerRef('item-1', ref)}>
 *   <Text>Focusable Item</Text>
 * </TouchableOpacity>
 */
export const useFocusCollection = (): UseFocusCollectionResult => {
  const refs = useRef(new Map<string, FocusableElement>());
  const [currentFocusedId, setCurrentFocusedId] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const registerRef = (id: string, ref: FocusableElement) => {
    if (ref) {
      refs.current.set(id, ref);
    } else {
      refs.current.delete(id);
    }
  };

  const focusItem = useCallback((id: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const element = refs.current.get(id);
      if (element) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (element as any).focus();
        setCurrentFocusedId(id);
      }
    }, 150);
  }, []);

  const blurItem = useCallback((id: string) => {
    const element = refs.current.get(id);
    if (element) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (element as any).blur();
      setCurrentFocusedId(null);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    registerRef,
    focusItem,
    blurItem,
    getCurrentFocused: () => currentFocusedId,
  };
};
