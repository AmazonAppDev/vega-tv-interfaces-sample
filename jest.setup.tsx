/**
 * NOTE: below line will cause lint error because jest-fetch-mock
 * is added to dev-dependencies (and it should be)
 * TODO: consider adjusting eslint config to exclude
 * test-related files from that eslint rule
 */
// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'jest-fetch-mock';
import React from 'react';
import { View } from 'react-native';
import 'react-native/jest/setup';

jest.mock('@amazon-devices/react-native-gesture-handler/jestSetup', () => {}, { virtual: true });
import '@amazon-devices/react-native-kepler/jest/setup';
import type Icon from '@amazon-devices/react-native-vector-icons/MaterialCommunityIcons';
import '@testing-library/jest-native/extend-expect';


// ---------------------------------------------------------------------------
// React Native internals
// ---------------------------------------------------------------------------

jest.mock('react-native/Libraries/Utilities/BackHandler', () => {
  const mock = {
    exitApp: jest.fn(),
    addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    removeEventListener: jest.fn(),
  };
  return { __esModule: true, default: mock, ...mock };
});

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter', () => {
  class Mock { addListener = jest.fn(() => ({ remove: jest.fn() })); }
  return { __esModule: true, default: Mock };
});

jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
  default: { get: () => ({ width: 1920, height: 1080, scale: 1, fontScale: 1 }) },
}));

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: jest.fn(() => ({ width: 1920, height: 1080, scale: 1, fontScale: 1 })),
}));

jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => ({
  getEnforcing: jest.fn(() => ({})),
  get: jest.fn(),
}));

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({}), { virtual: true });
jest.mock('react-native/src/private/animated/NativeAnimatedHelper', () => {
  const noop = jest.fn();
  return { API: new Proxy({}, { get: () => noop }), shouldUseNativeDriver: () => false };
}, { virtual: true });

// ---------------------------------------------------------------------------
// Amazon platform mocks
// ---------------------------------------------------------------------------

fetchMock.enableMocks();

// @ts-expect-error
global.navigator = {};

jest.mock('@amazon-devices/react-native-kepler', () => ({
  __esModule: true,
  HWEvent: jest.fn(),
  useTVEventHandler: jest.fn(),
  useAddKeplerAppStateListenerCallback: jest.fn().mockReturnValue(jest.fn(() => ({ remove: () => {} }))),
  TVFocusGuideView: ({ children }: any) => children,
  InteractionManager: jest.requireActual('react-native').InteractionManager,
  useHideSplashScreenCallback: jest.fn(() => () => {}),
  usePreventHideSplashScreen: jest.fn(),
  useGetCurrentKeplerAppStateCallback: jest.fn(),
  useComponentInstance: jest.fn(() => ({})),
  findNodeHandle: jest.fn(() => 1),
  FocusManager: { setNextFocus: jest.fn() },
  Platform: { OS: 'kepler', isTV: true, select: jest.fn((obj: Record<string, unknown>) => obj['kepler'] ?? obj['default']) },
}));

jest.mock('@amazon-devices/react-native-kepler/Libraries/Utilities/registerGeneratedViewConfig', () => () => {});

