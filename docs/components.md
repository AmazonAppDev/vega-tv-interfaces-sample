# Components

This collection of components and systems is specifically designed and optimized for TV-first experiences. Each component takes into account the unique challenges of TV application development, emphasizing efficient rendering, robust focus management for remote control navigation, and consistent interaction patterns while maintaining flexibility for customization.

## Grid Component

The Grid component is a highly optimized solution for displaying collections of items in a TV interface. It uses virtualized rendering to efficiently handle large datasets while maintaining smooth navigation and focus management.

### Key Features

- **TV-Optimized Performance**: Uses `FlashList` instead of standard `FlatList` for better performance with large datasets.
- **Focus Management**: Integrates with `FocusGuideView` for proper TV navigation.
- **Smart Sizing**: Calculates optimal item dimensions based on screen size.
- **Lazy Loading**: Implements efficient pagination for smooth infinite scrolling.
- **Visual Feedback**: Provides clear focus indicators for remote control navigation.

### Responsive Grid Sizing

The Grid component includes careful calculations to ensure proper sizing across different screen dimensions.

**Example: Calculations for screen dimensions**

```javascript
// Calculate optimal item dimensions based on screen size
export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

export const COLUMNS = 6;
export const IMAGE_ASPECT_RATIO = 695 / 360;
export const BASE_ITEM_WIDTH = 360;
export const BASE_GRID_ITEM_HEIGHT = Math.floor(
  BASE_ITEM_WIDTH * IMAGE_ASPECT_RATIO,
);
export const BASE_MARGIN = 40;
const TOTAL_MARGIN = BASE_MARGIN * (COLUMNS - 1);
const AVAILABLE_WIDTH = SCREEN_WIDTH * 0.9 - TOTAL_MARGIN;

export const ITEM_WIDTH = Math.floor(AVAILABLE_WIDTH / COLUMNS);
export const GRID_ITEM_HEIGHT = Math.floor(ITEM_WIDTH * IMAGE_ASPECT_RATIO);
const MIN_ITEM_WIDTH = 200;
export const ITEM_WIDTH_FINAL = Math.max(ITEM_WIDTH, MIN_ITEM_WIDTH);
```

These calculations ensure the following:

- Grid items are sized proportionally to the screen.
- A consistent aspect ratio is maintained.
- Minimum sizing is enforced for legibility.
- Proper spacing is applied between items.

### FlashList Optimization

The Grid component uses `FlashList` with specific optimizations for TV interfaces.

**Example: `FlashList` TV interface optimizations**

```javascript
<FlashList
  ref={listRef}
  data={items}
  keyExtractor={item => item.id}
  renderItem={renderItem}
  numColumns={COLUMNS}
  estimatedItemSize={GRID_ITEM_HEIGHT_FINAL}
  estimatedListSize={listSize}
  removeClippedSubviews
  onEndReached={onEndReached}
  onEndReachedThreshold={0.5}
  bounces={false}
  overrideItemLayout={layout => {
    layout.size = GRID_ITEM_HEIGHT_FINAL - FLASHLIST_CORRECTION;
  }}
  // Additional optimization properties
  scrollEventThrottle={20}
  decelerationRate={0.92}
/>
```

**Note**: The `FlashList` component uses a size correction (`FLASHLIST_CORRECTION`) to account for additional padding, borders, and scaling effects. This ensures proper item rendering and prevents visual glitches.

### Layout Measurement

The Grid component uses layout measurement to optimize the performance of `FlashList`.

**Example: `FlashList` performance optimization**

```javascript
const handleGridContainerLayout = useCallback((event: LayoutChangeEvent) => {
  const { width, height } = event.nativeEvent.layout;
  if (width > 0 && height > 0) {
    setListSize({ width, height });
  }
}, []);
```

This measurement is crucial for the following:

- Providing accurate dimensions for virtual rendering.
- Optimizing visible area calculations.
- Ensuring proper initial rendering.
- Reducing unnecessary re-renders.

## Focus Management

The Grid is wrapped in a `FocusGuideView` to ensure proper directional navigation.

**Example: `FocusGuideView` navigation**

```javascript
<FocusGuideView autoFocus trapFocusRight>
  {/* Grid content */}
</FocusGuideView>
```

This enables the following:

- Automatic focus on the first item when the grid is mounted.
- Preventing focus from moving off the right edge of the grid.
- Proper directional navigation within the grid.

### Recommended Practices

When using the Grid component in your TV application, the following is recommended.

- **Provide loading states.** Always include loading indicators for initial load and pagination.

  Example:

  ```javascript
  if ((isFetching || isLoading) && items.length === 0) {
    return <ActivityIndicator />;
  }
  ```

- **Optimize image loading.** Use proper image dimensions to avoid resizing at runtime.

- **Handle empty states.** Provide meaningful feedback when no items are available.

- **Implement pagination.** Use the `onEndReached` callback for infinite scrolling.

  Example:

  ```javascript
  <FlashList
    // other props
    onEndReached={onEndReached}
    onEndReachedThreshold={0.5}
    ListFooterComponent={() => {
      if (isFetchingNextPage && items.length > 0) {
        return <ActivityIndicator />;
      }
      return null;
    }}
  />
  ```

- **Memoize item rendering.** Use `React.memo` to prevent unnecessary re-renders.

  Example:

  ```javascript
  const MemoizedGridItem = React.memo(GridItem);

  const renderItem = useCallback(
    ({ item }) => (
      <View style={styles.gridItemWrapper}>
        <MemoizedGridItem
          id={item.id}
          imageUrl={item.imageUrl}
          onPress={() => setSelectedImage(item.imageUrl)}
        />
      </View>
    ),
    [styles.gridItemWrapper],
  );
  ```

### Usage Example

Here's how the Grid component is used in the Home screen:

```javascript
import { Grid } from '@AppComponents/Grid/Grid';

export const Home = () => {
  // Other component logic

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

  return (
    <View style={styles.container}>
      <ScreenContainer testID="home">
        <FocusGuideView style={[styles.container]}>
          {/* Other components */}
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <Grid
              items={items}
              onEndReached={handleLoadMore}
              isLoading={isLoading}
              isFetching={isFetching}
              isFetchingNextPage={isFetchingNextPage}
            />
          )}
        </FocusGuideView>
      </ScreenContainer>
    </View>
  );
};
```

### Related Components

The Grid component works closely with the following:

- GridItem: Individual grid items with focus animations.
- Box: Base component for interactive elements.
- `FocusGuideView`: Focus management container.

## Box Component

The Box component is a foundational building block for TV interfaces in React Native, specifically designed to handle various states of user interaction including focus, press, and disabled states. It provides a consistent way to create interactive elements that properly respond to TV remote navigation.

### Key Features

- **TV-First Design**: Built specifically for TV remote navigation with proper focus management.
- **State Management**: Handles multiple interaction states (default, enabled, active, pressed, disabled, focused).
- **Compound Style System**: Supports variants, sizes, and state-based styling.
- **Accessibility Support**: Full integration with React Native's accessibility features.
- **Hardware Integration**: Works with TV Event Handlers to respond to remote control events.

### Box State Management

The Box component manages multiple states through a dedicated hook.

**Example: State management**

```javascript
export const BOX_STATE = {
  DEFAULT: 'default',
  ENABLED: 'enabled',
  ACTIVE: 'active',
  PRESSED: 'pressed',
  DISABLED: 'disabled',
  FOCUSED: 'focused',
} as const;

type BoxState = (typeof BOX_STATE)[keyof typeof BOX_STATE];
type StateMap = Record<BoxState, boolean>;

const DEFAULT_STATE: StateMap = {
  [BOX_STATE.DISABLED]: false,
  [BOX_STATE.ENABLED]: true,
  [BOX_STATE.DEFAULT]: false,
  [BOX_STATE.ACTIVE]: false,
  [BOX_STATE.PRESSED]: false,
  [BOX_STATE.FOCUSED]: false,
};

function useBoxState(initialState = DEFAULT_STATE) {
  const [state, updateState] = React.useState(initialState);
  const pressHandler = React.useRef<null | TVEventHandler>(null);

  // ... press handler and state management logic

  return { state, setState };
}
```

This state management system allows the Box component to do the following:

- Track multiple states simultaneously.
- Handle remote control events properly.
- Apply appropriate visual styles based on state.
- Clean up event handlers when unmounted.

### TV Remote Integration

The Box component integrates with the `TVEventHandler` to capture remote control events.

**Example: `TVEventHandler` remote control**

```javascript
const DPADPressHandler = React.useCallback(
  (_: unknown, event?: HWEvent) => {
    if (event?.eventType === 'select' && event?.eventKeyAction === 0) {
      setState(BOX_STATE.PRESSED, true);
    } else if (event?.eventType === 'select' && event?.eventKeyAction === 1) {
      setState(BOX_STATE.PRESSED, false);
    }
  },
  [setState],
);

// Enable press handler when focused
const enablePressHandler = React.useCallback(() => {
  if (!pressHandler.current && Platform.isTV) {
    pressHandler.current = new TVEventHandler();
    pressHandler.current.enable(undefined, DPADPressHandler);
  }
}, []);
```

This enables Box to do the following:

- Respond to "select" button presses on TV remotes.
- Handle different phases of button press events (press down, release).
- Clean up event handlers when focus is lost.

### Platform-Aware Rendering

Box uses conditional rendering based on platform.

**Example: Platform rendering**

```javascript
if (isTV && focusable) {
  return (
    <TouchableOpacity
      // TV-specific props and handlers
      {...tvProps}
      onFocus={handleFocus}
      onBlur={handleBlur}
      // ...
    >
      {children}
    </TouchableOpacity>
  );
}

if ('onPress' in rest) {
  return (
    <TouchableOpacity
    // Interactive element props
    // ...
    >
      {children}
    </TouchableOpacity>
  );
}

return (
  <TouchableOpacity
  // Base component props
  // ...
  >
    {children}
  </TouchableOpacity>
);
```

