# Hooks

Custom hooks are a powerful feature of React that allow you to extract and reuse stateful logic across components. In TV applications, specialized hooks are particularly valuable due to the unique challenges of TV interface development:

- **Remote-based navigation**: TV interfaces are navigated with directional keys rather than touch or mouse.
- **Focus management**: Clear focus indication and predictable navigation are critical.
- **Performance considerations**: TV devices often have more limited resources than mobile or desktop.
- **Content-heavy UIs**: TV apps typically display large amounts of visual content that needs to be loaded efficiently.

The Vega TV Interfaces provides several custom hooks designed specifically to address these challenges and make TV development more straightforward.

Each hook is documented with the following:

- A detailed explanation of its purpose and implementation.
- Code examples showing how to use it in real components.
- Recommended practices for effective implementation.
- Edge cases and performance considerations.

## Why Custom Hooks for TV?

Standard React patterns and hooks were designed primarily for web and mobile interfaces. TV interfaces have the following requirements:

### Explicit Focus Management

While web apps can rely on the browser's built-in focus system, TV apps need explicit focus management to ensure a consistent experience across different TV platforms.

### Optimized Data Loading

TV interfaces often display large grids of content. Custom hooks can provide optimized pagination and caching strategies specific to TV viewing patterns.

### Platform Integration

TV platforms have specialized APIs for focus handling. Custom hooks can bridge the gap between React's component model and these native platform capabilities.

## Benefits of Using Custom Hooks

While using these hooks is not mandatory, they offer several benefits:

- **Consistency**: Promote a consistent approach to common TV development challenges.
- **Reusability**: Encapsulate complex logic that can be reused across components.
- **Optimization**: Implement TV-specific optimizations for performance.
- **Maintainability**: Separate UI concerns from focus and data loading logic.

## Extending the Hooks

These hooks are designed to be building blocks rather than rigid solutions. They can be extended and combined to meet your specific needs.

**Example: Extend hook**

```javascript
// Example: Combining hooks for a specialized component
function useMenuNavigation() {
  const { registerDestination, unregisterDestination } = useTVFocus();
  const { registerRef, focusItem } = useFocusCollection();

  // Custom logic combining both hooks
  const registerMenuItem = (id, ref) => {
    registerDestination(id, ref);
    registerRef(id, ref);
  };

  // Return the combined API
  return {
    registerMenuItem,
    focusItem,
    // Other functions...
  };
}
```

## TV Focus Management

### Overview

The `useTVFocus` hook provides a comprehensive system for managing focus in TV applications. It helps solve one of the most challenging aspects of TV development: creating predictable and intuitive focus navigation paths.

### Why TV Focus Management is Different

On TV platforms, users navigate entirely with a remote control using directional keys (up, down, left, right). This presents the unique following challenges:

- **Spatial navigation**: The system needs to determine which element receives focus when the user presses a directional key.
- **Native integration**: Different TV platforms handle focus differently at the native level.
- **Component communication**: UI elements often need to "know about" other focusable elements.
- **Focus memory**: The application needs to maintain a registry of focusable elements.

`useTVFocus` addresses these challenges by providing a context-based focus registry system.

### The useTVFocus Implementation

The hook is built on a React Native context that maintains a registry of focusable elements.

**Example: useTVFocus**

```javascript
import type { RefObject } from 'react';
import React, { createContext, useContext, useState } from 'react';
import type { View } from 'react-native';
import { findNodeHandle } from 'react-native';

type DestinationMap = Record<string, RefObject<View> | null>;

interface TVFocusContextType {
  destinations: DestinationMap;
  registerDestination: (key: string, ref: RefObject<View> | null) => void;
  unregisterDestination: (key: string) => void;
  getNativeDestinations: (keys: string[]) => (number | null)[];
}

const TVFocusContext = createContext<TVFocusContextType | null>(null);
```

### The Provider Component

To use the focus management system, you need to wrap your application (or a section of it) with the `TVFocusProvider`.

**Example: TVFocusProvider**

```javascript
export const TVFocusProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [destinations, setDestinations] = useState<DestinationMap>({});

  const registerDestination = (key: string, ref: RefObject<View> | null) => {
    setDestinations(prev => ({ ...prev, [key]: ref }));
  };

  const unregisterDestination = (key: string) => {
    setDestinations(prev => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

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
```

### Key Functions

The hook provides several key functions:

**registerDestination**

This function performs the following:

- Takes a unique identifier and a React reference to a View component.
- Adds the element to the focus registry.
- Makes the element available for focus management operations.

```javascript
const registerDestination = (key: string, ref: RefObject<View> | null) => {
  setDestinations(prev => ({ ...prev, [key]: ref }));
};
```

**unregisterDestination**

This function performs the following:

- Removes an element from the focus registry.
- Prevents memory leaks by cleaning up references.
- Should be called when a component unmounts.

```javascript
const unregisterDestination = (key: string) => {
  setDestinations(prev => {
    const updated = { ...prev };
    delete updated[key];
    return updated;
  });
};
```

**getNativeDestinations**

This function performs the following:

- Converts React Native references to native view handles.
- Is used with platform-specific focus components like `FocusGuideView`.
- Bridges the component model of React Native with native TV focus systems.

```javascript
const getNativeDestinations = (keys: string[]) =>
  keys.map(key => findNodeHandle(destinations[key]?.current ?? 0));
```

### Accessing the Hook

The `useTVFocus` hook provides access to the focus management system.

**Example: `useTVFocus`**

```javascript
export const useTVFocus = (): TVFocusContextType => {
  const context = useContext(TVFocusContext);
  if (!context) {
    throw new Error('useTVFocus must be used within a TVFocusProvider');
  }
  return context;
};
```

### Usage Examples

**Basic Registration of Focus Destinations**

```javascript
import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useTVFocus } from '@AppSrc/hooks';

export const MenuBar = () => {
  const { registerDestination, unregisterDestination } = useTVFocus();

  const homeButtonRef = useRef(null);
  const searchButtonRef = useRef(null);
  const settingsButtonRef = useRef(null);

  useEffect(() => {
    // Register all buttons when component mounts
    registerDestination('menu-home', homeButtonRef);
    registerDestination('menu-search', searchButtonRef);
    registerDestination('menu-settings', settingsButtonRef);

    // Clean up when component unmounts
    return () => {
      unregisterDestination('menu-home');
      unregisterDestination('menu-search');
      unregisterDestination('menu-settings');
    };
  }, [registerDestination, unregisterDestination]);

  return (
    <View style={styles.menuBar}>
      <TouchableOpacity ref={homeButtonRef} style={styles.menuItem}>
        <Text>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity ref={searchButtonRef} style={styles.menuItem}>
        <Text>Search</Text>
      </TouchableOpacity>

      <TouchableOpacity ref={settingsButtonRef} style={styles.menuItem}>
        <Text>Settings</Text>
      </TouchableOpacity>
    </View>
  );
};
```

**Using with FocusGuideView**

The `getNativeDestinations` function is particularly useful with `FocusGuideView` to define explicit focus paths.

```javascript
import React, { useRef, useEffect } from 'react';
import { View } from 'react-native';
import { useTVFocus } from '@AppSrc/hooks';
import { FocusGuideView } from '@AppServices/focusGuide';

export const SplitScreen = () => {
  const { registerDestination, unregisterDestination, getNativeDestinations } =
    useTVFocus();

  const sidebarRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    registerDestination('sidebar', sidebarRef);
    registerDestination('main-content', contentRef);

    return () => {
      unregisterDestination('sidebar');
      unregisterDestination('main-content');
    };
  }, [registerDestination, unregisterDestination]);

  return (
    <View style={styles.container}>
      {/* Define focus paths between sidebar and main content */}
      <FocusGuideView
        destinations={getNativeDestinations(['sidebar', 'main-content'])}
      >
        <View style={styles.splitContainer}>
          <Sidebar ref={sidebarRef} />
          <MainContent ref={contentRef} />
        </View>
      </FocusGuideView>
    </View>
  );
};
```

**Dynamic Focus Management**

You can use `useTVFocus` to handle dynamic focus changes in response to UI state changes.

```javascript
import React, { useRef, useEffect, useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useTVFocus } from '@AppSrc/hooks';

export const TabBar = () => {
  const { registerDestination, unregisterDestination } = useTVFocus();
  const [activeTab, setActiveTab] = useState('home');

  const tabRefs = {
    home: useRef(null),
    browse: useRef(null),
    profile: useRef(null),
  };

  useEffect(() => {
    // Register all tab refs
    Object.entries(tabRefs).forEach(([key, ref]) => {
      registerDestination(`tab-${key}`, ref);
    });

    return () => {
      // Unregister all tab refs
      Object.keys(tabRefs).forEach(key => {
        unregisterDestination(`tab-${key}`);
      });
    };
  }, [registerDestination, unregisterDestination]);

  return (
    <View style={styles.tabBar}>
      {Object.entries(tabRefs).map(([key, ref]) => (
        <TouchableOpacity
          key={key}
          ref={ref}
          style={[styles.tab, activeTab === key && styles.activeTab]}
          onPress={() => setActiveTab(key)}
          hasTVPreferredFocus={key === 'home'}
        >
          <Text>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
```

