import React from 'react';
import type { NativeSyntheticEvent, TargetedEvent } from 'react-native';
import { Text } from 'react-native';

import { render, fireEvent, act } from '@testing-library/react-native';

import { FlexibleCard } from '../FlexibleCard';

// Mock the FocusManager
jest.mock('@amazon-devices/react-native-kepler', () => ({
  FocusManager: {
    focus: jest.fn(),
  },
}));

// Mock the useThemedStyles hook
jest.mock('@AppTheme', () => ({
  useThemedStyles: () => ({
    outContainer: {
      style: {
        width: 360,
        height: 203,
        borderRadius: 12,
      },
    },
    container: {
      style: {
        width: 360,
        height: 203,
        borderRadius: 12,
      },
    },
    focusBorder: {
      style: {
        width: 360,
        height: 203,
        borderRadius: 12,
      },
    },
    childrenContainer: {
      style: {
        width: 360,
        height: 203,
        borderRadius: 12,
      },
    },
  }),
}));

// Mock Animated and InteractionManager
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  const mockAnimatedValue = {
    setValue: jest.fn(),
    setOffset: jest.fn(),
    flattenOffset: jest.fn(),
    extractOffset: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    removeAllListeners: jest.fn(),
    stopAnimation: jest.fn(),
    setNativeProps: jest.fn(),
  };

  RN.Animated.Value = jest.fn(() => mockAnimatedValue);

  RN.Animated.timing = jest.fn(() => ({
    start: jest.fn(callback => callback?.({ finished: true })),
  }));

  RN.Animated.spring = jest.fn(() => ({
    start: jest.fn(callback => callback?.({ finished: true })),
  }));

  RN.Animated.parallel = jest.fn(() => ({
    start: jest.fn(callback => callback?.({ finished: true })),
  }));

  RN.InteractionManager = {
    runAfterInteractions: jest.fn(callback => callback()),
  };

  return RN;
});

jest.mock('../PlaceholderCard', () => {
  const React = require('react');
  const { View } = require('react-native');

  const PlaceholderCard = () => <View testID="mock-placeholder" />;

  return { PlaceholderCard };
});

const createSyntheticEvent = (): NativeSyntheticEvent<TargetedEvent> =>
  ({
    nativeEvent: {},
  }) as NativeSyntheticEvent<TargetedEvent>;

describe('FlexibleCard', () => {
  const defaultProps = {
    index: 0,
    rowIndex: 0,
    direction: 'horizontal' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { getByTestId } = render(<FlexibleCard {...defaultProps} />);
    expect(getByTestId('flexible-card-1-1')).toBeTruthy();
  });

  it('renders with image when imageUrl is provided', async () => {
    jest.useFakeTimers();

    const { getByTestId } = render(
      <FlexibleCard
        {...defaultProps}
        imageUrl="https://example.com/image.jpg"
        isRowVisible={true}
      />,
    );

    await act(() => {
      jest.advanceTimersByTime(100);
      return Promise.resolve();
    });

    expect(getByTestId('flexible-card-image-1-1')).toBeTruthy();

    jest.useRealTimers();
  });

  it('renders with children when provided', () => {
    const { getByTestId } = render(
      <FlexibleCard {...defaultProps}>
        <Text>Test Content</Text>
      </FlexibleCard>,
    );
    expect(getByTestId('flexible-card-children')).toBeTruthy();
  });

  it('calls onPress when pressed', async () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <FlexibleCard {...defaultProps} onPress={onPress} />,
    );

    await act(async () => {
      await fireEvent.press(getByTestId('flexible-card-1-1'));
    });

    expect(onPress).toHaveBeenCalled();
  });

  it('applies custom size when provided', () => {
    const customSize = {
      width: 300,
      height: 200,
      radius: 10,
      gap: 15,
    };

    const { getByTestId } = render(
      <FlexibleCard {...defaultProps} customSize={customSize} />,
    );

    const container = getByTestId('flexible-card-1-1');
    expect(container).toBeTruthy();
  });

  it('applies different animations when focused', async () => {
    const animations: 'zoomIn' | 'zoomOut' = 'zoomIn';

    const { getByTestId } = render(
      <FlexibleCard {...defaultProps} animations={animations} />,
    );

    const card = getByTestId('flexible-card-1-1');

    await act(async () => {
      card.props['onFocus']?.(createSyntheticEvent());
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(card).toBeTruthy();
  });

  it('renders with different sizes', () => {
    const sizes = ['small', 'medium', 'large'] as const;

    sizes.forEach(size => {
      const { getByTestId } = render(
        <FlexibleCard {...defaultProps} size={size} />,
      );
      expect(getByTestId('flexible-card-1-1')).toBeTruthy();
    });
  });

  it('renders with different directions', () => {
    const directions = ['horizontal', 'vertical', 'expand'] as const;

    directions.forEach(direction => {
      const { getByTestId } = render(
        <FlexibleCard {...defaultProps} direction={direction} />,
      );
      expect(getByTestId('flexible-card-1-1')).toBeTruthy();
    });
  });

  it('does not focus non-first cards on mount', async () => {
    render(<FlexibleCard index={1} rowIndex={0} direction="horizontal" />);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(
      require('@amazon-devices/react-native-kepler').FocusManager.focus,
    ).not.toHaveBeenCalled();
  });
});