This approach ensures the following:

- TV platforms get special handling for remote navigation.
- Interactive elements provide proper feedback.
- Non-interactive elements still benefit from the style system.

### Style Composition

The Box component composes styles based on variants, sizes, and states.

**Example: Style composition**

```javascript
const boxStyle = [
  styles[variant],
  styles[size],
  disabled && styles.disabled,
  state[BOX_STATE.FOCUSED] && styles.focused,
  state[BOX_STATE.PRESSED] && styles.pressed,
  style,
  state[BOX_STATE.FOCUSED] && focusStyle,
  state[BOX_STATE.PRESSED] && pressableStyle,
  Platform.OS === 'android' && {
    elevation: elevation ?? 0,
  },
];
```

This provides the following:

- Consistent base styling through variants and sizes.
- Clear visual indicators for different states.
- Custom style overrides where needed.
- Platform-specific visual adjustments.

### Recommended Practices

When using the Box component in your TV application, the following is recommended.

- **Provide clear focus style.s** Ensure focused state is visually distinct and clear from a distance.

  Example:

  ```javascript
  <Box
    focusStyle={styles.customFocusStyle}
    // other props
  >
    Content
  </Box>
  ```

- **Set accessibility props.** Always include accessibility attributes for screen readers.

  Example:

  ```javascript
  <Box
    accessibilityRole="button"
    accessibilityLabel="Play video"
    // other props
  >
    Play
  </Box>
  ```

- **Use next focus directions.** Guide users with explicit navigation paths using nextFocus props.

  Example:

  ```javascript
  <Box
    nextFocusDown={downElementId}
    nextFocusUp={upElementId}
    // other props
  >
    Content
  </Box>
  ```

- **Handle pressed state.** Provide visual feedback for pressed state.

  Example:

  ```javascript
  <Box
    pressableStyle={styles.customPressedStyle}
    onPress={handlePress}
    // other props
  >
    Content
  </Box>
  ```

### Usage Example

Here's how to use the Box component in your TV application:

```javascript
import { Box } from '@AppComponents/core/Box/Box';

export const MenuButton = ({ title, onPress, isActive }) => {
  return (
    <Box
      variant="primary"
      size="lg"
      focusable={true}
      disabled={false}
      style={styles.menuButton}
      focusStyle={styles.menuButtonFocused}
      pressableStyle={styles.menuButtonPressed}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <Text style={[styles.menuButtonText, isActive && styles.activeText]}>
        {title}
      </Text>
    </Box>
  );
};
```

### Available Props

The Box component accepts the following props:

| Prop                  | Type      | Default   | Description                                                             |
| --------------------- | --------- | --------- | ----------------------------------------------------------------------- |
| `variant`             | string    | 'default' | Visual variant ('default', 'primary', 'secondary', 'outlined', 'ghost') |
| `size`                | string    | 'md'      | Size variant ('sm', 'md', 'lg')                                         |
| `focusable`           | boolean   | true      | Whether the component can receive focus.                                |
| `disabled`            | boolean   | false     | Whether the component is disabled.                                      |
| `style`               | ViewStyle | -         | Custom style for the component.                                         |
| `focusStyle`          | ViewStyle | -         | Style applied when the component is focused.                            |
| `pressableStyle`      | ViewStyle | -         | Style applied when the component is pressed.                            |
| `_activeOpacity`      | number    | 1         | Opacity when the component is touched (mobile).                         |
| `onPress`             | function  | -         | Callback when the component is pressed.                                 |
| `onFocus`             | function  | -         | Callback when the component receives focus.                             |
| `onBlur`              | function  | -         | Callback when the component loses focus.                                |
| `hasTVPreferredFocus` | boolean   | -         | Whether the component should automatically receive focus.               |
| `nextFocusDown`       | number    | -         | ID of the element to focus when pressing down.                          |
| `nextFocusUp`         | number    | -         | ID of the element to focus when pressing up.                            |
| `nextFocusLeft`       | number    | -         | ID of the element to focus when pressing left.                          |
| `nextFocusRight`      | number    | -         | ID of the element to focus when pressing right.                         |

> ### Related Components

The Box component works closely with the following:

- Grid: Uses Box for interactive grid items.
- Focus Management: Provides hooks for managing focus across components.
- `FocusGuideView`: Container that guides spatial navigation.

### Focus Management

Effective focus management is the cornerstone of any good TV interface. Unlike mobile or web applications where users can directly tap any element, TV interfaces rely entirely on directional navigation with a remote control. This documentation covers the focus management hooks and components in the Vega TV Interfaces.

### Key Concepts

- **Focus State**: Elements can be focused or unfocused, with clear visual distinction.
- **Focus Navigation**: Users move focus with directional buttons (up, down, left, right).
- **Focus Trapping**: Sometimes focus needs to be contained within a specific area.
- **Focus Guides**: Invisible elements that help direct focus in a spatially logical way.
- **Auto Focus**: Automatic focusing of elements when a screen or component mounts.

### Focus Management Hooks

This section describes two powerful hooks for managing focus, `useFocusManager` and `useFocusCollection`. These hooks are provided by the Vega TV Interfaces.

### useFocusManager

The `useFocusManager` hook manages focus for a single element.

**Example: `useFocusManager` hook**

```javascript
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
  const ref = useRef<TouchableOpacity>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Implementation details...

  return { ref, focus, blur, isFocused };
};
```

**Key features**

- **Automatic Focus**: Optionally focus the element when mounted.
- **Focus Trapping**: Can capture back button presses to keep focus on the element.
- **Focus Change Detection**: Track focus state changes and notify through callbacks.
- **Imperative Control**: Provides functions to programmatically focus or blur the element.

**Example usage**

```javascript
function FeaturedButton({ onPress }) {
  const { ref, isFocused } = useFocusManager({
    autoFocus: true,
    onFocusChange: focused => console.log('Focus changed:', focused),
  });

  return (
    <TouchableOpacity
      ref={ref}
      style={[styles.button, isFocused && styles.focusedButton]}
      onPress={onPress}
    >
      <Text>Featured Content</Text>
    </TouchableOpacity>
  );
}
```

#### useFocusCollection

The `useFocusCollection` hook manages focus across multiple related elements.

**Example: `useFocusCollection` hook**