### Recommended Practices

- **Use consistent key naming conventions.** Create a naming schema for focus destinations to make your code more maintainable.

  Example:

  ```javascript
  // Define constants for focus keys
  const FOCUS_KEYS = {
    MAIN_MENU: {
      HOME: 'main-menu-home',
      BROWSE: 'main-menu-browse',
      SEARCH: 'main-menu-search',
    },
    CONTENT: {
      FEATURED: 'content-featured',
      GRID: 'content-grid',
    },
  };

  // Use the constants
  registerDestination(FOCUS_KEYS.MAIN_MENU.HOME, homeRef);
  ```

- **Register and unregister in useEffect.** Always handle registration and cleanup in useEffect.

  Example:

  ```javascript
  useEffect(() => {
    registerDestination('button-key', buttonRef);

    return () => {
      unregisterDestination('button-key');
    };
  }, []); // Empty dependency array if refs don't change
  ```

- **Use with FocusGuideView for complex layouts.** For complex layouts, combine `useTVFocus` with `FocusGuideView` to create explicit focus paths.

  Example:

  ```javascript
  <FocusGuideView
    destinations={getNativeDestinations(['left-panel', 'right-panel'])}
    trapFocusLeft
  >
    <View style={styles.splitLayout}>
      <LeftPanel ref={leftPanelRef} />
      <RightPanel ref={rightPanelRef} />
    </View>
  </FocusGuideView>
  ```

- **Avoid excessive registration.** Only register elements that need explicit focus management.

  Example:

  ```javascript
  // Good: Register key interactive elements
  registerDestination('main-menu', menuRef);
  registerDestination('content-grid', gridRef);

  // Avoid: Registering every interactive element
  // This can lead to performance issues and complexity
  // items.forEach((item, index) => {
  //   registerDestination(`item-${index}`, itemRefs[index]);
  // });
  ```

- **Combine with state management.** Integrate focus management with component state for cohesive UI behavior.

  Example:

  ```javascript
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemFocus = itemId => {
    setSelectedItem(itemId);
    // Other focus-related state updates
  };
  ```

### Performance Considerations

**Optimize Registration and Unregistration**

For large lists or grids, consider optimizing how you register items.

Example:

```javascript
// Better approach for many items
const visibleItemRefs = useRef({});

// Only register items that are currently visible
const handleItemVisible = (id, ref, isVisible) => {
  if (isVisible) {
    visibleItemRefs.current[id] = ref;
    registerDestination(`item-${id}`, ref);
  } else {
    delete visibleItemRefs.current[id];
    unregisterDestination(`item-${id}`);
  }
};

// Clean up all registrations on unmount
useEffect(() => {
  return () => {
    Object.keys(visibleItemRefs.current).forEach(id => {
      unregisterDestination(`item-${id}`);
    });
  };
}, []);
```

**Memoize Native Destinations**

If you're calling `getNativeDestinations` frequently, consider memoizing the result.

Example:

```javascript
const memoizedDestinations = useMemo(
  () => getNativeDestinations(['menu', 'content']),
  [getNativeDestinations, destinations],
);

return (
  <FocusGuideView destinations={memoizedDestinations}>
    {/* Content */}
  </FocusGuideView>
);
```

### When to use useTVFocus

The `useTVFocus` hook is particularly valuable for the the following:

- Building complex layouts with multiple focusable sections.
- Creating custom navigation patterns between UI elements.
- Implementing focus memory (returning to previously focused elements).
- Building reusable components that need to participate in focus management.

However, for simpler interfaces, you might not need the full power of `useTVFocus`. In those cases, React Native's built-in TV focus props (like `hasTVPreferredFocus` and `nextFocus*`) might be sufficient.

### Conclusion

The `useTVFocus` hook provides a powerful system for managing focus in TV applications. By centralizing focus registration and providing tools for native platform integration, it helps create predictable and intuitive navigation experiences for TV users.

Remember that while this hook offers significant benefits, it represents one approach to solving TV focus challenges. Feel free to adapt it to your specific needs or combine it with other focus management techniques.

## Focus collection

The `useFocusCollection` hook provides a specialized system for managing focus across multiple related elements, such as items in a menu, grid, or list. It builds on the foundation of React Native's focus management but adds features specifically designed for TV interfaces.

### Why focus collection is needed

Traditional focus management works well for individual elements, but TV interfaces often contain collections of similar elements that require coordinated focus handling:

- **Group Focus Behavior:** Menu items, grid cells, or list items often need consistent focus behavior.
- **Programmatic Focus Control:** Applications need to programmatically focus specific items in a collection.
- **Focus State Tracking:** The system needs to know which item in a collection is currently focused.
- **Debounced Focus Changes:** Focus changes need to be debounced to prevent visual flickering.
- **Focus Memory:** The application should remember which item was last focused in a collection.

The `useFocusCollection` hook addresses these needs with a specialized API for collections of focusable elements.

### The useFocusCollection implementation

The hook manages a map of references to focusable elements and provides functions for controlling focus.

**Example: useFocusCollection**

```javascript
import { useRef, useEffect, useCallback, useState } from 'react';
import type { TouchableOpacity, Pressable } from 'react-native';

// Types
type FocusableElement =
  | React.ComponentRef<typeof TouchableOpacity>
  | React.ComponentRef<typeof Pressable>
  | null;

interface UseFocusCollectionResult {
  registerRef: (id: string, ref: FocusableElement) => void;
  focusItem: (id: string) => void;
  blurItem: (id: string) => void;
  getCurrentFocused: () => string | null;
}

/**
 * A custom hook for managing focus across multiple focusable elements.
 * Useful for implementing focus management in lists, grids, or any collection of focusable items.
 * Includes debouncing to prevent rapid focus changes.
 */
export const useFocusCollection = (): UseFocusCollectionResult => {
  const refs = useRef(new Map<string, FocusableElement>());
  const [currentFocusedId, setCurrentFocusedId] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Implementation details...

  return {
    registerRef,
    focusItem,
    blurItem,
    getCurrentFocused: () => currentFocusedId,
  };
};
```

### Key functions

The `useFocusCollection` hook provides several key functions:

- **registerRef**

  This function performs the following:
  - Associates a React Native reference with a unique identifier.
  - Adds or removes elements from the collection.
  - Is typically called during component render or mounting.

  ```javascript
  const registerRef = (id: string, ref: FocusableElement) => {
    if (ref) {
      refs.current.set(id, ref);
    } else {
      refs.current.delete(id);
    }
  };
  ```

- **focusItem**

  This function performs the following:
  - Focuses a specific item in the collection by its ID.
  - Debounces focus changes to prevent flickering.
  - Updates the current focused item state.
  - Uses `setTimeout` for improved performance.

  ```javascript
  const focusItem = useCallback((id: string) => {
    // Clear any pending focus operations
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce the focus operation by 150ms
    timeoutRef.current = setTimeout(() => {
      const element = refs.current.get(id);
      if (element) {
        element.focus();
        setCurrentFocusedId(id);
      }
    }, 150);
  }, []);
  ```

- **blurItem**

  This function performs the following:
  - Removes focus from a specific item.
  - Clears the current focused item state.
  - Is useful when programmatically moving focus elsewhere.

  ```javascript
  const blurItem = useCallback((id: string) => {
    const element = refs.current.get(id);
    if (element) {
      element.blur();
      setCurrentFocusedId(null);
    }
  }, []);
  ```

- **getCurrentFocused**

  This function performs the following:
  - Returns the ID of the currently focused item.
  - Allows components to check focus state.
  - Is useful for conditional rendering based on focus.

  ```javascript
  getCurrentFocused: () => currentFocusedId;
  ```

**Cleanup and Lifecycle Handling**

The hook includes proper cleanup to prevent memory leaks.

**Example: Hook cleanup and lifecycle handling**

```javascript
useEffect(() => {
  return () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
}, []);
```

### Usage examples

**Example: Basic menu with focus collection**

