import React from 'react';

import { render, fireEvent, act } from '@testing-library/react-native';

import { ExampleModal } from '@AppComponents/ExampleModal/ExampleModal';
import { useFocusCollection } from '@AppSrc/hooks';

// Mock de los hooks
jest.mock('@AppSrc/hooks');
jest.mock('@AppTheme', () => ({
  useThemedStyles: () => ({
    modalOverlay: {},
    modalContent: {},
    modalImage: {},
    modalContentPadding: {},
    modalTitle: {},
    modalSubtitle: {},
    modalDescription: {},
    modalButton: {},
    modalButtonFocused: {},
    modalButtonText: {},
  }),
}));

describe('CustomModal', () => {
  const mockProps = {
    isVisible: true,
    imageUrl: 'test-image-url',
    onClose: jest.fn(),
  };

  const mockFocusItem = jest.fn();
  const mockBlurItem = jest.fn();
  const mockRegisterRef = jest.fn();
  const mockGetCurrentFocused = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock del useFocusCollection
    (useFocusCollection as jest.Mock).mockReturnValue({
      registerRef: mockRegisterRef,
      focusItem: mockFocusItem,
      blurItem: mockBlurItem,
      getCurrentFocused: mockGetCurrentFocused,
    });
  });

  it('renders null when not visible', () => {
    const { toJSON } = render(
      <ExampleModal {...mockProps} isVisible={false} />,
    );
    expect(toJSON()).toBeNull();
  });

  it('renders modal content when visible', () => {
    const { getByText } = render(<ExampleModal {...mockProps} />);

    expect(getByText('Total-body balance pilates')).toBeTruthy();
    expect(getByText('34 Min | Intensity ••••')).toBeTruthy();
    expect(getByText('▶ Start workout')).toBeTruthy();
    expect(getByText('✖ Close')).toBeTruthy();
  });

  it('handles modal close request', async () => {
    const { getByTestId } = render(<ExampleModal {...mockProps} />);

    await act(() => {
      fireEvent(getByTestId('modal'), 'requestClose');
    });

    expect(mockProps.onClose).toHaveBeenCalled();
  });
});