```javascript
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

**Key features**

- **Reference Collection**: Maintains a map of element references indexed by ID.
- **Debounced Focus**: Prevents rapid focus changes that can cause flickering.
- **Focus Tracking**: Keeps track of the currently focused item.
- **Imperative Focus Control**: Provides functions to programmatically focus or blur specific items.

**Example usage**

```javascript
function MenuList({ items }) {
  const { registerRef, focusItem } = useFocusCollection();

  useEffect(() => {
    // Auto-focus the first item when the list mounts
    if (items.length > 0) {
      focusItem(items[0].id);
    }
  }, []);

  return (
    <View>
      {items.map(item => (
        <TouchableOpacity
          key={item.id}
          ref={ref => registerRef(item.id, ref)}
          onFocus={() => console.log(`${item.title} focused`)}
        >
          <Text>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
```

### FocusGuideView Component

The `FocusGuideView` component creates a container that manages directional focus navigation.

**Example: `FocusGuideView` component**

```javascript
import type { ReactElement } from 'react';
import React from 'react';

import type { FocusGuideProps } from '@amazon-devices/react-native-kepler';
import { TVFocusGuideView } from '@amazon-devices/react-native-kepler';

export type FocusGuideViewProps = FocusGuideProps & {
  children: ReactElement | ReactElement[];
};

export const FocusGuideView = ({ children, ...props }: FocusGuideViewProps) => {
  return <TVFocusGuideView {...props}>{children}</TVFocusGuideView>;
};
```

**Properties**

| Prop             | Type    | Description                                                      |
| ---------------- | ------- | ---------------------------------------------------------------- |
| `autoFocus`      | boolean | Automatically focus the first focusable element within the view. |
| `trapFocus`      | boolean | Prevent focus from leaving the view.                             |
| `trapFocusLeft`  | boolean | Prevent focus from leaving the left edge of the view.            |
| `trapFocusRight` | boolean | Prevent focus from leaving the right edge of the view.           |
| `trapFocusUp`    | boolean | Prevent focus from leaving the top edge of the view.             |
| `trapFocusDown`  | boolean | Prevent focus from leaving the bottom edge of the view.          |
| `destinations`   | array   | Explicit focus destinations for directional navigation.          |

**Usage**

```javascript
<FocusGuideView autoFocus trapFocusRight style={styles.menuContainer}>
  <MenuButton title="Home" onPress={() => navigate('Home')} />
  <MenuButton title="Movies" onPress={() => navigate('Movies')} />
  <MenuButton title="TV Shows" onPress={() => navigate('TVShows')} />
  <MenuButton title="Settings" onPress={() => navigate('Settings')} />
</FocusGuideView>
```

### Recommended Practices

- **Provide clear visual focus indicators.** Users navigate TV interfaces exclusively with directional controls, so they need clear visual feedback about which element is currently focused.

  Example:

  ```javascript
  // Example of good focus styling
  const styles = StyleSheet.create({
    button: {
      padding: 12,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 6,
    },
    buttonFocused: {
      backgroundColor: '#0078D7',
      transform: [{ scale: 1.1 }],
      borderWidth: 2,
      borderColor: 'white',
    },
  });
  ```

  Focus indicators should be the following:
  - Highly visible from a distance (10-foot interface).
  - Consistently applied across the application.
  - Animated when focus changes to draw attention.
  - Distinct enough from unfocused elements.

- **Create logical focus paths.** Focus movement should be intuitive and predictable.

  Example:

  ```javascript
  <Box
    focusable
    nextFocusDown={ITEM_IDS.SEARCH_BAR}
    nextFocusRight={ITEM_IDS.FEATURED_CONTENT}
  >
    <Text>Menu</Text>
  </Box>
  ```

  Tips for creating logical focus paths:
  - Follow natural reading direction (left-to-right, top-to-bottom in Western layouts).
  - Use `nextFocus*` props to explicitly define focus paths when spatial layout is ambiguous.
  - Test focus paths with physical remotes, not just the Vega Virtual Device.

- **Auto-focus on mount.** Always ensure something is focused when a screen mounts.

  Example:

  ```javascript
  function HomeScreen() {
    const homeButtonRef = useRef(null);

    useEffect(() => {
      // Ensure the home button is focused when the screen mounts
      if (homeButtonRef.current) {
        homeButtonRef.current.focus();
      }
    }, []);

    return (
      <View>
        <TouchableOpacity ref={homeButtonRef} hasTVPreferredFocus={true}>
          <Text>Home</Text>
        </TouchableOpacity>
        {/* Other content */}
      </View>
    );
  }
  ```

- **Handle dynamic content gracefully.** When content changes, maintain focus in a logical position.

  Example:

  ```javascript
  const [selectedCategory, setSelectedCategory] = useState('movies');
  const { focusItem } = useFocusCollection();

  // When category changes, focus the first item in that category
  useEffect(() => {
    focusItem(`${selectedCategory}-item-0`);
  }, [selectedCategory, focusItem]);
  ```

- **Use focus trapping for modals and menus.** Prevent focus from escaping modals or menus with focus trapping.

  Example:

  ```javascript
  <FocusGuideView trapFocus>
    <ModalContent />
    <CloseButton onPress={closeModal} />
  </FocusGuideView>
  ```

### Common Focus Management Patterns
---

### Grid Navigation

Grid navigation should allow users to move in all four directions logically.

**Example: Grid navigation**

```javascript
<FocusGuideView>
  <Grid
    data={items}
    numColumns={3}
    renderItem={({ item, index }) => (
      <GridItem
        item={item}
        hasTVPreferredFocus={index === 0}
        // Grid position determines natural focus navigation
      />
    )}
  />
</FocusGuideView>
```

### Menu Navigation

Menu navigation typically follows a vertical or horizontal pattern.

**Example: Menu navigation**

```javascript
<FocusGuideView trapFocusLeft>
  <VerticalMenu>
    {menuItems.map((item, index) => (
      <MenuItem
        key={item.id}
        label={item.label}
        hasTVPreferredFocus={index === 0}
      />
    ))}
  </VerticalMenu>
</FocusGuideView>
```

### Modal Focus Management

Modals require special focus handling to ensure users can navigate within them and exit properly.

**Example: Modal focus management**

```javascript
// Example of modal focus management from ExampleModal component
useEffect(() => {
  if (isVisible) {
    setFocusedButton(BUTTON_STATE.startWorkout);
    focusItem(BUTTON_REF.startWorkout(imageUrl));
  }

  return () => {
    setFocusedButton(null);
    blurItem(BUTTON_REF.startWorkout(imageUrl));
  };
}, [isVisible, focusItem, blurItem, imageUrl]);
```

### Conclusion

Proper focus management is what separates great TV applications from mediocre ones. By leveraging the hooks and components provided in this library, you can create intuitive navigation experiences that feel natural with a remote control.

Key points:

- Always provide clear visual focus indicators.
- Design logical focus paths between interactive elements.
- Use focus trapping to contain focus when appropriate.
- Auto-focus elements when screens mount.
- Handle focus gracefully when content changes.

By following these guidelines, your TV application provides a polished and professional user experience that is easy to navigate with a remote control.

## Modal Components

Modal components are essential for TV interfaces as they provide a way to display focused content or gather user input without navigating away from the current screen. The Vega TV Interfaces includes a flexible `CustomModal` component that uses the compound component pattern for maximum flexibility and consistent styling.

### Key Features

- **Compound Component Pattern**: Modular, composable API for flexible modal layouts.
- **Focus Management**: Integrated with the focus system for proper TV remote navigation.
- **Positioning Options**: Support for different modal positions (top, bottom, center).
- **Styled Subcomponents**: Pre-styled components for common modal elements.
- **Accessibility Support**: Fully accessible with proper focus trapping.

### Compound Component Pattern

The `CustomModal` uses a compound component pattern with a shared context.

**Example: `CustomModal` component**

```javascript
const ModalContext = (createContext < ModalContextType) | (null > null);

export const CustomModal = {
  Root: ({
    isVisible,
    onClose,
    children,
    focusedButton,
    setFocusedButton,
    position = 'center',
  }) => {
    // Implementation...
  },

  Image: ({ imageUrl }) => {
    // Implementation...
  },

  Content: ({ children, style }) => {
    // Implementation...
  },

  Title: ({ children }) => {
    // Implementation...
  },

  Subtitle: ({ children }) => {
    // Implementation...
  },

  Description: ({ children }) => {
    // Implementation...
  },
};
```

This pattern offers the following advantages:

- **Flexible Composition**: Mix and match subcomponents as needed.
- **Encapsulated Styling**: Each subcomponent handles its own styling.
- **Shared Context**: All subcomponents share the same state and styling.
- **Cleaner API**: More intuitive than passing many props.

### Focus Management Integration

The modal integrates with our focus management system.

**Example: Focus management**

```javascript
Root: (/* props */) => {
  const styles = useThemedStyles(getModalStyles);
  const { registerRef, focusItem, blurItem } = useFocusCollection();

  // Provide focus management through context
  return (
    <ModalContext.Provider
      value={{
        isVisible,
        onClose,
        focusedButton,
        setFocusedButton,
        styles,
        registerRef,
        focusItem,
        blurItem,
      }}
    >
      {/* Modal content */}
    </ModalContext.Provider>
  );
};
```

This integration enables the following:

- Proper focus handling when the modal opens and closes.
- Tracking the currently focused element within the modal.
- Programmatic focus control for modal elements.

### Position Transformation

The modal supports different positions through a transformation function.

**Example: Position transformation**

```javascript
const transformPosition = (position: 'top' | 'bottom' | 'center') => {
  switch (position) {
    case 'top':
      return 'flex-start';
    case 'bottom':
      return 'flex-end';
    case 'center':
      return 'center';
    default:
      return 'center';
  }
};

// Used in the Root component
<View
  style={[
    styles[MODAL_CLASSES.OVERLAY],
    { justifyContent: transformPosition(position) },
  ]}
  pointerEvents="box-only"
>
  {/* Modal content */}
</View>
```

This allows the modal to be positioned at the following:

- The top of the screen (useful for notifications).
- The center (standard modal position).
- The bottom (useful for action sheets).

### Styled Subcomponents

The modal includes pre-styled subcomponents for common modal elements.

**Example: pre-styled subcomponents**

```javascript
const MODAL_CLASSES = {
  OVERLAY: 'modalOverlay',
  CONTENT: 'modalContent',
  CONTENT_PADDING: 'modalContentPadding',
  IMAGE: 'modalImage',
  TITLE: 'modalTitle',
  SUBTITLE: 'modalSubtitle',
  DESCRIPTION: 'modalDescription',
} as const;

// Example subcomponent implementation
Title: ({ children }) => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('Modal.Title must be used within Modal.Root');
  }
  return <Text style={context.styles[MODAL_CLASSES.TITLE]}>{children}</Text>;
},
```

These subcomponents ensure the following:

- Consistent styling across the application.
- Type safety through TypeScript.
- Context validation for proper component nesting.

### Example: Basic modal

```javascript
<CustomModal.Root
  isVisible={isVisible}
  onClose={handleClose}
  position="center"
  focusedButton={focusedButton}
  setFocusedButton={setFocusedButton}
>
  <CustomModal.Content>
    <CustomModal.Title>
      <Text>Confirm Action</Text>
    </CustomModal.Title>
    <CustomModal.Description>
      <Text>Are you sure you want to proceed?</Text>
    </CustomModal.Description>

    <Pressable
      ref={ref => registerRef('confirm-button', ref)}
      style={[
        styles.button,
        focusedButton === 'confirm' && styles.buttonFocused,
      ]}
      onPress={handleConfirm}
      onFocus={() => setFocusedButton('confirm')}
    >
      <Text>Confirm</Text>
    </Pressable>

    <Pressable
      ref={ref => registerRef('cancel-button', ref)}
      style={[
        styles.button,
        focusedButton === 'cancel' && styles.buttonFocused,
      ]}
      onPress={handleClose}
      onFocus={() => setFocusedButton('cancel')}
    >
      <Text>Cancel</Text>
    </Pressable>
  </CustomModal.Content>
</CustomModal.Root>
```

### Example: Modal with image

```javascript
<CustomModal.Root
  isVisible={isVisible}
  onClose={onClose}
  focusedButton={focusedButton}
  setFocusedButton={setFocusedButton}
  position={'center'}
>
  <View style={styles.modalContainer}>
    <CustomModal.Content>
      <CustomModal.Image imageUrl={imageUrl} />
      <CustomModal.Title>
        <Text>Total-body balance pilates</Text>
      </CustomModal.Title>
      <CustomModal.Subtitle>
        <Text>34 Min | Intensity ••••</Text>
      </CustomModal.Subtitle>
      <CustomModal.Description>
        <Text>
          Andrea's signature low-impact, total-body class in just 30 minutes.
          Hit every muscle group with barre and Pilates moves that leave you
          feeling strong, refreshed, and energized.
        </Text>
      </CustomModal.Description>

      <Pressable
        ref={ref => registerRef('start-workout', ref)}
        style={[
          styles.button,
          focusedButton === 'start-workout' && styles.buttonFocused,
        ]}
        onPress={handleStartWorkout}
        onFocus={() => setFocusedButton('start-workout')}
      >
        <Text>▶ Start workout</Text>
      </Pressable>

      <Pressable
        ref={ref => registerRef('close', ref)}
        style={[
          styles.button,
          focusedButton === 'close' && styles.buttonFocused,
        ]}
        onPress={onClose}
        onFocus={() => setFocusedButton('close')}
      >
        <Text>✖ Close</Text>
      </Pressable>
    </CustomModal.Content>
  </View>
</CustomModal.Root>
```

**Note**: The `Image` component is not required and can be part of the `Content` component if preferred.

### Recommended practices for TV modals

- **Auto-focus first interactive element.** When opening a modal, automatically focus the first interactive element.

  Example:

  ```javascript
  useEffect(() => {
    if (isVisible) {
      // Auto-focus the primary action button
      setFocusedButton('primary-action');
      focusItem('primary-action');
    }
  }, [isVisible, focusItem]);
  ```

- **Trap focus within modal.** Ensure focus remains within the modal while it's open.

  Example:

  ```javascript
  <FocusGuideView trapFocus>
    <CustomModal.Root
      isVisible={isVisible}
      onClose={onClose}
      // other props
    >
      {/* Modal content */}
    </CustomModal.Root>
  </FocusGuideView>
  ```

- **Handle back button.** Always handle the back button properly to close the modal.

  Example:

  ```javascript
  <CustomModal.Root
    isVisible={isVisible}
    onClose={onClose} // This will be called when the back button is pressed
    // other props
  >
    {/* Modal content */}
  </CustomModal.Root>
  ```

- **Use clear visual focus indicators.** Make sure focused elements within the modal have clear visual indicators.

  Example:

  ```javascript
  <Pressable
    style={[
      styles.button,
      focusedButton === 'confirm' && {
        borderWidth: 2,
        borderColor: 'white',
        backgroundColor: '#0078D7',
        transform: [{ scale: 1.1 }],
      },
    ]}
    // other props
  >
    <Text>Confirm</Text>
  </Pressable>
  ```

- **Support keyboard navigation.** Ensure all interactive elements are accessible via directional navigation.

  Example:

  ```javascript
  <Pressable
    ref={(ref) => registerRef('confirm-button', ref)}
    nextFocusDown={cancelButtonId}
    // other props
  >
    <Text>Confirm</Text>
  </Pressable>

  <Pressable
    ref={(ref) => registerRef('cancel-button', ref)}
    nextFocusUp={confirmButtonId}
    // other props
  >
    <Text>Cancel</Text>
  </Pressable>
  ```

---

### Available props

> ### CustomModal.Root

| Prop               | Type                          | Default  | Description                                 |
| ------------------ | ----------------------------- | -------- | ------------------------------------------- |
| `isVisible`        | boolean                       | -        | Controls the visibility of the modal.       |
| `onClose`          | function                      | -        | Callback function when the modal is closed. |
| `children`         | ReactNode                     | -        | Modal content.                              |
| `focusedButton`    | string \| null                | -        | Currently focused button ID.                |
| `setFocusedButton` | function                      | -        | Function to set the focused button.         |
| `position`         | 'top' \| 'bottom' \| 'center' | 'center' | Position of the modal on screen.            |

> ### CustomModal.Image

| Prop       | Type   | Description                  |
| ---------- | ------ | ---------------------------- |
| `imageUrl` | string | URL of the image to display. |

> ### CustomModal.Content

| Prop       | Type      | Description                 |
| ---------- | --------- | --------------------------- |
| `children` | ReactNode | Content to display.         |
| `style`    | ViewStyle | Additional styles to apply. |

> ### CustomModal.Title / CustomModal.Subtitle / CustomModal.Description

| Prop       | Type      | Description              |
| ---------- | --------- | ------------------------ |
| `children` | ReactNode | Text content to display. |


## Custom Drawer system

The Custom Drawer system provides a flexible and TV-optimized navigation drawer for the Vega TV Interfaces. It consists of two main components:

- **DrawerWrapper**: A foundational component that handles drawer state, animation, and context.
- **CustomDrawer**: A specific implementation that utilizes the DrawerWrapper.

This drawer system is specifically designed for TV interfaces, with considerations for remote navigation, focus management, and screen real estate.

### Key features

- **Focus Management**: Properly integrates with TV focus navigation.
- **Context API**: Provides drawer state and controls through React Context.
- **Accessibility Support**: Includes proper ARIA attributes for screen readers.
- **Flexible Configuration**: Customizable width, position, and animation type.
- **Independent Navigation**: Uses a standalone navigation container.

### DrawerWrapper implementation

The `DrawerWrapper` component is the foundational building block for the drawer system.

**Example: `DrawerWrapper` component**

```javascript
import React, { createContext, useContext, useState } from 'react';
import { Dimensions } from 'react-native';

import { TVFocusGuideView } from '@amazon-devices/react-native-kepler';
import { createDrawerNavigator } from '@amazon-devices/react-navigation__drawer';
import type { NavigationContainerRef } from '@amazon-devices/react-navigation__native';
import {
  DrawerActions,
  NavigationContainer,
} from '@amazon-devices/react-navigation__native';

const { width } = Dimensions.get('window');

// Type definitions and context setup...

export const DrawerWrapper = ({
  children,
  drawerContent: DrawerContent,
  drawerWidth = width * 0.6,
  drawerPosition = 'right',
  overlayColor = 'rgba(0,0,0,0.5)',
  drawerType = 'front',
  screenOptions = {},
  navigationRef,
}: DrawerWrapperProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const internalRef = React.useRef<DrawerNavigationType>(null);
  const drawerRef = navigationRef || internalRef;

  const openDrawer = () => {
    setIsOpen(true);
    drawerRef.current?.dispatch(DrawerActions.openDrawer());
  };

  const closeDrawer = () => {
    setIsOpen(false);
    drawerRef.current?.dispatch(DrawerActions.closeDrawer());
  };

  const toggleDrawer = () => {
    setIsOpen(prev => !prev);
    drawerRef.current?.dispatch(DrawerActions.toggleDrawer());
  };

  return (
    <DrawerContext.Provider
      value={{ isOpen, openDrawer, closeDrawer, toggleDrawer, setIsOpen }}
    >
      <NavigationContainer independent={true} ref={drawerRef}>
        <Drawer.Navigator
          screenOptions={{
            drawerStyle: {
              width: drawerWidth,
              display: isOpen ? 'flex' : 'none',
            },
            headerShown: false,
            overlayColor,
            drawerType,
            drawerPosition,
            swipeEnabled: false,
            ...screenOptions,
          }}
          drawerContent={() => (
            <DrawerContent
              aria-modal={true}
              aria-hidden={!isOpen}
              aria-live={isOpen ? 'polite' : 'off'}
            />
          )}
        >
          <Drawer.Screen
            name="Drawer"
            options={{
              title: 'Drawer',
              swipeEnabled: false,
            }}
          >
            {() => (
              <TVFocusGuideView trapFocusDown trapFocusUp style={{ flex: 1 }}>
                {children}
              </TVFocusGuideView>
            )}
          </Drawer.Screen>
        </Drawer.Navigator>
      </NavigationContainer>
    </DrawerContext.Provider>
  );
};
```

### DrawerContext

The DrawerContext provides a way to control the drawer from any component.

**Example: DrawerContent drawer control**

```javascript
export const DrawerContext = createContext<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}>({
  isOpen: false,
  setIsOpen: () => {},
  openDrawer: () => {},
  closeDrawer: () => {},
  toggleDrawer: () => {},
});

export const useDrawer = () => useContext(DrawerContext);
```

This context provides the following:

- Current drawer state (`isOpen`).
- Functions to control the drawer (`openDrawer`, `closeDrawer`, `toggleDrawer`).
- Direct state setter for advanced cases (`setIsOpen`).

### Navigation integration

The DrawerWrapper uses React Navigation's drawer navigator.

**Example: DrawerWrapper navigation**

```javascript
<NavigationContainer independent={true} ref={drawerRef}>
  <Drawer.Navigator
    screenOptions={{
      drawerStyle: {
        width: drawerWidth,
        display: isOpen ? 'flex' : 'none',
      },
      // Other options...
    }}
    drawerContent={() => (
      <DrawerContent
        aria-modal={true}
        aria-hidden={!isOpen}
        aria-live={isOpen ? 'polite' : 'off'}
      />
    )}
  >
    <Drawer.Screen name="Drawer">
      {() => (
        <TVFocusGuideView trapFocusDown trapFocusUp style={{ flex: 1 }}>
          {children}
        </TVFocusGuideView>
      )}
    </Drawer.Screen>
  </Drawer.Navigator>
</NavigationContainer>
```

Key points:

- Uses an independent navigation container.
- Disables swipe gestures (typically not useful on TV).
- Wraps content in a `TVFocusGuideView` to manage focus behavior.
- Passes accessibility attributes to the drawer content.

### CustomDrawer Implementation

The `CustomDrawer` component implements a specific drawer configuration.

**Example: `CustomDrawer` configuration**

```javascript
import React from 'react';
import { Dimensions } from 'react-native';

import type { NavigationContainerRef } from '@amazon-devices/react-navigation__native';

import type { DrawerParamList } from '../common/DrawerWrapper';
import { DrawerWrapper } from '../common/DrawerWrapper';
import { FiltersScreen } from '../filters/FiltersScreen';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.6;

export { useDrawer } from '../common/DrawerWrapper';

export const drawerRef =
  React.createRef<NavigationContainerRef<DrawerParamList>>();

export const CustomDrawer = ({ children }: { children: React.ReactNode }) => {
  return (
    <DrawerWrapper
      drawerContent={FiltersScreen}
      drawerWidth={DRAWER_WIDTH}
      navigationRef={drawerRef}
    >
      {children}
    </DrawerWrapper>
  );
};
```

This implementation includes the following:

- Uses a width of 60% of the screen.
- Uses the FiltersScreen component as drawer content.
- Exports a reference to the navigation container for external access.
- Re-exports the useDrawer hook for convenience.

### Using the useDrawer hook

```javascript
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useDrawer } from '@AppComponents/navigation/CustomDrawer';

export const MenuButton = () => {
  const { openDrawer, isOpen } = useDrawer();

  return (
    <TouchableOpacity
      onPress={openDrawer}
      style={styles.button}
      disabled={isOpen}
      accessibilityLabel="Open navigation menu"
      accessibilityRole="button"
    >
      <Text style={styles.buttonText}>Menu</Text>
    </TouchableOpacity>
  );
};
```

### Toggling the drawer on tab focus

```javascript
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useDrawer } from '@AppComponents/navigation/CustomDrawer';
import { Box } from '@AppComponents/core/Box/Box';