```javascript
import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useFocusCollection } from '@AppSrc/hooks';

const menuItems = [
  { id: 'home', label: 'Home' },
  { id: 'movies', label: 'Movies' },
  { id: 'shows', label: 'TV Shows' },
  { id: 'settings', label: 'Settings' },
];

export const MainMenu = () => {
  const { registerRef, focusItem, getCurrentFocused } = useFocusCollection();

  // Auto-focus the first item when the menu mounts
  useEffect(() => {
    focusItem('home');
  }, [focusItem]);

  return (
    <View style={styles.menu}>
      {menuItems.map(item => (
        <Pressable
          key={item.id}
          ref={ref => registerRef(item.id, ref)}
          style={[
            styles.menuItem,
            getCurrentFocused() === item.id && styles.focusedMenuItem,
          ]}
          onFocus={() => console.log(`${item.label} focused`)}
          onPress={() => console.log(`${item.label} pressed`)}
        >
          <Text style={styles.menuText}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  menu: {
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  menuItem: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  focusedMenuItem: {
    backgroundColor: '#0078D7',
    transform: [{ scale: 1.05 }],
  },
  menuText: {
    color: 'white',
    fontSize: 18,
  },
});
```

### Example: Modal with focus management

```javascript
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { useFocusCollection } from '@AppSrc/hooks';

const BUTTON_IDS = {
  CONFIRM: 'confirm-button',
  CANCEL: 'cancel-button',
};

export const ConfirmationModal = ({ isVisible, onConfirm, onCancel }) => {
  const { registerRef, focusItem, blurItem } = useFocusCollection();
  const [focusedButton, setFocusedButton] = (useState < string) | (null > null);

  // When the modal opens, focus the confirm button
  useEffect(() => {
    if (isVisible) {
      // Short delay to ensure the modal is rendered
      setTimeout(() => {
        focusItem(BUTTON_IDS.CONFIRM);
        setFocusedButton(BUTTON_IDS.CONFIRM);
      }, 50);
    }

    // Clean up when modal closes
    return () => {
      blurItem(BUTTON_IDS.CONFIRM);
      blurItem(BUTTON_IDS.CANCEL);
      setFocusedButton(null);
    };
  }, [isVisible, focusItem, blurItem]);

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Confirm Action</Text>
          <Text style={styles.message}>
            Are you sure you want to proceed with this action?
          </Text>

          <View style={styles.buttonContainer}>
            <Pressable
              ref={ref => registerRef(BUTTON_IDS.CONFIRM, ref)}
              style={[
                styles.button,
                styles.confirmButton,
                focusedButton === BUTTON_IDS.CONFIRM && styles.focusedButton,
              ]}
              onPress={onConfirm}
              onFocus={() => setFocusedButton(BUTTON_IDS.CONFIRM)}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </Pressable>

            <Pressable
              ref={ref => registerRef(BUTTON_IDS.CANCEL, ref)}
              style={[
                styles.button,
                focusedButton === BUTTON_IDS.CANCEL && styles.focusedButton,
              ]}
              onPress={onCancel}
              onFocus={() => setFocusedButton(BUTTON_IDS.CANCEL)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Style definitions...
});
```

### Example: Grid with focus collection

```javascript
import React, { useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useFocusCollection } from '@AppSrc/hooks';

const { width } = Dimensions.get('window');
const COLUMNS = 3;
const ITEM_WIDTH = (width - 80) / COLUMNS;

export const ContentGrid = ({ items, onItemSelect }) => {
  const { registerRef, focusItem, getCurrentFocused } = useFocusCollection();

  // Auto-focus the first item when the grid mounts
  useEffect(() => {
    if (items.length > 0) {
      focusItem(`grid-item-${items[0].id}`);
    }
  }, [items, focusItem]);

  const renderItem = ({ item, index }) => {
    const itemId = `grid-item-${item.id}`;
    const isFocused = getCurrentFocused() === itemId;

    return (
      <Pressable
        ref={ref => registerRef(itemId, ref)}
        style={[styles.gridItem, isFocused && styles.focusedGridItem]}
        onPress={() => onItemSelect(item)}
        onFocus={() => console.log(`Item ${item.title} focused`)}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
        </View>
        <Text style={styles.itemTitle} numberOfLines={1}>
          {item.title}
        </Text>
      </Pressable>
    );
  };

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      numColumns={COLUMNS}
      style={styles.grid}
      contentContainerStyle={styles.gridContent}
    />
  );
};

const styles = StyleSheet.create({
  // Style definitions...
});
```

### Recommended practices

- **Use consistent ID format.** Create a consistent naming pattern for item IDs.

  Example:

  ```javascript
  // Define a function to generate consistent IDs
  const getItemId = (prefix, item) => `${prefix}-${item.id}`;

  // Use throughout your component
  const itemId = getItemId('menu', item);
  registerRef(itemId, ref);
  focusItem(itemId);
  ```

- **Clean up references.** Ensure references are properly cleaned up when components unmount.

  Example:

  ```javascript
  useEffect(() => {
    return () => {
      // Clear all registered items for this component
      itemIds.forEach(id => {
        // You might want to extend useFocusCollection to support batch operations
        unregisterRef(id);
      });
    };
  }, []);
  ```

## Data fetching and pagination

The `useVerticalPosters` hook demonstrates an optimized approach to data fetching and pagination specifically designed for TV interfaces. It leverages React Query's `useInfiniteQuery` to implement efficient infinite scrolling with proper loading states and caching.

### Why TV-optimized data fetching matters

TV interfaces present unique challenges for data fetching and content display.

- **Large content grids**: TV UIs typically display many items at once in grid layouts.
- **Remote-based navigation**: Users scroll through content with a remote, often moving rapidly.
- **Bandwidth Considerations**: TV apps may run on devices with varying network capabilities.
- **Performance Constraints**: Some TV devices have limited processing power.
- **Seamless Experience**: Users expect content to load progressively without disrupting navigation.

The `useVerticalPosters` hook addresses these challenges with TV-specific optimizations for content loading and pagination.

### The useVerticalPosters implementation

The hook combines React Native Query's powerful data fetching capabilities with TV-specific optimizations.

**Example: useVerticalPosters**

```javascript
import React from 'react';
import type { InfiniteData } from '@tanstack/react-query';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getVerticalPosters } from '../data/VerticalPosters';

interface QueryResponse {
  items: Array<{ id: string; title: string; imageUrl: string }>;
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
    // Configuration...
  });

  const items = React.useMemo(
    () => data?.pages.flatMap((page: QueryResponse) => page.items) ?? [],
    [data],
  );

  return {
    items,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  };
};
```

### Key Components of the Implementation

- **Pagination function.**

  Example:

  ```javascript
  const paginatePosters = (
    allPosters: string[],
    page: number,
    itemsPerPage: number,
  ) => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return allPosters.slice(start, end);
  };
  ```

  This function performs the following:
  - Takes the data source, current page, and page size.
  - Calculates the appropriate slice of data to return.
  - Creates consistent pagination behavior.

- **Query configuration.**

  Example:

  ```javascript
  {
    queryKey: ['verticalPosters'],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      const allPosters = getVerticalPosters();
      const paginatedPosters = paginatePosters(
        allPosters,
        pageParam,
        ITEMS_PER_PAGE,
      );

      return {
        items: paginatedPosters.map((imageUrl, index) => ({
          id: `${(pageParam - 1) * ITEMS_PER_PAGE + index}`,
          title: `Poster ${(pageParam - 1) * ITEMS_PER_PAGE + index + 1}`,
          imageUrl,
        })),
        nextPage:
          pageParam * ITEMS_PER_PAGE < allPosters.length
            ? pageParam + 1
            : undefined,
      };
    },
    getNextPageParam: lastPage => lastPage.nextPage,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
  }
  ```

  This configuration performs the following:
  - Defines a unique cache key for the query.
  - Sets the initial page to 1.
  - Implements the query function that retrieves and formats data.
  - Determines if more pages are available.
  - Sets aggressive caching (24 hours) to reduce unnecessary fetches.

- **TV-specific optimizations.**

  Example:

  ```javascript
  // TV-optimized page size (larger than typical mobile)
  const ITEMS_PER_PAGE = 24;

  // Long cache durations to reduce network requests
  staleTime: 1000 * 60 * 60 * 24,  // 24 hours
  gcTime: 1000 * 60 * 60 * 24,     // 24 hours

  // Memoized data flattening to prevent unnecessary re-renders
  const items = React.useMemo(
    () => data?.pages.flatMap((page: QueryResponse) => page.items) ?? [],
    [data],
  );
  ```

  These optimizations do the following:
  - Use a larger page size appropriate for TV grid layouts.
  - Implement aggressive caching to reduce network requests.
  - Memoize data transformations to prevent performance issues.

### Usage examples

### Example: Basic grid with infinite scrolling

```javascript
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useVerticalPosters } from '@AppSrc/hooks';
import { Grid } from '@AppComponents/Grid';

export const PosterGallery = () => {
  const {
    items,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useVerticalPosters();

  const handleLoadMore = React.useCallback(() => {
    if (hasNextPage && !isFetching) {
      void fetchNextPage();
    }
  }, [hasNextPage, isFetching, fetchNextPage]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Grid
        items={items}
        onEndReached={handleLoadMore}
        isLoading={isLoading}
        isFetching={isFetching}
        isFetchingNextPage={isFetchingNextPage}
      />
    </View>
  );
};
```

