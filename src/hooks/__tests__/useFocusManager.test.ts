import type { View } from 'react-native';
import { BackHandler } from 'react-native';

import { act, renderHook } from '@testing-library/react-native';

import { useFocusManager, useFocusCollection } from '../useFocusManager';

// Mock BackHandler
jest.mock('react-native', () => ({
  BackHandler: {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
}));

const createMockRef = () =>
  ({
    focus: jest.fn(),
    blur: jest.fn(),
  }) as unknown as View;

describe('useFocusManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useFocusManager());

    expect(result.current.isFocused).toBe(false);
    expect(result.current.ref.current).toBeNull();
  });

  it('should handle focus and blur', async () => {
    const onFocusChange = jest.fn();
    const { result } = renderHook(() => useFocusManager({ onFocusChange }));

    // Mock ref.current
    const mockRef = createMockRef();
    Object.defineProperty(result.current.ref, 'current', {
      writable: true,
      value: mockRef,
    });

    // Test focus
    await act(() => result.current.focus());
    expect(mockRef.focus).toHaveBeenCalled();
    expect(result.current.isFocused).toBe(true);
    expect(onFocusChange).toHaveBeenCalledWith(true);

    // Test blur
    await act(() => result.current.blur());
    expect(mockRef.blur).toHaveBeenCalled();
    expect(result.current.isFocused).toBe(false);
    expect(onFocusChange).toHaveBeenCalledWith(false);
  });

  it('should trap focus when trapFocus is true', () => {
    renderHook(() => useFocusManager({ trapFocus: true }));

    expect(BackHandler.addEventListener).toHaveBeenCalledWith(
      'hardwareBackPress',
      expect.any(Function),
    );

    // Test cleanup
    const mockRemove = jest.fn();
    (BackHandler.addEventListener as jest.Mock).mockReturnValue({
      remove: mockRemove,
    });
    const { unmount } = renderHook(() => useFocusManager({ trapFocus: true }));
    unmount();

    expect(mockRemove).toHaveBeenCalled();
  });
});

describe('useFocusCollection', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should register and manage refs', async () => {
    const { result } = renderHook(() => useFocusCollection());

    const mockRef1 = createMockRef();
    const mockRef2 = createMockRef();

    // Register refs
    await act(() => {
      result.current.registerRef('item1', mockRef1);
      result.current.registerRef('item2', mockRef2);
    });

    // Focus item
    await act(() => result.current.focusItem('item1'));

    // Fast-forward timers
    await act(() => jest.runAllTimers());

    expect(mockRef1.focus).toHaveBeenCalled();
    expect(result.current.getCurrentFocused()).toBe('item1');

    // Blur item
    await act(() => result.current.blurItem('item1'));

    expect(mockRef1.blur).toHaveBeenCalled();
    expect(result.current.getCurrentFocused()).toBeNull();

    // Test ref removal
    await act(() => {
      result.current.registerRef('item1', null);
    });
  });

  it('should handle debounced focus operations', async () => {
    const { result } = renderHook(() => useFocusCollection());

    const mockRef = createMockRef();

    await act(() => {
      result.current.registerRef('item1', mockRef);
    });

    // Multiple rapid focus calls
    await act(() => {
      result.current.focusItem('item1');
      result.current.focusItem('item1');
      result.current.focusItem('item1');
    });

    // Before debounce timeout
    expect(mockRef.focus).not.toHaveBeenCalled();

    // After debounce timeout
    await act(() => {
      jest.runAllTimers();
    });

    // Should only be called once due to debouncing
    expect(mockRef.focus).toHaveBeenCalledTimes(1);
  });

  it('should cleanup timeout on unmount', async () => {
    const { result, unmount } = renderHook(() => useFocusCollection());
    const mockRef = createMockRef();

    await act(() => {
      result.current.registerRef('item1', mockRef);
      result.current.focusItem('item1');
    });

    // Fast-forward timers instead of using real setTimeout
    jest.advanceTimersByTime(0);

    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});