export const FilterButton = () => {
  const { toggleDrawer } = useDrawer();

  return (
    <Box
      variant="primary"
      onPress={toggleDrawer}
      onFocus={() => console.log('Filter button focused')}
      accessibilityLabel="Toggle filters"
    >
      <Text>Filters</Text>
    </Box>
  );
};
```

### Closing the drawer programmatically

```javascript
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useDrawer } from '@AppComponents/navigation/CustomDrawer';

export const ApplyFiltersButton = ({ onApply }) => {
  const { closeDrawer } = useDrawer();

  const handleApply = () => {
    onApply();
    closeDrawer();
  };

  return (
    <TouchableOpacity onPress={handleApply} style={styles.applyButton}>
      <Text style={styles.buttonText}>Apply Filters</Text>
    </TouchableOpacity>
  );
};
```

### Drawer content implementation

The drawer content receives special props for accessibility.

Example:

```javascript
// Inside the DrawerWrapper
drawerContent={() => (
  <DrawerContent
    aria-modal={true}
    aria-hidden={!isOpen}
    aria-live={isOpen ? 'polite' : 'off'}
  />
)}
```

Your drawer content component should handle these props.

Example:

```javascript
import React from 'react';
import { View, Text, ScrollView } from 'react-native';

type DrawerContentProps = {
  'aria-modal': boolean;
  'aria-hidden': boolean;
  'aria-live': 'polite' | 'assertive' | 'off';
};