### Example: With loading states and error handling

```javascript
import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useVerticalPosters } from '@AppSrc/hooks';
import { Grid } from '@AppComponents/Grid';

export const EnhancedPosterGallery = () => {
  const {
    items,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isError,
    error,
  } = useVerticalPosters();

  const handleLoadMore = React.useCallback(() => {
    if (hasNextPage && !isFetching) {
      void fetchNextPage();
    }
  }, [hasNextPage, isFetching, fetchNextPage]);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading content...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorMessage}>
          {error?.message || 'Failed to load content'}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchNextPage()}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {items.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No content available</Text>
        </View>
      ) : (
        <>
          <Grid
            items={items}
            onEndReached={handleLoadMore}
            isLoading={isLoading}
            isFetching={isFetching}
            isFetchingNextPage={isFetchingNextPage}
          />

          {isFetchingNextPage && (
            <View style={styles.paginationLoader}>
              <ActivityIndicator size="small" />
              <Text style={styles.paginationText}>Loading more...</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Style definitions...
});
```

### Example: Extending with category filtering

```javascript
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useVerticalPosters } from '@AppSrc/hooks';
import { Grid } from '@AppComponents/Grid';

// Example of extending the base hook for more specific use cases
const useFilteredPosters = category => {
  const posterData = useVerticalPosters();

  // Memoized filtering based on category
  const filteredItems = React.useMemo(() => {
    if (!category || category === 'all') {
      return posterData.items;
    }
    return posterData.items.filter(item => {
      // This is a placeholder; in a real app, items would have category data
      const itemCategory = getItemCategory(item);
      return itemCategory === category;
    });
  }, [posterData.items, category]);

  return {
    ...posterData,
    items: filteredItems,
  };
};

export const CategoryPosterGallery = () => {
  const [category, setCategory] = useState('all');
  const {
    items,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useFilteredPosters(category);

  const categories = ['all', 'movies', 'shows', 'documentaries'];

  return (
    <View style={styles.container}>
      <View style={styles.categorySelector}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryButton,
              category === cat && styles.activeCategoryButton,
            ]}
            onPress={() => setCategory(cat)}
          >
            <Text style={styles.categoryText}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Grid
          items={items}
          onEndReached={() => hasNextPage && !isFetching && fetchNextPage()}
          isLoading={isLoading}
          isFetching={isFetching}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}
    </View>
  );
};
```

### Recommended practices

- **Optimize page size for TV.** TV interfaces typically benefit from larger page sizes than mobile.

  Example:

  ```javascript
  // Good page size for TV grid layouts (adjust based on your design)
  const ITEMS_PER_PAGE = 24; // 6 columns × 4 rows
  ```

- **Implement proper loading states.** TV users expect clear feedback during data loading.

  Example:

  ```javascript
  // Initial loading
  if (isLoading) {
    return <FullScreenLoading />;
  }

  // Pagination loading (at bottom of content)
  {
    isFetchingNextPage && (
      <View style={styles.bottomLoader}>
        <ActivityIndicator />
        <Text>Loading more...</Text>
      </View>
    );
  }
  ```

- **Throttle load more triggers.** Prevent rapid pagination triggers during fast scrolling.

  Example:

  ```javascript
  // Simple throttling approach without external dependencies
  const handleLoadMore = React.useCallback(() => {
    // Use a ref to track last fetch time
    if (hasNextPage && !isFetching && !isThrottlingRef.current) {
      isThrottlingRef.current = true;

      // Load the next page
      void fetchNextPage();

      // Reset throttle after delay
      setTimeout(() => {
        isThrottlingRef.current = false;
      }, 300);
    }
  }, [hasNextPage, isFetching, fetchNextPage]);

  // Initialize throttling ref in component
  const isThrottlingRef = React.useRef(false);
  ```

  **Note**: This implementation doesn't use external libraries like lodash. If you prefer using lodash's debounce or throttle functions, you would need to add it as a dependency to your project.

- **Pre-load next page.** Consider pre-loading the next page before the user reaches the end.

  Example:

  ```javascript
  // In your FlatList or ScrollView
  <FlatList
    data={items}
    renderItem={renderItem}
    onEndReached={handleLoadMore}
    onEndReachedThreshold={0.5} // Start loading when user is halfway through current content
  />
  ```

- **Optimize cache duration.** Tune cache settings based on your content update frequency.

  Example:

  ```javascript
  // For content that rarely changes
  staleTime: 1000 * 60 * 60 * 24,  // 24 hours
  gcTime: 1000 * 60 * 60 * 24 * 7,  // 7 days

  // For more dynamic content
  staleTime: 1000 * 60 * 15,  // 15 minutes
  gcTime: 1000 * 60 * 60,     // 1 hour
  ```

### Performance considerations

### Data transformation

Minimize work during renders by using memoization.

Example:

```javascript
// Memoize expensive data transformations
const processedItems = React.useMemo(() => {
  return items.map(item => ({
    ...item,
    formattedTitle: formatTitle(item.title),
    processedImage: optimizeImageUrl(item.imageUrl),
  }));
}, [items]);
```

### Avoid unnecessary renders

Be careful with prop changes that might trigger re-renders.

Example:

```javascript
// Wrap callbacks in useCallback
const handleItemPress = React.useCallback(item => {
  // Handle item press
}, []);

// Use React.memo for list items
const MemoizedGridItem = React.memo(GridItem);
```

### Image Optimization

Optimize images for TV display to improve loading performance.

Example:

```javascript
// Request appropriate image sizes for TV display
const getOptimizedImageUrl = (url, width, height) => {
  return `${url}?w=${width}&h=${height}&fit=crop&q=90`;
};
```

### When to use this approach

This data fetching approach is particularly valuable with the following:

- Building content-heavy TV applications with many images or media items.
- Implementing infinite scrolling or pagination.
- Dealing with potentially slow or inconsistent network conditions.
- Optimizing for TV hardware with varying performance capabilities.

However, for simpler applications with limited content, you might not need the full complexity of this approach. In those cases, simpler data fetching with `useQuery` or even just `useState` with `fetch` might be sufficient.

### Extending the pattern

The pattern demonstrated in `useVerticalPosters` can be extended to other content types.

Example:

```javascript
// For a video library
export const useVideoLibrary = (category: string) => {
  // Similar implementation with video-specific fields
};

// For a music collection
export const useMusicCollection = (genre: string) => {
  // Similar implementation with music-specific fields
};
```

### Conclusion

The `useVerticalPosters` hook demonstrates a TV-optimized approach to data fetching and pagination. By leveraging React Native Query's powerful features and implementing TV-specific optimizations, it provides a smooth and efficient content browsing experience.

Remember that while this approach offers significant benefits for TV interfaces, it represents one pattern among many. Feel free to adapt it to your specific requirements, or use it as inspiration for your own data fetching solutions.

# Focus management for lists

The `useItemFocusManager` hook provides specialized focus management for scrollable lists in TV interfaces. Managing focus in lists presents unique challenges that this hook addresses, particularly when using virtualized lists like FlashList or FlatList that don't render all items at once.

This hook creates predictable focus paths and ensures proper scrolling behavior when navigating through list items with a TV remote control.

### Key features

- **Programmatic focus navigation**: Sets next/previous focus targets based on list structure.
- **Circular navigation**: Optional circular navigation at list boundaries.
- **Orientation support**: Works with both vertical and horizontal lists.
- **FlashList and FlatList integration**: Ensures proper scrolling when focus changes.
- **Dynamic reference management**: Handles references for virtualized items.

**Note**: Currently, the `useItemFocusManager` hook only supports `FlashList`. Support for other list types like `FlatList` is planned for future updates.

### Implementation details

**Example: Implementation**

```javascript
import type { RefObject } from 'react';
import { useCallback } from 'react';
import type { TouchableOpacity } from 'react-native';

import { findNodeHandle, FocusManager } from '@amazon-devices/react-native-kepler';
import type { FlashList } from '@amazon-devices/shopify__flash-list';

type UseItemFocusManagerParams<T> = {
  itemRefs: RefObject<Array<TouchableOpacity | null> | null>;
  flashListRef: RefObject<FlashList<T>>;
  dataLength: number;
  isCircular?: boolean;
  orientation?: 'vertical' | 'horizontal';
};

export const useItemFocusManager = <T,>({
  itemRefs,
  flashListRef,
  dataLength,
  isCircular = false,
  orientation = 'vertical',
}: UseItemFocusManagerParams<T>) => {
  // Implementation...
};
```

### Core function: handleChildRefsUpdate

The handleChildRefsUpdate hook returns a callback function that manages focus for each item.

**Example: handleChildRefsUpdate**

