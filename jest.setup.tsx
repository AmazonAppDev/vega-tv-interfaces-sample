/**
 * NOTE: below line will cause lint error because jest-fetch-mock
 * is added to dev-dependencies (and it should be)
 * TODO: consider adjusting eslint config to exclude
 * test-related files from that eslint rule
 */
// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'jest-fetch-mock';
import React from 'react';
import { type ScaledSize, View } from 'react-native';
import 'react-native/jest/setup';
import 'react-native-gesture-handler/jestSetup';

import '@amazon-devices/react-native-gesture-handler/jestSetup';
import { type HWEvent } from '@amazon-devices/react-native-kepler';
import '@amazon-devices/react-native-kepler/jest/setup';
import type Icon from '@amazon-devices/react-native-vector-icons/MaterialCommunityIcons';
import '@testing-library/jest-native/extend-expect';

// Mock NativeModules before any imports
jest.mock('react-native/Libraries/BatchedBridge/NativeModules', () => ({
  UIManager: {
    RCTView: () => {},
  },
  PlatformConstants: {
    getConstants: () => ({
      isTesting: true,
    }),
  },
  NativeModules: {},
}));

fetchMock.enableMocks();

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

jest.mock(
  '@amazon-devices/react-native-vector-icons/MaterialCommunityIcons',
  () => IconMock,
);

jest.mock('@amazon-devices/react-native-vector-icons/MaterialIcons', () => IconMock);

// @ts-expect-error
global.navigator = {};

jest.mock('@amazon-devices/keplerscript-netmgr-lib', () =>
  require('src/test-utils/mocks/keplerscript-netmgr-lib'),
);

jest.mock('@amazon-devices/asset-resolver-lib', () =>
  require('src/test-utils/mocks/asset-resolver-lib'),
);

jest.mock('@amazon-devices/keplerscript-kepleri18n-lib', () =>
  require('src/test-utils/mocks/keplerscript-kepleri18n-lib'),
);

jest.mock(
  '@amazon-devices/react-native-kepler/Libraries/Utilities/registerGeneratedViewConfig',
  () => () => {},
);

jest.mock('@amazon-devices/react-native-kepler', () => {
  return {
    __esModule: true,
    HWEvent: jest.fn(),
    KeplerAppStateChange: jest.fn(),
    useCallback: jest.fn(),
    useTVEventHandler: jest.fn((evt: HWEvent) => {
      return evt;
    }),
    useAddKeplerAppStateListenerCallback: jest.fn().mockReturnValue(jest.fn()),
    TVFocusGuideView: jest.fn(({ children }) => children),
    default: jest.fn(),
    InteractionManager: jest.requireActual(
      '@amazon-devices/react-native-kepler/Libraries/Interaction/InteractionManager',
    ),
    useHideSplashScreenCallback: jest.fn(() => () => {}),
    usePreventHideSplashScreen: jest.fn(),
    Switch: jest.fn(),
    findNodeHandle: jest.fn(() => 1),
    FocusManager: {
      setNextFocus: jest.fn(),
    },
    Platform: {
      isTV: true,
    },
  };
});

// Mock Platform
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn((obj) => obj.ios),
}));

// Mock StyleSheet
jest.mock('react-native/Libraries/StyleSheet/StyleSheet', () => ({
  create: jest.fn((styles) => ({ ...styles })),
  compose: (style1: Object, style2: Object) => ({ ...style1, ...style2 }),
  flatten: (style: Object) => {
    const flattenStyle = require('react-native/Libraries/StyleSheet/flattenStyle');
    return flattenStyle(style);
  },
  hairlineWidth: 1,
}));

// Mock NativeEventEmitter
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter', () => {
  class MockNativeEventEmitter {
    addListener = jest.fn();
    removeListener = jest.fn();
    emit = jest.fn();
  }
  return MockNativeEventEmitter;
});

const mockedDimensionsValue: ScaledSize = {
  width: 375,
  height: 667,
  scale: 2,
  fontScale: 2,
};

jest.mock('react-native/Libraries/Utilities/Dimensions', () => {
  return {
    default: {
      get: () => mockedDimensionsValue,
    },
  };
});

const mockUseWindowDimensions = jest.fn(() => mockedDimensionsValue);

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: mockUseWindowDimensions,
}));

jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => {
  return {
    getEnforcing: jest.fn((name) => {
      switch (name) {
        case 'ImageLoader':
          return {
            getSize: jest.fn((_url) => Promise.resolve([320, 240])),
            prefetchImage: jest.fn(),
          };

        default:
          return {};
      }
    }),
    get: jest.fn(),
  };
});

// include this section and the NativeAnimatedHelper section for mocking react-native-reanimated
jest.mock('@amazon-devices/react-native-reanimated', () => {
  const Reanimated = require('@amazon-devices/react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');