export const SampleDrawerContent = (props: DrawerContentProps) => {
  // Extract accessibility props
  const { 'aria-modal': ariaModal, 'aria-hidden': ariaHidden, 'aria-live': ariaLive } = props;

  return (
    <View
      style={styles.container}
      accessibilityViewIsModal={ariaModal}
      aria-hidden={ariaHidden}
      accessibilityLiveRegion={ariaLive}
    >
      <Text style={styles.title}>Drawer Content</Text>
      <ScrollView>
        {/* Drawer content */}
      </ScrollView>
    </View>
  );
};
```

### Recommended practices for TV drawers

- **Position on the right (for LTR Languages).** On TV interfaces with left-to-right languages, users typically navigate from left to right, so placing the drawer on the right feels more natural.

  Example:

  ```javascript
  <DrawerWrapper drawerPosition="right">
  ```

- **Disable swipe gestures.** Swipe gestures aren't applicable for TV remote navigation.

  Example:

  ```javascript
  screenOptions={{
    swipeEnabled: false
  }}
  ```

- **Use appropriate width.** TV interfaces should use wider drawers than mobile for better readability from a distance.

  Example:

  ```javascript
  const DRAWER_WIDTH = width * 0.6; // 60% of screen width
  ```

- **Implement proper focus management.** When the drawer closes, focus should return to a logical element.

  Example:

  ```javascript
  const closeDrawerAndFocus = () => {
    closeDrawer();
    // Focus a specific element after the drawer closes
    setTimeout(() => {
      focusItem('main-menu-button');
    }, 100);
  };
  ```

- **Add clear visual indicators.** Ensure the drawer has clear visual indicators when it's open.

  Example:

  ```javascript
  // In your styles
  drawerStyle: {
    backgroundColor: '#1E1E1E',
    borderLeftWidth: 2,
    borderLeftColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 10,
  }
  ```

### Focus management with drawers

Managing focus with drawers in TV interfaces requires special consideration.

Example:

```javascript
<TVFocusGuideView trapFocusDown trapFocusUp style={{ flex: 1 }}>
  {children}
</TVFocusGuideView>
```

This configuration includes the following:

- Traps vertical focus to prevent it from leaving the main content unexpectedly.
- Allows horizontal focus to move naturally between main content and drawer.
- Ensures the drawer can receive focus when opened.

For the drawer content itself, consider using the following.

Example:

```javascript
<FocusGuideView autoFocus trapFocus style={styles.drawerContent}>
  {/* Drawer content */}
</FocusGuideView>
```

This ensures the following:

- Focus is automatically moved to the drawer when it opens.
- Focus stays within the drawer until it closes.
- Focus behaves predictably with remote control navigation.

### Customization options

The DrawerWrapper supports various customization options:

| Prop             | Type                         | Default           | Description                                  |
| ---------------- | ---------------------------- | ----------------- | -------------------------------------------- |
| `drawerContent`  | Component                    | (required)        | The component to render inside the drawer.   |
| `drawerWidth`    | number                       | 60% of screen     | Width of the drawer.                         |
| `drawerPosition` | 'left' \| 'right'            | 'right'           | Which side the drawer appears on.            |
| `overlayColor`   | string                       | 'rgba(0,0,0,0.5)' | Color of the overlay when drawer is open.    |
| `drawerType`     | 'front' \| 'back' \| 'slide' | 'front'           | Animation type for the drawer.               |
| `screenOptions`  | object                       | {}                | Additional options for the drawer navigator. |
| `navigationRef`  | ref                          | internal ref      | External navigation reference.               |


### Conclusion

The Custom Drawer system provides a TV-optimized navigation drawer that integrates well with focus management and TV remote navigation. By using the `DrawerContext`, any component in the application can control the drawer state, making it a flexible solution for TV interfaces.

When implementing drawers in TV applications, remember to prioritize clear visual indicators, proper focus management, and accessibility to ensure a smooth user experience with remote navigation.

## Vertical Carousel Component

The `VerticalCarousel` component is a specialized display solution designed specifically for TV interfaces. It implements a side-by-side layout with a featured image on the left and a scrollable list of items on the right. This pattern is common in streaming services and content-heavy TV applications.

The component demonstrates how to create an effective focus-optimized scrolling experience using FlashList with proper focus management for TV remote navigation.

### Key features

- **Split Layout**: Displays a featured image alongside a scrollable list.
- **TV-Optimized Navigation**: Uses custom focus management for smooth remote control navigation.
- **Performance Optimized**: Leverages FlashList for efficient rendering of large lists.
- **Dynamic Selection**: Updates the featured image based on the selected list item.
- **Focus Management**: Properly integrates with TV focus navigation using custom hooks.

> ### Implementation details

```javascript
import React, { useCallback, useRef, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Text, View } from 'react-native';

import { FlashList } from '@amazon-devices/shopify__flash-list';

import { useThemedStyles } from '@AppTheme';
import { ImageTile } from '@AppComponents/core';
import { Box } from '@AppComponents/core/Box/Box';
import type { Item } from '@AppScreens/Components/VerticalStack';
import { getVerticalPosters } from '@AppSrc/data/VerticalPosters';
import { useItemFocusManager } from '@AppSrc/hooks/useItemFocusManager';
import { getVerticalStackStyles } from './styles';

const verticalData = getVerticalPosters();

export const VerticalCarousel = ({ data }: { data: Item[] }) => {
  const styles = useThemedStyles(getVerticalStackStyles);
  const flashListRef = useRef<FlashList<Item>>(null);
  const itemRefs = useRef<TouchableOpacity[]>([]);
  const [listSize, setListSize] = useState<{ width: number; height: number }>({
    width: 779,
    height: data.length * 205,
  });

  const [albumIndex, setAlbumIndex] = useState(0);

  const handleChildRefsUpdate = useItemFocusManager<Item>({
    itemRefs,
    flashListRef,
    dataLength: data.length,
  });

  // Additional implementation...

  return (
    <View style={[styles.container]}>
      {/* Featured image on the left */}
      <View style={styles.column}>
        <View style={styles.leftContainer}>
          <View style={styles.leftContent}>
            <View style={styles.imageContainer}>
              <ImageTile
                style={styles.image}
                width={340}
                height={540}
                imageUrl={verticalData[albumIndex]}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Scrollable list on the right */}
      <View style={[styles.column]}>
        <View
          style={styles.rightContainer}
          onLayout={handleGridContainerLayout}
        >
          <Text style={styles.headerText}>Shopify FlashList</Text>
          <FlashList
            ref={flashListRef}
            data={data}
            renderItem={ItemView}
            keyExtractor={keyProvider}
            estimatedItemSize={185}
            estimatedListSize={listSize}
            horizontal={false}
            bounces={false}
            initialScrollIndex={0}
          />
        </View>
      </View>
    </View>
  );
};
```

### Focus management integration

The component uses the `useItemFocusManager` hook to manage focus between list items.

**Example: `useItemFocusManager` hook**

```javascript
const handleChildRefsUpdate =
  useItemFocusManager <
  Item >
  {
    itemRefs,
    flashListRef,
    dataLength: data.length,
  };