```javascript
const handleChildRefsUpdate = useCallback(
  (index: number) => (ref: TouchableOpacity | null) => {
    if (!ref || !itemRefs.current) {
      return;
    }

    itemRefs.current[index] = ref; // Store the reference

    const isLastItem = index === dataLength - 1;
    const isFirstItem = index === 0;

    // Determine next and previous indices
    let nextIndex = isLastItem ? 0 : index + 1;
    let prevIndex: number | null;
    if (isFirstItem) {
      prevIndex = isCircular ? dataLength - 1 : null;
    } else {
      prevIndex = index - 1;
    }

    // Get references to next and previous items
    let nextRef: TouchableOpacity | null = null;
    let prevRef: TouchableOpacity | null = null;

    if (itemRefs.current) {
      nextRef = itemRefs.current[nextIndex] ?? null;
      prevRef = prevIndex !== null ? (itemRefs.current[prevIndex] ?? null) : null;
    }

    // Get native handles for focus management
    const currentHandle = findNodeHandle(ref);
    const nextHandle = nextRef ? findNodeHandle(nextRef) : null;
    const prevHandle = prevRef ? findNodeHandle(prevRef) : null;

    // Configure focus direction based on orientation
    const nextDirection = orientation === 'vertical' ? 'down' : 'right';
    const prevDirection = orientation === 'vertical' ? 'up' : 'left';

    // Set up next focus directions
    if (currentHandle && nextHandle) {
      FocusManager.setNextFocus(currentHandle, nextHandle, nextDirection);
    }

    if (currentHandle && prevHandle) {
      FocusManager.setNextFocus(currentHandle, prevHandle, prevDirection);
    }

    // Special handling for the last item to enable circular navigation
    if (isLastItem && currentHandle) {
      ref.setNativeProps({
        onFocus: () => {
          flashListRef.current?.scrollToIndex({
            index: 0,
            animated: true,
          });
        },
      });
    }
  },
  [dataLength, itemRefs, flashListRef, isCircular, orientation],
);
```

This function performs the following:

- Stores a reference to each list item.
- Determines the next and previous items based on the current index.
- Configures focus navigation between items.
- Handles special cases for first and last items.
- Sets up scrolling behavior when needed.

### Native focus integration

The hook uses the native FocusManager to set programmatic focus targets.

**Example: FocusManager**

```javascript
// Set the next focus direction if handles are available
if (currentHandle && nextHandle) {
  FocusManager.setNextFocus(currentHandle, nextHandle, nextDirection);
}

// Set the previous focus direction if handles are available
if (currentHandle && prevHandle) {
  FocusManager.setNextFocus(currentHandle, prevHandle, prevDirection);
}
```

This approach performs the following:

- Works with the TV platform's native focus system.
- Creates reliable focus paths between items.
- Overrides default spatial navigation when needed.
- Ensures predictable remote control navigation.

### Circular navigation

The hook supports optional circular navigation at list boundaries.

**Example: Circular navigation**

```javascript
// Determine the next and previous indices
let nextIndex = isLastItem ? 0 : index + 1;
let prevIndex: number | null;
if (isFirstItem) {
  prevIndex = isCircular ? dataLength - 1 : null;
} else {
  prevIndex = index - 1;
}
```

When `isCircular` is `true`:

- Pressing "down" on the last item moves focus to the first item.
- Pressing "up" on the first item moves focus to the last item.
- The list automatically scrolls to maintain the focused item in view.

### Scroll synchronization

For the last item in a list, the hook sets up automatic scrolling.

**Example: Scroll synchronization**

```javascript
// If the current item is the last one, set a focus event to scroll to the top
if (isLastItem && currentHandle) {
  ref.setNativeProps({
    onFocus: () => {
      flashListRef.current?.scrollToIndex({
        index: 0,
        animated: true,
      });
    },
  });
}
```

This ensures the following:

- When circular navigation is enabled, scrolling follows focus.
- The list automatically returns to the top when reaching the end.
- The focused item is always visible.

### Usage examples

### Example: Basic vertical list

```javascript
import React, { useRef } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { FlashList } from '@amazon-devices/shopify__flash-list';
import { useItemFocusManager } from '@AppSrc/hooks/useItemFocusManager';

export const SimpleVerticalList = ({ items }) => {
  const flashListRef = useRef(null);
  const itemRefs = useRef([]);

  const handleChildRefsUpdate = useItemFocusManager({
    itemRefs,
    flashListRef,
    dataLength: items.length,
    // Default orientation is 'vertical'
  });

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      ref={handleChildRefsUpdate(index)}
      style={styles.item}
      hasTVPreferredFocus={index === 0}
    >
      <Text style={styles.itemText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlashList
        ref={flashListRef}
        data={items}
        renderItem={renderItem}
        estimatedItemSize={100}
      />
    </View>
  );
};
```

### Example: Horizontal carousel with circular navigation

```javascript
import React, { useRef } from 'react';
import { TouchableOpacity, Image, View } from 'react-native';
import { FlashList } from '@amazon-devices/shopify__flash-list';
import { useItemFocusManager } from '@AppSrc/hooks/useItemFocusManager';

export const CircularCarousel = ({ images }) => {
  const flashListRef = useRef(null);
  const itemRefs = useRef([]);

  const handleChildRefsUpdate = useItemFocusManager({
    itemRefs,
    flashListRef,
    dataLength: images.length,
    isCircular: true,
    orientation: 'horizontal',
  });

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      ref={handleChildRefsUpdate(index)}
      style={styles.carouselItem}
      hasTVPreferredFocus={index === 0}
    >
      <Image source={{ uri: item.url }} style={styles.carouselImage} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.carouselContainer}>
      <FlashList
        ref={flashListRef}
        data={images}
        renderItem={renderItem}
        horizontal
        estimatedItemSize={200}
      />
    </View>
  );
};
```

### Example: With box component integration

```javascript
import React, { useRef, useCallback } from 'react';
import { View } from 'react-native';
import { FlashList } from '@amazon-devices/shopify__flash-list';
import { Box } from '@AppComponents/core/Box/Box';
import { useItemFocusManager } from '@AppSrc/hooks/useItemFocusManager';

export const BoxList = ({ items }) => {
  const flashListRef = useRef(null);
  const itemRefs = useRef([]);

  const handleChildRefsUpdate = useItemFocusManager({
    itemRefs,
    flashListRef,
    dataLength: items.length,
  });

  const renderItem = useCallback(
    ({ item, index }) => (
      <Box
        ref={handleChildRefsUpdate(index)}
        variant="primary"
        style={styles.boxItem}
        focusStyle={styles.boxItemFocused}
        hasTVPreferredFocus={index === 0}
        onPress={() => console.log(`Item ${item.id} pressed`)}
      >
        <Text style={styles.boxItemText}>{item.title}</Text>
      </Box>
    ),
    [items, handleChildRefsUpdate],
  );

  return (
    <View style={styles.listContainer}>
      <FlashList
        ref={flashListRef}
        data={items}
        renderItem={renderItem}
        estimatedItemSize={120}
      />
    </View>
  );
};
```

### Recommended practices for list focus management

- **Initialize item references.** Always initialize the `itemRefs` reference with `useRef`.

  Example:

  ```javascript
  const itemRefs = useRef<TouchableOpacity[]>([]);
  ```

  This creates the following:
  - A stable reference that persists across renders.
  - A container for all item references.
  - A reference that can be passed to the hook.

- **Pass correct references.** Ensure the FlashList reference is properly passed.

  Example:

  ```javascript
  const flashListRef = useRef < FlashList < Item >> null;

  // Later in the component
  <FlashList
    ref={flashListRef}
    // Other props...
  />;
  ```

  This enables the following:
  - Programmatic scrolling when needed.
  - Synchronization between focus and scroll position.
  - Proper handling of virtualized items.

- **Apply references correctly.** Use the callback from `useItemFocusManager` correctly.

  Example:

  ```javascript
  <TouchableOpacity
    ref={handleChildRefsUpdate(index)}
    // Other props...
  >
    {/* Item content */}
  </TouchableOpacity>
  ```

  This ensures the following:
  - Each item is properly registered.
  - Focus paths are set up correctly.
  - The component receives focus events.

- **Consider Orientation.** Set the appropriate orientation for your list.

  Example:

  ```javascript
  const handleChildRefsUpdate = useItemFocusManager({
    // Other props...
    orientation: 'horizontal', // For horizontal lists
  });
  ```

  This configures the following:
  - Proper directional focus navigation.
  - Intuitive controls with the remote.
  - Consistent user experience.

- **Use Circular Navigation When Appropriate.** Enable circular navigation for carousel-like experiences.

  Example:

  ```javascript
  const handleChildRefsUpdate = useItemFocusManager({
    // Other props...
    isCircular: true,
  });
  ```

  This creates the following:
  - A looping navigation experience.
  - Continuous scrolling at list boundaries.
  - More TV-friendly browsing for certain content types.