jest.mock('@amazon-devices/react-native-reanimated', () => {
  const Reanimated = require('@amazon-devices/react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('@amazon-devices/react-native-gesture-handler', () => {
  const RN = require('react-native');
  return {
    GestureHandlerRootView: RN.View,
    State: {},
    PanGestureHandler: RN.View,
    TapGestureHandler: RN.View,
    gestureHandlerRootHOC: (c: unknown) => c,
    Directions: {},
  };
});

jest.mock('@amazon-devices/react-native-screens', () => ({
  ...jest.requireActual('@amazon-devices/react-native-screens'),
  enableScreens: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('@amazon-devices/react-native-device-info', () =>
  require('@amazon-devices/react-native-device-info/jest/react-native-device-info-mock'),
);

const IconMock: typeof Icon = ({ ...props }) => <View {...props} />;
jest.mock('@amazon-devices/react-native-vector-icons/MaterialCommunityIcons', () => IconMock);
jest.mock('@amazon-devices/react-native-vector-icons/MaterialIcons', () => IconMock);

jest.mock('@amazon-devices/keplerscript-netmgr-lib', () => require('src/test-utils/mocks/keplerscript-netmgr-lib'));
jest.mock('@amazon-devices/asset-resolver-lib', () => require('src/test-utils/mocks/asset-resolver-lib'));
jest.mock('@amazon-devices/keplerscript-kepleri18n-lib', () => require('src/test-utils/mocks/keplerscript-kepleri18n-lib'));

// ---------------------------------------------------------------------------
// Navigation mocks
// ---------------------------------------------------------------------------

const mockNavigation = { navigate: jest.fn(), goBack: jest.fn(), dispatch: jest.fn(), openDrawer: jest.fn(), closeDrawer: jest.fn() };

jest.mock('@amazon-devices/react-navigation__core', () => ({
  useNavigation: () => mockNavigation,
  useRoute: () => ({ params: {} }),
  useFocusEffect: jest.fn(),
  useIsFocused: () => true,
  getFocusedRouteNameFromRoute: jest.fn(),
}));

jest.mock('@amazon-devices/react-navigation__native', () => {
  const React = require('react');
  const RN = require('react-native');
  return {
    NavigationContainer: ({ children }: any) => React.createElement(RN.View, null, children),
    NavigationIndependentTree: ({ children }: any) => children,
    getFocusedRouteNameFromRoute: jest.fn(),
    DrawerActions: { openDrawer: jest.fn(), closeDrawer: jest.fn(), toggleDrawer: jest.fn() },
  };
});

jest.mock('@amazon-devices/react-navigation__stack', () => {
  const React = require('react');
  const RN = require('react-native');
  return {
    createStackNavigator: () => ({
      Navigator: ({ children }: any) => React.createElement(RN.View, null, children),
      Screen: ({ component: Component, children }: any) => {
        if (Component) return React.createElement(Component, { navigation: mockNavigation, route: { params: {} } });
        return React.createElement(RN.View, null, typeof children === 'function' ? children({}) : children);
      },
      Group: ({ children }: any) => React.createElement(RN.View, null, children),
    }),
  };
});

jest.mock('@amazon-devices/react-navigation__drawer', () => {
  const React = require('react');
  const RN = require('react-native');
  return {
    createDrawerNavigator: () => ({
      Navigator: ({ children, drawerContent: DC }: any) => React.createElement(RN.View, null, DC ? React.createElement(DC, { navigation: mockNavigation }) : null, children),
      Screen: ({ component: Component, children }: any) => {
        if (Component) return React.createElement(Component, { navigation: mockNavigation, route: { params: {} } });
        return React.createElement(RN.View, null, typeof children === 'function' ? children({}) : children);
      },
    }),
    useDrawerStatus: () => 'closed',
  };
});

jest.mock('@amazon-devices/react-navigation__elements', () => {
  const RN = require('react-native');
  return {
    HeaderBackButton: RN.View,
    Header: RN.View,
    PlatformPressable: RN.Pressable,
  };
});

// ---------------------------------------------------------------------------
// UI component mocks
// ---------------------------------------------------------------------------

jest.mock('@amazon-devices/kepler-ui-components', () => {
  const React = require('react');
  const RN = require('react-native');
  return {
    createThemeFromPartialTheme: (t: any) => t,
    ThemeProvider: ({ children }: any) => React.createElement(RN.View, null, children),
    useTheme: () => ({
      colors: { primary: '#000', background: '#fff', surface: '#fff', surfaceBright: '#FFFFFF', surfaceDim: '#ECEFF1', onPrimary: '#fff', onBackground: '#000', outline: '#ccc', transparent: 'transparent', secondary: '#666', inversePrimary: '#fff', focusPrimary: '#00f', textBackground: '#333', primaryFixed: '#000' },
      typography: { size: { fontSize: { headline: { sm: 18 }, title: { sm: 14, lg: 24 }, display: { lg: 32 } } }, text: { color: { display: '#fff' } } },
      isDarkTheme: true,
    }),
    useSetTheme: () => jest.fn(),
    Button: (props: any) => React.createElement(RN.Pressable, { ...props, role: 'button' }, props.children ?? React.createElement(RN.Text, null, props.title ?? props.label ?? '')),
    Typography: RN.Text,
    TextInput: RN.TextInput,
  };
});

jest.mock('@amazon-devices/vega-carousel', () => {
  const React = require('react');
  const RN = require('react-native');
  return {
    Carousel: (props: any) => {
      const { dataAdapter: da, renderItem } = props;
      const children: any[] = [];
      if (da?.getItem && da?.getItemCount && renderItem) {
        for (let i = 0; i < da.getItemCount(); i++) {
          children.push(renderItem({ item: da.getItem(i), index: i }));
        }
      }
      return React.createElement(RN.View, { testID: props.testID }, ...children);
    },
  };
});

// ---------------------------------------------------------------------------
// Patch BackHandler on RN module
// ---------------------------------------------------------------------------
beforeAll(() => {
  const RN = require('react-native');
  RN.BackHandler = {
    exitApp: jest.fn(),
    addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    removeEventListener: jest.fn(),
  };
});