```

This integration includes the following:

- Maintains an array of refs to all list items.
- Sets up proper next/previous focus targets for each item.
- Enables smooth navigation with a TV remote control.
- Handles scrolling when focus moves between items.

### Split Layout Implementation

The component implements a side-by-side layout with two main sections.

**Example: Split layout**

```javascript
<View style={[styles.container]}>
  {/* Left column - Featured image */}
  <View style={styles.column}>
    <View style={styles.leftContainer}>{/* Image content */}</View>
  </View>

  {/* Right column - Scrollable list */}
  <View style={[styles.column]}>
    <View style={styles.rightContainer}>{/* List content */}</View>
  </View>
</View>
```

This layout includes the following:

- Creates a visual hierarchy with a featured item and a list.
- Provides context for the selected item.
- Maximizes screen space usage on TV displays.
- Follows common TV interface patterns.

### Dynamic content selection

The component updates the featured image when a list item is focused or pressed.

**Example: Content selection**

```javascript
const [albumIndex, setAlbumIndex] = useState(0);

// In the ItemView component:
<Box onFocus={() => setAlbumIndex(index)} onPress={() => setAlbumIndex(index)}>
  {/* Item content */}
</Box>;
```

This creates the following:

- Immediate visual feedback when navigating.
- A clear connection between the list and featured content.
- An engaging interactive experience.

### FlashList optimization

The component uses layout measurement to optimize `FlashList` performance.

**Example: `FlashList` optimization**

```javascript
const handleGridContainerLayout = useCallback((event: LayoutChangeEvent) => {
  const { width, height } = event.nativeEvent.layout;
  if (width > 0 && height > 0) {
    setListSize({ width, height });
  }
}, []);

// Used with FlashList:
<FlashList
  estimatedItemSize={185}
  estimatedListSize={listSize}
  // Other props...
/>
```

This optimization includes the following:

- Ensures proper virtual rendering calculations.
- Improves scrolling performance.
- Prevents re-rendering issues.
- Better handles large data sets.

### Item rendering

Each list item is rendered using the Box component for consistent focus styling.

**Example: Styling using the box component**

```javascript
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
        onFocus={() => setAlbumIndex(index)}
        onPress={() => setAlbumIndex(index)}
      >
        <View style={[styles.boxContainer]}>
          {/* Item content */}
        </View>
      </Box>
    );
  },
  [styles, handleChildRefsUpdate],
);
```

This approach includes the following:

- Leverages the Box component's built-in focus management.
- Provides consistent focus visuals across the application.
- Assigns the first item initial focus using `hasTVPreferredFocus`.
- Updates the featured content when focus changes.

### Usage example

Here's how to use the `VerticalCarousel` component in a screen:

```javascript
import React from 'react';
import { View } from 'react-native';
import { VerticalCarousel } from '@AppComponents/VerticalCarousel';
import { ScreenContainer } from '@AppComponents/containers';

const sampleData = [
  {
    id: '1',
    title: 'Morning Yoga',
    date: '2023-05-15',
    duration: '30 min',
    shortDescription: 'Start your day with energizing yoga flows.',
  },
  {
    id: '2',
    title: 'HIIT Workout',
    date: '2023-05-16',
    duration: '45 min',
    shortDescription: 'High intensity interval training to boost metabolism.',
  },
  // More items...
];

export const WorkoutsScreen = () => {
  return (
    <ScreenContainer testID="workouts-screen">
      <View style={styles.container}>
        <VerticalCarousel data={sampleData} />
      </View>
    </ScreenContainer>
  );
};
```

### Recommended practices for TV vertical carousels

- **Always show selection context.** The split layout provides important context for the selected item.

  Example:

  ```javascript
  <ImageTile
    style={styles.image}
    width={340}
    height={540}
    imageUrl={verticalData[albumIndex]}
  />
  ```

  This approach includes the following:
  - Shows a larger version of the selected content.
  - Provides more detail and context.
  - Creates a more engaging TV experience.

- **Optimize for remote navigation.** The item focus management is handled through the `useItemFocusManager` hook.

  Example:

  ```javascript
  const handleChildRefsUpdate = useItemFocusManager<Item>({
    itemRefs,
    flashListRef,
    dataLength: data.length,
  });

  // Used in the item ref:
  ref={handleChildRefsUpdate(index)}
  ```

  This ensures the following:
  - Smooth up/down navigation with a remote.
  - Proper scrolling when moving between items.
  - Focus doesn't get lost during navigation.

- **Provide clear initial focus.** Set the first item to receive focus when the component mounts.

  Example:

  ```javascript
  hasTVPreferredFocus={index === 0}
  ```

  This creates the following:
  - Predictable initial focus when navigating to the screen.
  - Clear starting point for user interaction.
  - Better usability with remote controls.

- **Use appropriate item size.** TV interfaces need larger item sizes for better visibility from a distance.

  Example:

  ```javascript
  // In your style sheet
  box: {
    height: 185,
    marginBottom: 20,
    padding: 16,
    borderRadius: 8,
  },
  ```

  This ensures the following:
  - Content is clearly visible from 10 feet away.
  - Focus indicators are obvious.
  - Text is legible at a distance.

- **Optimize list rendering.** Use proper FlashList configuration for smooth scrolling.

  Example:

  ```javascript
  <FlashList
    estimatedItemSize={185} // Approximate height of each item
    estimatedListSize={listSize} // Overall list dimensions
    horizontal={false}
    bounces={false} // Disable bouncing effect for TV
    initialScrollIndex={0}
  />
  ```

  This improves the following:
  - Scrolling performance.
  - Initial rendering speed.
  - Overall responsiveness.


### Optimizing large lists

For large data sets, consider implementing pagination or lazy loading.

**Example: Pagination and lazy loading**

```javascript
// Load more data when reaching the end of the list
<FlashList
  onEndReached={handleLoadMore}
  onEndReachedThreshold={0.5}
  // Other props...
/>
```

### Memoizing components

The `VerticalCarousel` uses memoization to prevent unnecessary re-renders.

**Example: `VerticalCarousel` memoization**

```javascript
const ItemView = useCallback(
  ({ item, index }) => {
    // Component implementation
  },
  [styles, handleChildRefsUpdate],
);

const keyProvider = useCallback(
  (item: Item, index: number) => `vertical-carousel-${item.id}-${index}`,
  [],
);
```

This pattern includes the following:

- Prevents re-creation of functions on each render.
- Reduces performance overhead.
- Maintains smooth scrolling and navigation.

## FlexibleCard Component

The FlexibleCard component is a versatile card solution designed specifically for TV interfaces. It provides a flexible foundation for creating interactive card elements with different sizes, layouts, and animations that respond properly to TV remote navigation.

### Key features

- **Multiple Size Options**: Supports small, medium, large, or custom card dimensions.
- **Layout Flexibility**: Configure for horizontal, vertical, or expandable layouts.
- **Focus Animations**: Built-in animations provide visual feedback when cards receive focus.
- **Scroll Integration**: Automatic scrolling ensures focused cards are visible on screen.
- **Image Support**: Optimized image display with proper sizing and scaling.
- **Custom Content**: Support for additional content inside cards beyond images.

### Size and layout configuration

The FlexibleCard supports predefined sizes that adjust based on the layout direction.

Example:

```javascript
/**
 * Gets card dimensions based on size and direction
 * @param {CardSize} size - Card size
 * @param {Direction} direction - Layout direction
 * @returns {Object} Card dimensions (width, height, radius, gap)
 */
export const getCardLayout = (size: CardSize, direction: Direction) => {
  if (size === 'small') {
    return direction === 'horizontal'
      ? { width: 320, height: 180, radius: 4, gap: 8 }
      : { width: 320, height: 360, radius: 4, gap: 8 };
  }
  if (size === 'medium') {
    return direction === 'horizontal'
      ? { width: 400, height: 225, radius: 6, gap: 10 }
      : { width: 400, height: 450, radius: 6, gap: 10 };
  }
  return direction === 'horizontal'
    ? { width: 480, height: 270, radius: 10, gap: 12 }
    : { width: 480, height: 480, radius: 10, gap: 12 };
};
```

This provides the following size options:

**Horizontal Direction**

- Small: 320px × 180px (4px radius, 8px gap)
- Medium: 400px × 225px (6px radius, 10px gap)
- Large: 480px × 270px (10px radius, 12px gap)

**Vertical Direction**

- Small: 320px × 360px (4px radius, 8px gap)
- Medium: 400px × 450px (6px radius, 10px gap)
- Large: 480px × 480px (10px radius, 12px gap)

### Focus animation system

The FlexibleCard uses Animated API for smooth focus animations.

Example:

```javascript
const handleFocusAnim = useCallback(() => {
  setIsFocused(true);
  stopAnimations();

  if (animations === 'zoomIn') {
    animationsRefs.image.current = Animated.spring(imageScale, {
      toValue: 0.95,
      useNativeDriver: true,
    });
    animationsRefs.image.current.start();
  }
  if (animations === 'zoomOut') {
    animationsRefs.card.current = Animated.spring(cardScale, {
      toValue: 1.1,
      useNativeDriver: true,
    });
    animationsRefs.card.current.start();
  }
  if (animations === 'expand') {
    // Expand animation implementation
  }
}, [animations]);
```

The FlexibleCard component supports three animation types:

- **zoomIn**: The image scales down slightly, creating an inset effect.
- **zoomOut**: The entire card scales up when focused.
  **Note**: The expand animation is still in development.
- **expand**: The card width expands.

### Memory optimization

The FlexibleCard uses memo with a custom comparison function to prevent unnecessary re-renders.

Example:

```javascript
const checkIfDataSame = (
  prevProps: FlexibleCardProps,
  nextProps: FlexibleCardProps,
) => {
  return (
    prevProps.imageUrl === nextProps.imageUrl &&
    prevProps.index === nextProps.index &&
    prevProps.rowIndex === nextProps.rowIndex &&
    prevProps.animations === nextProps.animations &&
    prevProps.size === nextProps.size
  );
};