### Advanced use cases

### Example: Nested lists

When dealing with nested lists (lists within lists), special care is needed.

```javascript
// Outer list item renderer
const renderCategory = ({ item: category, index: categoryIndex }) => (
  <View>
    <Text style={styles.categoryTitle}>{category.title}</Text>
    <FlashList
      ref={ref => {
        if (ref) {
          categoriesListRefs.current[categoryIndex] = ref;
        }
      }}
      data={category.items}
      horizontal
      renderItem={({ item: subItem, index: subIndex }) =>
        renderSubItem(subItem, subIndex, categoryIndex)
      }
      // Other props...
    />
  </View>
);

// Sub-item renderer with nested focus management
const renderSubItem = (item, index, categoryIndex) => (
  <TouchableOpacity
    ref={ref => {
      if (ref && itemRefs.current[categoryIndex]) {
        itemRefs.current[categoryIndex][index] = ref;

        // Handle focus management for this nested item
        // You would need a more complex version of useItemFocusManager
        // or custom logic here
      }
    }}
    // Other props...
  >
    {/* Item content */}
  </TouchableOpacity>
);
```

### Example: Dynamic lists

For lists that change during runtime.

```javascript
// Reset focus when the list content changes
useEffect(() => {
  // Clear existing refs when data changes
  itemRefs.current = new Array(items.length);

  // If the list isn't empty, focus the first item
  if (items.length > 0 && firstItemRef.current) {
    setTimeout(() => {
      firstItemRef.current.focus();
    }, 100);
  }
}, [items]);
```

### Performance considerations

### Reference management

The hook efficiently manages references to minimize performance impact.

**Example: Reference management**

```javascript
// Only update the reference if it exists
if (!ref || !itemRefs.current) {
  return;
}
itemRefs.current[index] = ref;
```

This approach includes the following:

- Only stores valid references.
- Updates references individually.
- Avoids unnecessary state updates.

### Memoization

Use `useCallback` to prevent unnecessary re-renders.

**Example: `useCallback`**

```javascript
const renderItem = useCallback(
  ({ item, index }) => (
    <TouchableOpacity ref={handleChildRefsUpdate(index)}>
      {/* Item content */}
    </TouchableOpacity>
  ),
  [handleChildRefsUpdate],
);
```

This ensures the following:

- The render function doesn't change on every render.
- `FlashList` optimization works properly.
- Smooth scrolling and navigation.

### Focus event optimization

The hook sets focus events only when necessary.

**Example: Focus event**

```javascript
// Only set special focus handling for the last item
if (isLastItem && currentHandle) {
  ref.setNativeProps({
    onFocus: () => {
      flashListRef.current?.scrollToIndex({
        index: 0,
        animated: true,
      });
    },
  });
}
```

This prevents the following:

- Unnecessary event handlers on all items.
- Performance overhead from too many focus listeners.
- Potential memory leaks.

### Conclusion

The `useItemFocusManager` hook provides a powerful solution for managing focus in lists for TV interfaces. By programmatically setting focus paths and handling scroll synchronization, it creates a smooth, intuitive navigation experience with a TV remote control.

Whether you're building a simple vertical list, a horizontal carousel, or a complex grid layout, this hook helps ensure that your TV interface provides consistent, predictable focus behavior that enhances the user experience.

# Poster pagination hooks

The poster pagination system provides efficient data loading and skeleton preloading for large content lists in TV interfaces. These hooks manage content generation, infinite scrolling, and smooth loading states using React Query integration.

The system is designed for displaying poster grids with different row layouts, handling thousands of items while maintaining smooth performance through batched loading and intelligent caching.

### What happens behind the scroll?

When the user scrolls down:

- `FlashList` detects the end (`onEndReached`).
- It calls `fetchNextPage()` from the `usePosterRowsWithSkeletonPreload` hook.
- This immediately generates n skeleton rows.
- In the background, real data (with image URLs and layout info) is loaded.
- Skeletons are automatically replaced once the real data is ready.
- When a card is rendered, image prefetching is triggered if it’s visible or focused.

```text
User Scrolls ↓
    │
    ├──> FlashList `onEndReached`
    │       │
    │       ├──> Skeletons rendered
    │       └──> React Query `fetchNextPage`
    │               └──> `getPosterRowsPageWithSkeletons`
    │                         ├──> Real rows
    │                         └──> Skeleton rows
    │
    └── FlexibleCard
           ├──> useEffect → prefetch(image)
           └──> setShouldShowImage(true)
```

### Key features

- **Infinite scrolling**: Loads content in small batches as users navigate.
- **Skeleton preloading**: Shows immediate placeholders while content loads.
- **Layout variety**: Supports different row sizes and orientations.
- **React Query integration**: Provides caching, error handling, and state management.
- **Performance optimized**: Generates content on-demand with minimal memory usage.

### Implementation details

**Example: Basic hook usage**

```javascript
import { usePosterRows } from '@AppSrc/hooks/usePosterRows';

export const BasicPosterList = () => {
  const { rows, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    usePosterRows();

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView onEndReached={handleLoadMore}>
      {rows.map(row => (
        <PosterRow key={row.rowIndex} data={row} />
      ))}
    </ScrollView>
  );
};
```

This basic implementation provides infinite scrolling with automatic content loading. The hook manages data fetching, caching, and loading states automatically.

### Core hook: usePosterRows

The `usePosterRows` hook provides basic infinite pagination functionality using React Query.

**Example: usePosterRows configuration**

```javascript
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
          rows: getPosterRowsPage({ page: 0, pageSize: TOTAL_ROWS_PER_BATCH }),
          page: 0,
        },
      ],
      pageParams: [0],
    },
  });
```

This hook performs the following:

- Uses React Query's `useInfiniteQuery` for automatic caching and state management.
- Loads content in pages of 3 rows each (configurable via `TOTAL_ROWS_PER_BATCH`).
- Provides initial data to prevent loading states on first render.
- Automatically determines when more pages are available.

### Enhanced hook: usePosterRowsWithSkeletonPreload

The skeleton preload hook provides immediate visual feedback while content loads in the background.

**Example: Skeleton preloading implementation**

```javascript
export const usePosterRowsWithSkeletonPreload = () => {
  const [mergedRows, setMergedRows] = useState<ContentRow[]>([]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    status,
  } = useInfiniteQuery({
    queryKey: ['posterRows'],
    queryFn: ({ pageParam = 0 }) => {
      const { rows, skeletonRows } = getPosterRowsPageWithSkeletons({
        page: pageParam,
        pageSize: TOTAL_ROWS_PER_BATCH,
        includeSkeletons: true,
      });

      return Promise.resolve({
        real: rows,
        skeleton: skeletonRows,
        page: pageParam,
      });
    },
    initialPageParam: 0,
    getNextPageParam: lastPage =>
      lastPage.real.length < TOTAL_ROWS_PER_BATCH
        ? undefined
        : lastPage.page + 1,
  });

  // Merge skeleton and real data
  useEffect(() => {
    if (!data) return;

    const allReal = data.pages.flatMap(p => p.real);
    const allSkeletons = data.pages.flatMap(p => p.skeleton);

    const merged = allSkeletons
      .filter(s => s.rowIndex < TOTAL_POSTER_ROWS)
      .map((skeletonRow, index) => {
        const realRow = allReal[index];
        return realRow?.data.some(item => !item.isSkeleton)
          ? realRow
          : skeletonRow;
      });

    setMergedRows(merged);
  }, [data]);

  return {
    rows: mergedRows,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    isPreloading: isLoading,
    status,
  };
};
```

This enhanced hook provides the following:

- Shows skeleton placeholders immediately for perceived performance.
- Fetches real content in the background while skeletons are visible.
- Merges skeleton and real data based on availability.
- Provides smooth transitions between loading and loaded states.

### Content generation: getPosterRowsPage

The content generation function creates poster rows with varied layouts and animations.

**Example: Content generation**

```javascript
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
```

This function handles the following:

- Calculates proper row boundaries for the requested page.
- Applies varied layout configurations based on row position.
- Generates unique IDs and indices for each item.
- Handles image selection and empty URL fallbacks.
- Creates consistent data structure for rendering.

### Usage examples

### Example: Real-world FlashList integration

