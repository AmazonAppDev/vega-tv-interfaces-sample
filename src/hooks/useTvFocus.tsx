import type { RefObject } from 'react';
import React, { createContext, useContext, useState } from 'react';
import type { View } from 'react-native';
import { findNodeHandle } from 'react-native';

/**
 * A custom hook and context provider for managing TV focus navigation in React Native apps.
 * This system allows components to register themselves as focus destinations and retrieve
 * native references for TV focus handling.
 *
 * Use cases:
 * - Managing focus movement between different UI elements on TV platforms
 * - Programmatically controlling focus navigation
 * - Handling complex focus patterns that native TV focus doesn't handle well
 */

type DestinationMap = Record<string, RefObject<View> | null>;

interface TVFocusContextType {
  /** Map of registered focus destinations */
  destinations: DestinationMap;
  /** Register a new focus destination with a unique key */
  registerDestination: (key: string, ref: RefObject<View> | null) => void;
  /** Remove a focus destination */
  unregisterDestination: (key: string) => void;
  /** Get native view handles for a list of destination keys */
  getNativeDestinations: (keys: string[]) => (number | null)[];
}

const TVFocusContext = createContext<TVFocusContextType | null>(null);

/**
 * Provider component that manages the TV focus system.
 * Wrap your app or the portion that needs TV focus management with this provider.
 *
 * @example
 * ```tsx
 * <TVFocusProvider>
 *   <YourApp />
 * </TVFocusProvider>
 * ```
 */
export const TVFocusProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  /**
   * Map of all registered focus destinations, where:
   * - key: unique identifier for the focusable element
   * - value: React ref to the focusable View component
   */
  const [destinations, setDestinations] = useState<DestinationMap>({});

  /**
   * Registers a new focusable element in the focus management system.
   *
   * @param key - Unique identifier for the focusable element
   * @param ref - React ref to the View component that can receive focus
   *
   * @example
   * ```tsx
   * const buttonRef = useRef(null);
   * registerDestination('submit-button', buttonRef);
   * ```
   */
  const registerDestination = (key: string, ref: RefObject<View> | null) => {
    setDestinations(prev => ({ ...prev, [key]: ref }));
  };

  /**
   * Removes a focusable element from the focus management system.
   * Typically called during component cleanup or when an element becomes unfocusable.
   *
   * @param key - Unique identifier of the focusable element to remove
   *
   * @example
   * ```tsx
   * useEffect(() => {
   *   return () => unregisterDestination('submit-button');
   * }, []);
   * ```
   */
  const unregisterDestination = (key: string) => {
    setDestinations(prev => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  /**
   * Converts registered React refs to native view handles for platform-specific focus management.
   * Used internally by the TV platform to manage focus navigation.
   *
   * @param keys - Array of destination keys to convert to native handles
   * @returns Array of native view handles (numbers) corresponding to the provided keys
   *
   * @example
   * ```tsx
   * // Get native handles for navigation between two buttons
   * const handles = getNativeDestinations(['prev-button', 'next-button']);
   * ```
   */
  const getNativeDestinations = (keys: string[]) =>
    keys.map(key => findNodeHandle(destinations[key]?.current ?? 0));

  return (
    <TVFocusContext.Provider
      value={{
        destinations,
        registerDestination,
        unregisterDestination,
        getNativeDestinations,
      }}
    >
      {children}
    </TVFocusContext.Provider>
  );
};

/**
 * Hook to access the TV focus management system.
 *
 * @returns {TVFocusContextType} Object containing focus management functions and state
 *
 * @example
 * ```tsx
 * const { registerDestination, unregisterDestination } = useTVFocus();
 *
 * const buttonRef = useRef(null);
 *
 * useEffect(() => {
 *   registerDestination('my-button', buttonRef);
 *   return () => unregisterDestination('my-button');
 * }, []);
 * ```
 *
 * @throws {Error} If used outside of TVFocusProvider
 */
export const useTVFocus = (): TVFocusContextType => {
  const context = useContext(TVFocusContext);
  if (!context) {
    throw new Error('useTVFocus must be used within a TVFocusProvider');
  }
  return context;
};