export const FlexibleCard = memo(
  ({
    // Component implementation
  }: FlexibleCardProps) => {
    // Component implementation
  },
  checkIfDataSame,
);
```

This optimization ensures the following:

- Cards only re-render when essential props change.
- Improves performance in grids with many cards.
- Prevents animation stutters during navigation.

### Focus and interaction management

The FlexibleCard integrates with the TV focus system and interaction manager.

Example:

```javascript
const focusHandler = useCallback(() => {
  handleFocusAnim();
  scroll?.horizontally?.(index);
  scroll?.vertically?.(rowIndex);
  onFocus?.(index);
}, [handleFocusAnim, index, rowIndex, scroll, onFocus]);

const blurHandler = useCallback(() => {
  handleBlurAnim();
  onBlur?.(index);
}, [handleBlurAnim, index, onBlur]);
```

This approach ensures the following:

- Animations don't interfere with navigation interactions.
- Scrolling is triggered after focus is established.
- Focus callbacks are executed at the appropriate time.

### Basic usage with image

Example:

```javascript
import { FlexibleCard } from '@AppComponents/FlexibleCard/FlexibleCard';

// Simple card with an image
<FlexibleCard
  index={0}
  rowIndex={0}
  imageUrl="https://example.com/image.jpg"
  size="medium"
  direction="horizontal"
  animations="zoomIn"
  onPress={() => console.log('Card pressed')}
/>;
```

### Card with custom content

Example:

```javascript
<FlexibleCard
  index={1}
  rowIndex={0}
  size="large"
  direction="vertical"
  animations="zoomOut"
>
  <Text style={styles.cardTitle}>Card Title</Text>
  <Text style={styles.cardDescription}>Description text</Text>
</FlexibleCard>
```

### Card with scroll integration

```javascript
<FlexibleCard
  index={2}
  rowIndex={1}
  imageUrl="https://example.com/image.jpg"
  size="medium"
  direction="horizontal"
  animations="zoomIn"
  scroll={{
    horizontally: index => scrollToIndex(index),
    vertically: rowIndex => scrollToRow(rowIndex),
  }}
/>
```

### Card with custom size

Example:

```javascript
<FlexibleCard
  index={3}
  rowIndex={2}
  imageUrl="https://example.com/image.jpg"
  direction="horizontal"
  customSize={{
    width: 350,
    height: 200,
    radius: 6,
    gap: 10,
  }}
/>
```

### Recommended practices for TV cards

- **Use appropriate sizing for viewing distance.** TV interfaces are viewed from a distance, so card elements need to be larger than in mobile apps.

Example:

```javascript
// For primary content, use large cards
<FlexibleCard
  size="large"
  // other props
/>

// For secondary content, medium or small cards are appropriate
<FlexibleCard
  size="medium"
  // other props
/>
```

- **Implement scroll handlers.** Always include scroll handlers to ensure focused cards are visible on screen.

Example:

```javascript
const scrollToIndex = index => {
  // Calculate scroll position based on card width and index
  const position = index * (400 + 20); // Card width + gap
  scrollViewRef.current?.scrollTo({ x: position, animated: true });
};

// Used in the FlexibleCard
<FlexibleCard
  scroll={{
    horizontally: scrollToIndex,
  }}
  // other props
/>;
```

- **Use consistent animation styles.** Choose a single animation style for similar sections to maintain visual consistency.

Example:

```javascript
// All cards in the same row or section should use the same animation
<View style={styles.row}>
  <FlexibleCard
    animations="zoomIn"
    // other props
  />
  <FlexibleCard
    animations="zoomIn"
    // other props
  />
</View>
```

- **Limit additional content.** Keep text and other content minimal with large, readable fonts.

Example:

```javascript
<FlexibleCard
// other props
>
  <Text style={styles.cardTitle}>Short Title</Text>
  <Text style={styles.cardSubtitle}>Brief subtitle</Text>
</FlexibleCard>;

// Styles with large fonts for TV viewing
const styles = StyleSheet.create({
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  cardSubtitle: {
    fontSize: 18,
    color: 'lightgray',
  },
});
```

- **Test with directional navigation.** Make sure your card layout works well with up/down/left/right remote navigation.

Example:

```javascript
// Arrange cards in a predictable grid pattern
<View style={styles.grid}>
  <View style={styles.row}>
    <FlexibleCard index={0} rowIndex={0} /* props */ />
    <FlexibleCard index={1} rowIndex={0} /* props */ />
    <FlexibleCard index={2} rowIndex={0} /* props */ />
  </View>
  <View style={styles.row}>
    <FlexibleCard index={0} rowIndex={1} /* props */ />
    <FlexibleCard index={1} rowIndex={1} /* props */ />
    <FlexibleCard index={2} rowIndex={1} /* props */ />
  </View>
</View>
```

### Example: Card carousel

Here's a complete example of creating a horizontal carousel using FlexibleCards:

```javascript
import React, { useRef } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { FlexibleCard } from '@AppComponents/FlexibleCard/FlexibleCard';

const CardCarousel = ({ title, items }) => {
  const scrollViewRef = useRef(null);

  const scrollToIndex = index => {
    // Calculate scroll position based on card width and gap
    const position = index * (400 + 20); // Medium card width + gap
    scrollViewRef.current?.scrollTo({ x: position, animated: true });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.cardsContainer}>
          {items.map((item, index) => (
            <FlexibleCard
              key={item.id}
              index={index}
              rowIndex={0}
              imageUrl={item.imageUrl}
              size="medium"
              direction="horizontal"
              animations="zoomIn"
              onPress={() => console.log('Selected:', item.title)}
              scroll={{
                horizontally: scrollToIndex,
              }}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    marginLeft: 20,
  },
  scrollView: {
    paddingLeft: 20,
  },
  cardsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});

export default CardCarousel;
```

### Available props

The FlexibleCard component accepts the following props:

| Prop         | Type                                   | Default         | Description                        |
| ------------ | -------------------------------------- | --------------- | ---------------------------------- |
| `index`      | number                                 | _Required_      | Card index in its row.             |
| `rowIndex`   | number                                 | _Required_      | Row index for the card.            |
| `imageUrl`   | string                                 | -               | URL of the image to display.       |
| `size`       | 'small' \| 'medium' \| 'large'         | 'medium'        | Predefined card size.              |
| `direction`  | 'horizontal' \| 'vertical' \| 'expand' | _Required_      | Layout direction.                  |
| `animations` | 'zoomIn' \| 'zoomOut' \| 'expand'      | 'zoomIn'        | Animation to apply on focus.       |
| `onFocus`    | (index: number) => void                | -               | Callback when card receives focus. |
| `onBlur`     | (index: number) => void                | -               | Callback when card loses focus.    |
| `onPress`    | () => void                             | -               | Callback when card is pressed.     |
| `scroll`     | Object                                 | -               | Scroll configuration.              |
| `children`   | React.ReactNode                        | -               | Additional card content.           |
| `customSize` | Object                                 | -               | Custom card size.                  |
| `testID`     | string                                 | 'flexible-card' | ID for testing.                    |
| `itemId`     | string                                 | -               | Unique item ID.                    |


### Technical notes

- The FlexibleCard component uses `memo` with a custom comparison function to prevent unnecessary re-renders.
- Animations use the React Native `Animated` API for smooth performance.
- When you use the `expand` animation type, be aware it's still in development and might not work as expected.
- The component includes accessibility support with the `role="button"` attribute for screen readers.

### Related components

The FlexibleCard component works well with the following:

- **Grid component**: For displaying multiple cards in a grid layout.
- **VerticalCarousel**: Can use FlexibleCard for its list items.
- **FocusGuideView**: For managing focus navigation between multiple cards.

## HeroCarousel Component

The HeroCarousel component is a full-width, feature-rich carousel specifically designed for TV interfaces. It provides an engaging way to showcase featured content with auto-scrolling capabilities, responsive design, and optimized TV remote navigation.

### Key features

- **Auto-scrolling**: Automatically transitions between slides with configurable intervals.
- **TV Remote Navigation**: Supports DPAD (directional pad) navigation for TV interfaces.
- **Indicator Dots**: Visual indicators show the current slide position.
- **Custom Styling**: Supports custom background colors and images for each slide.
- **Responsive Design**: Adapts to different screen widths automatically.
- **Focus Management**: Properly integrates with TV focus systems.
- **Performance Optimized**: Uses Reanimated for smooth animations and rendering optimizations.

### Auto-scrolling system

The HeroCarousel implements an intelligent auto-scrolling system that pauses during user interaction and resumes afterward.

Example:

```javascript
// Shared value to control auto-scrolling behavior and pause/resume
const isAutoScroll = useSharedValue < boolean > true;

// Ref to store the auto-scroll interval timer for cleanup
const autoScrollInterval = (useRef < NodeJS.Timeout) | (null > null);

/**
 * Effect to handle auto-scrolling behavior
 * Starts the auto-scroll interval when the component is ready
 * Cleans up the interval when the component unmounts
 */
useEffect(() => {
  if (isAutoScrolling.current) {
    return;
  }

  autoScrollInterval.current = setInterval(() => {
    if (currentIndex.value < data.length - 1) {
      scrollToIndex(currentIndex.value + 1);
    }
  }, autoInterval);

  return () => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
    }
  };
}, [currentIndex, data.length, autoInterval, scrollToIndex]);
```

This system ensures the following:

- The carousel scrolls automatically at regular intervals.
- Auto-scrolling pauses when the user interacts with the carousel.
- The interval is properly cleaned up when the component unmounts.

### TV remote integration

The HeroCarousel integrates with TV remote controls using the DPAD (directional pad) events.

Example:

```javascript
/**
 * Handles TV remote control events (DPAD navigation)
 * Pauses auto-scrolling during navigation and resumes after
 * @param evt - The hardware event from the TV remote
 */