```javascript
import React, { memo, useCallback, useRef, useMemo, useState } from 'react';
import { ActivityIndicator, Dimensions, View } from 'react-native';
import { FlashList } from '@amazon-devices/shopify__flash-list';
import { usePosterRowsWithSkeletonPreload } from '@AppSrc/hooks/usePosterRows';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const FlexibleCardGrid = memo(() => {
  const verticalRef = useRef<FlashList<PosterRowData>>(null);
  const [visibleRowIndices, setVisibleRowIndices] = useState<Set<number>>(new Set());

  // Use the enhanced hook with skeleton preloading
  const {
    rows: contentRows,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePosterRowsWithSkeletonPreload();

  // Add hero carousel at the top
  const rows: PosterRowData[] = useMemo(() => {
    return [{ type: 'hero' } as const, ...contentRows];
  }, [contentRows]);

  const scrollVertically = useCallback((index: number) => {
    verticalRef.current?.scrollToIndex({
      animated: true,
      index: index + 1,
      viewPosition: 0.5,
    });
  }, []);

  const renderItem = useCallback(({ item }: { item: PosterRowData }) => {
    if (item.type === 'hero') {
      return <HeroCarousel />;
    }

    return (
      <PosterRow
        row={item}
        scrollVertically={scrollVertically}
        visibleRowIndices={visibleRowIndices}
      />
    );
  }, [scrollVertically, visibleRowIndices]);

  return (
    <View>
      {isFetchingNextPage && (
        <ActivityIndicator size="large" color="white" />
      )}
      <FlashList<PosterRowData>
        ref={verticalRef}
        data={rows}
        keyExtractor={item =>
          item.type === 'hero' ? 'hero-carousel' : `row-${item.rowIndex}`
        }
        renderItem={renderItem}
        estimatedItemSize={200}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        removeClippedSubviews={true}
      />
    </View>
  );
});
```

### Example: FlexibleCard component integration

```javascript
import React, { memo } from 'react';
import { usePosterRowsWithSkeletonPreload } from '@AppSrc/hooks/usePosterRows';
import { FlexibleCard } from '@AppComponents/FlexibleCard';

export const PosterRow = memo(
  ({ row, scrollVertically, visibleRowIndices }) => {
    const isRowVisible = visibleRowIndices?.has(row.rowIndex) ?? false;

    const renderCard = (item, index) => (
      <FlexibleCard
        key={item.id}
        index={index}
        rowIndex={row.rowIndex}
        imageUrl={item.imageUrl}
        size={row.layoutConfig.size}
        direction={row.layoutConfig.direction}
        animations={row.layoutConfig.animations}
        isSkeleton={item.isSkeleton}
        isRowVisible={isRowVisible}
        scroll={{
          vertically: scrollVertically,
          horizontally: cardIndex => {
            // Handle horizontal scrolling within the row
          },
        }}
      />
    );

    return (
      <View style={styles.row}>
        <Text style={styles.rowTitle}>{row.title}</Text>
        <View style={styles.cardContainer}>{row.data.map(renderCard)}</View>
      </View>
    );
  },
);

// Usage with the pagination hook
export const EnhancedPosterGrid = () => {
  const { rows, fetchNextPage, hasNextPage, isPreloading } =
    usePosterRowsWithSkeletonPreload();

  return (
    <FlashList
      data={rows}
      renderItem={({ item }) => <PosterRow row={item} />}
      onEndReached={() => hasNextPage && fetchNextPage()}
    />
  );
};
```

### Example: Advanced layout with viewability tracking

```javascript
import React, { useCallback, useState } from 'react';
import { FlashList } from '@amazon-devices/shopify__flash-list';
import { usePosterRowsWithSkeletonPreload } from '@AppSrc/hooks/usePosterRows';

export const OptimizedPosterGrid = () => {
  const [visibleRowIndices, setVisibleRowIndices] = useState<Set<number>>(new Set());

  const {
    rows,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = usePosterRowsWithSkeletonPreload();

  // Custom layout override for different row types
  const overrideItemLayout = useCallback((layout, item) => {
    if (item.type === 'hero') {
      layout.size = 895; // Hero carousel height
    } else {
      // Calculate row height based on card size and layout
      const cardHeight = getCardHeight(item.layoutConfig.size, item.layoutConfig.direction);
      layout.size = cardHeight + 169; // Add padding and margins
    }
  }, []);

  // Track which rows are currently visible for optimization
  const handleViewableItemsChanged = useCallback(({ viewableItems }) => {
    const newVisible = new Set<number>();

    for (const vi of viewableItems) {
      if (vi.item.type === 'row') {
        newVisible.add(vi.item.rowIndex);
      }
    }

    setVisibleRowIndices(newVisible);
  }, []);

  const renderItem = useCallback(({ item }) => {
    if (item.type === 'hero') {
      return <HeroCarousel />;
    }

    return (
      <PosterRow
        row={item}
        visibleRowIndices={visibleRowIndices}
        // Pass visibility state for performance optimization
      />
    );
  }, [visibleRowIndices]);

  return (
    <FlashList
      data={rows}
      renderItem={renderItem}
      keyExtractor={item =>
        item.type === 'hero' ? 'hero-carousel' : `row-${item.rowIndex}`
      }
      getItemType={(item) => item.type}
      overrideItemLayout={overrideItemLayout}
      onEndReached={() => hasNextPage && fetchNextPage()}
      onEndReachedThreshold={0.5}
      onViewableItemsChanged={handleViewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 20,
        minimumViewTime: 100,
      }}
      removeClippedSubviews={true}
      drawDistance={Number.MAX_SAFE_INTEGER}
    />
  );
};
```

## Recommended practices for pagination

- **Example: Configure batch size appropriately.**

  Adjust `TOTAL_ROWS_PER_BATCH` based on your content and performance needs.

  ```javascript
  // For heavy content, use smaller batches
  export const TOTAL_ROWS_PER_BATCH = 2;

  // For lighter content, larger batches work well
  export const TOTAL_ROWS_PER_BATCH = 5;
  ```

  When batch size is configured appropriately, the following is provided:
  - Better perceived performance with appropriate loading times.
  - Reduced memory usage for complex content.
  - Smooth scrolling experience.

- **Example: Use skeleton preloading for better UX.**

  The skeleton hook provides immediate visual feedback.

  ```javascript
  // Choose the enhanced hook for better user experience
  const { rows, fetchNextPage, isPreloading } =
    usePosterRowsWithSkeletonPreload();

  // Show skeletons during initial load
  if (isPreloading && rows.length === 0) {
    return <SkeletonGrid />;
  }
  ```

  Skeleton preloading creates the following:
  - Immediate visual feedback on first load.
  - Smooth transitions between loading and loaded states.
  - Better perceived performance.

- **Example: Handle loading states properly.**

  Provide clear feedback during content loading.

  ```javascript
  const { rows, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    usePosterRows();

  // Show loading indicator at the bottom while fetching more
  const renderFooter = () => {
    if (!isFetchingNextPage) return null;

    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="large" />
        <Text>Loading more content...</Text>
      </View>
    );
  };
  ```

  Handling loading states properly ensures the following:
  - Users understand when content is loading.
  - Clear distinction between initial and incremental loading.
  - Consistent loading experience.

- **Example: Optimize scroll thresholds.**

  Set appropriate trigger points for loading more content.

  ```javascript
  <FlashList
    data={rows}
    renderItem={renderItem}
    onEndReached={handleLoadMore}
    onEndReachedThreshold={0.8} // Load when 80% scrolled
    removeClippedSubviews={true} // Optimize memory usage
    estimatedItemSize={200}
  />
  ```

  Optimizing scroll thresholds provides the following:
  - Content loads before users reach the end.
  - Smooth scrolling without interruptions.
  - Better memory management for large lists.

### Performance considerations

### Memory management

The pagination system is designed to minimize memory usage while providing smooth experiences.

**Example: Memory optimization**

```javascript
// The system loads content in small batches
const TOTAL_ROWS_PER_BATCH = 3; // Only 3 rows at a time.
const ITEMS_PER_ROW = 18; // 18 items per row.

// This means only ~54 items are loaded per batch.
// Instead of loading all 540 items (30 rows × 18 items) at once.
```

Memory optimization provides the following:

- Reduced initial load time and memory usage.
- Smooth performance even with large content sets.
- Efficient image loading and caching.

### Caching strategy

React Query provides automatic caching for improved performance.

**Example: Cache configuration**

```javascript
// React Query automatically caches results by queryKey.
const { data } = useInfiniteQuery({
  queryKey: ['posterRows'], // All queries with this key share cache.
  queryFn: fetchPosterRows,
  staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes.
  cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes.
});
```

Cache configuration ensures the following:

- Previously loaded content is instantly available.
- Reduced network requests for repeated navigation.
- Better offline experience.

### Content generation optimization

The content generation functions are optimized for performance.

**Example: Efficient generation**

```javascript
// Images are pre-shuffled and reused efficiently
const images = repeatUntil(
  [...HorizontalPosters, ...VerticalPosters],
  estimatedImages,
);

// Global indices are calculated incrementally
let globalIndex = startRow * ITEMS_PER_ROW;

// Layout configurations are cached and reused
const { size, direction } = ROW_ORDER[rowIndex % ROW_ORDER.length];
```