useFocusGuideEventHandler((evt: HWEvent) => {
  if (!isTV || !isFocused) {
    return;
  }

  if (evt.eventKeyAction === EVENT_KEY_DOWN) {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
      autoScrollInterval.current = null;
    }

    if (evt.eventType === DPADEventType.RIGHT) {
      if (currentIndex.value < data.length - 1) {
        scrollToIndex(currentIndex.value + 1);
      }
    }

    if (evt.eventType === DPADEventType.LEFT) {
      if (currentIndex.value > 0) {
        scrollToIndex(currentIndex.value - 1);
      }
    }
  }

  if (evt.eventKeyAction === EVENT_KEY_UP) {
    if (!autoScrollInterval.current) {
      autoScrollInterval.current = setInterval(() => {
        if (currentIndex.value < data.length - 1) {
          scrollToIndex(currentIndex.value + 1);
        }
      }, autoInterval);
    }
  }
});
```

The HeroCarousel integration enables the following:

- Left and right DPAD buttons navigate between slides.
- Auto-scrolling is paused during navigation.
- Auto-scrolling resumes after navigation completes.
- Focus state is properly tracked for TV interfaces.

### Animated indicators

The HeroCarousel uses animated dot indicators to show the current slide position.

Example:

```javascript
<View style={styles.dotContainer}>
  {data.map((_, i) => (
    <Dot key={`dot-${i}`} index={i} currentIndex={currentIndex} />
  ))}
</View>
```

The Dot component (not shown here) uses Reanimated to animate properties like size, opacity, and color based on whether the slide is currently active.

### Performance optimizations

The HeroCarousel implements several performance optimizations for smooth animations and efficient rendering.

Example

```javascript
<Animated.FlatList
  // @ts-ignore - ref is not typed, Reanimated issue
  ref={flatListRef}
  data={data}
  renderItem={renderItem}
  keyExtractor={(item, index) => `item-${index}-${item.title}`}
  horizontal
  showsHorizontalScrollIndicator={false}
  snapToInterval={layoutWidth}
  snapToAlignment="start"
  scrollEventThrottle={16}
  onScroll={scrollHandler}
  scrollEnabled={!isTV}
  getItemLayout={(_, index) => ({
    length: layoutWidth,
    offset: layoutWidth * index,
    index,
  })}
  initialNumToRender={1}
  maxToRenderPerBatch={2}
  windowSize={3}
  removeClippedSubviews
/>
```

The HeroCarousel performance optimizations include the following:

- **getItemLayout**: Pre-computes item dimensions to avoid expensive layout calculations.
- **initialNumToRender**: Renders only the initial slide to speed up first load.
- **maxToRenderPerBatch**: Limits how many items render in each batch to prevent frame drops.
- **windowSize**: Controls how many items to keep rendered beyond the visible area.
- **removeClippedSubviews**: Detaches off-screen views from the native rendering hierarchy.

### Basic usage

Example:

```javascript
import { HeroCarousel } from '@AppComponents/HeroCarousel/HeroCarousel';

const items = [
  {
    title: 'Welcome',
    description: 'Discover amazing content',
    bgColor: '#1a1a1a',
    backgroundImage: 'https://example.com/image.jpg',
  },
  {
    title: 'Featured Shows',
    description: "Check out this week's highlights",
    bgColor: '#2a2a2a',
    backgroundImage: 'https://example.com/image2.jpg',
  },
  {
    title: 'Coming Soon',
    description: "Don't miss upcoming releases",
    bgColor: '#3a3a3a',
    backgroundImage: 'https://example.com/image3.jpg',
  },
];

// Basic carousel
<HeroCarousel data={items} />;
```

### Carousel with custom settings and handlers

Example:

```javascript
import { HeroCarousel } from '@AppComponents/HeroCarousel/HeroCarousel';

const handleSlidePress = index => {
  console.log(`Slide ${index} pressed`);
  // Navigate to content detail or perform other actions
};

const handleSlideFocus = index => {
  console.log(`Slide ${index} focused`);
  // Update UI or application state based on focused slide
};

<HeroCarousel
  data={items}
  autoInterval={5000} // 5 seconds between slides
  backgroundColor="#000000"
  onPress={handleSlidePress}
  onFocus={handleSlideFocus}
/>;
```

### Recommended practices for TV carousels

- **Use high-quality images.** Hero carousels are prime screen real estate, so use high-quality, engaging visuals.

Example:

```javascript
const items = [
  {
    title: 'Featured Movie',
    description: 'Watch now in 4K HDR',
    bgColor: '#1a1a1a',
    backgroundImage: 'https://example.com/high-res-image.jpg', // Use 16:9 aspect ratio images
  },
  // More items...
];
```

- **Keep text concise.** Text in carousel slides should be brief and readable from a distance.

Example:

```javascript
const items = [
  {
    title: 'New Series', // Short, impactful title
    description: 'All episodes now streaming', // Brief description
    bgColor: '#1a1a1a',
    backgroundImage: 'https://example.com/image.jpg',
  },
  // More items...
];
```

- **Limit number of slides.** 3-5 slides is usually optimal for hero carousels.

Example:

```javascript
// Good: 3-5 focused slides with unique content
const featuredItems = [
  { title: 'New Releases' /* other props */ },
  { title: 'Top Rated' /* other props */ },
  { title: 'Continue Watching' /* other props */ },
];
```

- **Implement press handlers.** Always make slides interactive and provide clear navigation.

Example:

```javascript
const navigateToContent = index => {
  const destination = ['newReleases', 'topRated', 'continueWatching'][index];

  navigation.navigate(destination);
};

<HeroCarousel data={items} onPress={navigateToContent} />;
```

- **Test with TV remote navigation.** Make sure the carousel works well with DPAD navigation.

Example:

```javascript
// In your testing workflow

// 1. Verify left/right navigation works
test('should navigate slides with left/right buttons', () => {
  // Testing implementation
});

// 2. Verify auto-scrolling pauses during interaction
test('should pause auto-scrolling during user interaction', () => {
  // Testing implementation
});
```

### Example: Home screen with HeroCarousel

Here's an example of using the HeroCarousel in a home screen layout:

Example:

```javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HeroCarousel } from '@AppComponents/HeroCarousel/HeroCarousel';
import { ContentRow } from '@AppComponents/ContentRow/ContentRow';
import { ScreenContainer } from '@AppComponents/containers';

export const HomeScreen = () => {
  const heroItems = [
    {
      title: 'Featured Movie',
      description: 'Watch now in 4K HDR',
      bgColor: '#1a1a1a',
      backgroundImage: 'https://example.com/featured-movie.jpg',
    },
    {
      title: 'New Series',
      description: 'All episodes available now',
      bgColor: '#2a2a2a',
      backgroundImage: 'https://example.com/new-series.jpg',
    },
    {
      title: 'Live Sports',
      description: 'Watch the big game tonight',
      bgColor: '#3a3a3a',
      backgroundImage: 'https://example.com/live-sports.jpg',
    },
  ];

  const handleHeroPress = index => {
    console.log(`Hero slide ${index} pressed`);
    // Navigate to content detail
  };

  return (
    <ScreenContainer testID="home-screen">
      <View style={styles.container}>
        {/* Hero Carousel at the top of the screen */}
        <HeroCarousel
          data={heroItems}
          autoInterval={5000}
          onPress={handleHeroPress}
        />

        {/* Content rows below the hero */}
        <View style={styles.contentRows}>
          <ContentRow title="Continue Watching" type="continue-watching" />
          <ContentRow title="Popular Now" type="popular" />
          <ContentRow title="New Releases" type="new-releases" />
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentRows: {
    marginTop: 40,
  },
});
```

### Available props

The HeroCarousel component accepts the following props:

| Prop              | Type                    | Default    | Description                                         |
| ----------------- | ----------------------- | ---------- | --------------------------------------------------- |
| `data`            | Array<CarouselItem>     | _Required_ | Array of items to display in the carousel.          |
| `backgroundColor` | string                  | '#000'     | Background color of the carousel container.         |
| `autoInterval`    | number                  | 3000       | Time in milliseconds between auto-scrolling slides. |
| `onPress`         | (index: number) => void | -          | Callback function when a slide is pressed.          |
| `onFocus`         | (index: number) => void | -          | Callback function when a slide receives focus.      |
| `onBlur`          | (index: number) => void | -          | Callback function when a slide loses focus.         |

The `CarouselItem` type has the following properties:

| Property          | Type              | Description                                   |
| ----------------- | ----------------- | --------------------------------------------- |
| `title`           | string            | The title text to display on the slide.       |
| `description`     | string            | The description text to display on the slide. |
| `bgColor`         | string            | The background color of the slide.            |
| `backgroundImage` | string (optional) | URL for the slide's background image.         |

### Technical notes

- The HeroCarousel component uses React Native's Animated API for smooth animations.
- Auto-scrolling automatically restarts if the user hasn't interacted with the carousel for the duration of the `autoInterval`.
- On TV platforms, the carousel disables touch-based scrolling and relies exclusively on DPAD navigation.
- The carousel includes accessibility support with the `role="button"` attribute and focus management for screen readers.
- Performance optimizations ensure smooth scrolling even with complex slide content or background images.

### Related components

The HeroCarousel works well with the following components:

- **Grid component**: For displaying content rows below the hero carousel.
- **FocusGuideView**: For managing focus navigation between the carousel and other screen elements.
- **Box component**: Can be used to create custom slide content.