Efficient generation provides the following:

- Fast content generation without expensive calculations.
- Consistent performance across all pages.
- Minimal impact on scroll smoothness.

### Conclusion

The poster pagination hooks provide a comprehensive solution for handling large content lists in TV interfaces. By combining infinite scrolling, skeleton preloading, and intelligent caching, they deliver smooth user experiences while maintaining optimal performance.

Whether you need basic infinite scrolling or enhanced loading with skeleton states, these hooks provide the flexibility and performance required for professional TV applications. The system's modular design allows you to start simple and add complexity as your requirements grow.

# Image prefetch queue management

The `useImagePrefetchQueue` hook provides efficient image preloading with concurrency control for TV interfaces. This hook manages a queue of image prefetch requests, limiting the number of concurrent network requests to optimize performance and prevent overwhelming the device's resources.

The system is designed for smooth image loading in content-heavy applications, ensuring that images are preloaded in the background while maintaining optimal network and memory usage.

### Key features

- **Concurrency control**: Limits the number of simultaneous prefetch requests.
- **Priority-based queuing**: Supports priority levels for different image loading scenarios.
- **Promise-based API**: Provides async/await support for prefetch operations.
- **Subscription system**: Allows monitoring of active request counts.
- **Automatic cleanup**: Handles queue cleanup on component unmount.

### Implementation details

**Example: Basic hook usage**

```javascript
import { useImagePrefetchQueue } from '@AppSrc/hooks/useImagePrefetchQueue';

export const ImageGallery = ({ images }) => {
  const { prefetch, subscribe } = useImagePrefetchQueue(5);

  const handleImageLoad = async imageUrl => {
    try {
      await prefetch(imageUrl);
      console.log('Image prefetched successfully');
    } catch (error) {
      console.error('Failed to prefetch image:', error);
    }
  };

  useEffect(() => {
    // Prefetch visible images with high priority
    images.slice(0, 3).forEach((image, index) => {
      prefetch(image.url, 1); // Priority 1 (highest)
    });

    // Prefetch remaining images with lower priority
    images.slice(3).forEach(image => {
      prefetch(image.url, 3); // Priority 3 (lower)
    });
  }, [images, prefetch]);

  return (
    <View>
      {images.map(image => (
        <Image key={image.id} source={{ uri: image.url }} />
      ))}
    </View>
  );
};
```

This basic implementation shows how to prefetch images with different priority levels based on visibility and importance.

### Core hook: useImagePrefetchQueue

The hook manages a priority queue with configurable concurrency limits.

**Example: Hook implementation**

```javascript
export const useImagePrefetchQueue = (limit = 10) => {
  const queue = useRef<PrefetchRequest[]>([]);
  const active = useRef(0);
  const subscribers = useRef<Set<(count: number) => void>>(new Set());

  const notify = () => {
    for (const cb of subscribers.current) {
      cb(active.current);
    }
  };

  const processQueue = () => {
    if (active.current >= limit || queue.current.length === 0) {
      return;
    }

    const { imageUrl, resolve, reject } = queue.current.shift()!;
    active.current++;
    notify();

    setTimeout(async () => {
      try {
        await Image.prefetch(imageUrl);
        resolve();
      } catch (error) {
        reject(error);
      } finally {
        active.current--;
        notify();
        void processQueue();
      }
    }, 30);
  };

  const prefetch = (imageUrl: string, priority: number = 2) => {
    return new Promise<void>((resolve, reject) => {
      queue.current.push({ imageUrl, priority, resolve, reject });
      void processQueue();
    });
  };

  const subscribe = (cb: (count: number) => void) => {
    subscribers.current.add(cb);
    return () => subscribers.current.delete(cb);
  };

  useEffect(() => () => {
    queue.current = [];
  }, []);

  return { prefetch, subscribe };
};
```

This hook implementation provides the following:

- Maintains a queue of prefetch requests with priority support.
- Limits concurrent requests to prevent resource exhaustion.
- Uses a small delay (30ms) between requests to prevent overwhelming the system.
- Provides subscription mechanism for monitoring active requests.

**Queue Processing Mechanism**

The hook processes requests in a controlled manner to optimize performance.

**Example: Queue processing logic**

```javascript
const processQueue = () => {
  // Check if we can process more requests
  if (active.current >= limit || queue.current.length === 0) {
    return;
  }

  // Get the next request from the queue
  const { imageUrl, resolve, reject } = queue.current.shift()!;
  active.current++;
  notify(); // Notify subscribers of active count change

  // Add delay to prevent system overload
  setTimeout(async () => {
    try {
      await Image.prefetch(imageUrl);
      resolve(); // Success callback
    } catch (error) {
      reject(error); // Error callback
    } finally {
      active.current--;
      notify(); // Update active count
      void processQueue(); // Continue processing queue
    }
  }, 30);
};
```

The queue processing mechanism ensures the following:

- Respects the concurrency limit to prevent resource exhaustion.
- Provides smooth processing with controlled delays.
- Continues processing until the queue is empty or limit is reached.
- Handles both success and error cases properly.

**Priority System**

The hook supports priority-based image loading for optimal user experience.

**Example: Priority-based prefetching**

```javascript
// Priority levels for different scenarios
const PRIORITY_LEVELS = {
  IMMEDIATE: 1, // Currently visible/focused items
  HIGH: 2, // Next visible items
  NORMAL: 3, // Background preloading
  LOW: 4, // Far ahead items
};

// Usage in components
const { prefetch } = useImagePrefetchQueue(8);

// Prefetch with different priorities
const handleImagePrefetch = (imageUrl, isVisible, isFocused) => {
  let priority = PRIORITY_LEVELS.NORMAL;

  if (isFocused) {
    priority = PRIORITY_LEVELS.IMMEDIATE;
  } else if (isVisible) {
    priority = PRIORITY_LEVELS.HIGH;
  }

  prefetch(imageUrl, priority);
};
```

This priority system provides the following:

- Immediate loading for focused/critical images.
- Background preloading for upcoming content.
- Flexible priority assignment based on user interaction.
- Optimal resource allocation for different scenarios.

### Usage examples

**Example: `FlexibleCard` Integration**

```javascript
export const FlexibleCard = memo(
  ({
    index,
    rowIndex,
    imageUrl,
    size = 'medium',
    direction,
    isSkeleton,
    isRowVisible,
  }) => {
    const [shouldShowImage, setShouldShowImage] = useState(false);
    const { prefetch } = useImagePrefetchQueue();

    const isVisible = isRowVisible ?? false;
    const priority = isFocused ? 1 : isVisible ? 2 : 3;

    useEffect(() => {
      let isMounted = true;

      if (imageUrl) {
        prefetch(imageUrl, priority).catch(() => logDebug('prefetch failed'));
      }

      const delay = rowIndex * 3 + index * 3;
      const timeout = setTimeout(() => {
        if (isMounted) {
          setShouldShowImage(true);
        }
      }, delay);

      return () => {
        isMounted = false;
        clearTimeout(timeout);
      };
    }, [imageUrl, isVisible, rowIndex]);

    return (
      <View>
        {isSkeleton || !shouldShowImage ? (
          <PlaceholderCard />
        ) : (
          imageUrl && <CardImage imageUrl={imageUrl} />
        )}
      </View>
    );
  },
);
```

This integration shows how the hook is used in your `FlexibleCard` component:

- Priority is calculated based on focus and visibility states.
- Images are prefetched when the component mounts or `imageUrl` changes.
- A staggered delay prevents all images from loading simultaneously.
- `PlaceholderCard` is shown until the image should be displayed.

### Recommended practices for image prefetching

- **Example: Use priority levels strategically.**

  Prioritize images based on user interaction patterns.

  ```javascript
  const prioritizeImageLoading = (imageUrl, context) => {
    const { isFocused, isVisible, isNextRow, userScrollDirection } = context;

    let priority = 3; // Default priority

    if (isFocused) {
      priority = 1; // Highest priority for focused items
    } else if (isVisible) {
      priority = 2; // High priority for visible items
    } else if (isNextRow && userScrollDirection === 'down') {
      priority = 2; // Prefetch next row if scrolling down
    }

    return prefetch(imageUrl, priority);
  };
  ```

  Using priority levels strategically ensures the following:
  - Critical images load first.
  - Background preloading doesn't interfere with immediate needs.
  - Adaptive loading based on user behavior.

### Conclusion

The `useImagePrefetchQueue` hook provides a robust solution for managing image preloading in TV interfaces. By combining concurrency control, priority-based queuing, and intelligent processing, it ensures smooth image loading while maintaining optimal performance.

The hook integrates seamlessly with existing components like `FlexibleCard` and poster grids, providing the foundation for responsive image loading in content-rich TV applications. Its subscription system and error handling capabilities make it suitable for production environments where reliability and performance are critical.
